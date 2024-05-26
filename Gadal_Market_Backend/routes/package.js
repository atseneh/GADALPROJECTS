const express = require('express');
const router = express.Router();
const Package = require('../models/package.model'); 
const Product = require("../models/product.model");
const User = require("../models/user.model");
const verifyToken = require('../verifyToken');
const { ObjectId } = require('mongoose').Types;
const request = require('request');
const axios = require('axios');
require('dotenv').config(); 
// Middleware for initializing transaction
async function initializeTransaction(req, res, next) {
  let { amount,user } = req.body;
  if (!amount) {
    return res.status(400).send({ error: 'Amount is required' });
  }
  const currentuser = await User.findById(user);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  // Extract required user details
  const { email, firstName, lastName, phoneNumber } = currentuser;
  // Generate unique tx_ref
  const txRef = `gadaltechuniquekey-${Date.now()}-6669`;
  req.txRef = txRef; // Attach txRef to the request object

  // Convert amount to string
  amount = amount.toString();

  const callbackUrl = `${process.env.CALLBACK_BASE_URL}/transaction/verify/${txRef}`;
  console.log(`Callback URL: ${callbackUrl}`);

  const options = {
    method: 'POST',
    url: `${process.env.CHAPA_API_URL}/transaction/initialize`,
    headers: {
      'Authorization': `Bearer ${process.env.CHAPA_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "amount": amount,
      "currency": "ETB",
      // "email": email,
      "first_name": firstName,
      "last_name": lastName,
      "phone_number": phoneNumber,
      "tx_ref": txRef,
      // "callback_url": callbackUrl,
      "return_url": `${process.env.CALLBACK_BASE_URL}/verifyPayment/paymentSuccessfull/${txRef}?serviceType=package`,
      "customization[title]": "Payment for my favourite merchant",
      "customization[description]": "I love online payments"
    })
  };

  console.log('Request options:', options);

  request(options, function (error, response, body) {
    if (error) {
      console.error('Request error:', error);
      return res.status(500).send({ error: error.message });
    }

    console.log('Response:', body);

    try {
      const jsonResponse = JSON.parse(body);
      if (jsonResponse.status === "success" && jsonResponse.data && jsonResponse.data.checkout_url) {
        // Attach the transaction details to the request object
        req.transaction = jsonResponse.data;
        next();
      } else {
        res.status(400).send({ error: 'Failed to initialize transaction', details: jsonResponse });
      }
    } catch (parseError) {
      console.error('Parse error:', parseError);
      res.status(500).send({ error: 'Failed to parse response from Chapa', details: parseError.message });
    }
  });
}

router.post('/package', initializeTransaction, async (req, res) => {
  try {
    
    req.body.isPayed = false;
    req.body.transactionReference= req.txRef
    const newPackage = await Package.create(req.body);
    // Include the transaction info and txRef in the response
    res.status(201).json({ newPackage, transaction: req.transaction, txRef: req.txRef });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/packages', async (req, res) => {
  try {
    let filter = {};
    Object.keys(req.query).forEach((key) => {
      filter[key] = req.query[key];
    });
    const packages = await Package.find(filter).populate('packageDefinition');
    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/usersPackage',verifyToken, async (req, res) => {
  const {_id:userId} = req.user; 
  try {
    const currentDate = new Date();
    const packages = await Package.aggregate([
      { $match: { user: new ObjectId(userId) } },
      {
        $lookup: {
          from: 'packagedefinitions',
          localField: 'packageDefinition',
          foreignField: '_id',
          as: 'packageDefinition'
        }
      },
      { $unwind: '$packageDefinition' },
      {
        $addFields: {
          isValid: {
            $or: [
              { $gt: ['$endDate', currentDate] },
              {
                $and: [
                  { $lte: ['$remainingGoldPosts', 0] },
                  { $lte: ['$remainingPremiumPosts', 0] },
                  { $lte: ['$remainingBasicPosts', 0] }
                ]
              }
            ]
          }
        }
      }
    ]);

    if (packages.length === 0) {
      return res.status(404).json({ message: 'No packages found for the user.' });
    }
    res.status(200).json(packages);
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.get('/packages/:id', async (req, res) => {
  try {
    const pack = await Package.findById(req.params.id);
    if (!pack) {
      return res.status(404).json({ message: 'Package not found' });
    }
    res.status(200).json(pack);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/packages/:id', async (req, res) => {
  try {
    const updatePackage = await Package.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatePackage) {
      return res.status(404).json({ message: 'Package not found' });
    }
    res.status(200).json(updatePackage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/packages/:id', async (req, res) => {
  try {
    const deletePackage = await Package.findByIdAndRemove(req.params.id);
    if (!deletePackage) {
      return res.status(404).json({ message: 'Package not found' });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.put('/Transaction/verify/:txRef', async (req, res) => {
  const { txRef } = req.params;
  const { serviceType } = req.body;
  const chapaVerificationUrl = `${process.env.CHAPA_API_URL}/transaction/verify/${txRef}`;
  console.log(chapaVerificationUrl);
  const options = {
    method: 'GET',
    url: chapaVerificationUrl,
    headers: {
      'Authorization': `Bearer ${process.env.CHAPA_API_KEY}`,
      'Content-Type': 'application/json'
    }
  };

  try {
    const response = await axios(options);
    const jsonResponse = response.data;

    console.log('Verification response:', jsonResponse);

    if (jsonResponse.status === "success") {
      console.log('Payment verified successfully:', jsonResponse);
      if(serviceType==='product'){
          // Find the package by transactionReference and update isPayed to true
          const updatedProduct = await Product.findOneAndUpdate(
            { transactionReference: txRef },
            { isPayed: true },
            { new: true }
          );
          if (updatedProduct) {
            res.send({ message: 'Payment verified and product updated successfully', data: jsonResponse, updatedPackage });
          } else {
            res.status(404).send({ error: 'Product not found for the given transaction reference' });
          }
      } 
      else
      {
        // Find the package by transactionReference and update isPayed to true
        const updatedPackage = await Package.findOneAndUpdate(
          { transactionReference: txRef },
          { isPayed: true },
          { new: true }
        );

        if (updatedPackage) {
          res.send({ message: 'Payment verified and package updated successfully', data: jsonResponse, updatedPackage });
        } else {
          res.status(404).send({ error: 'Package not found for the given transaction reference' });
        }
      }
     
    } else {
      console.log('Payment verification failed:', jsonResponse);
      res.status(400).send({ error: 'Payment verification failed', details: jsonResponse });
    }
  } catch (error) {
    console.error('Verification request error:', error);
    res.status(500).send({ error: error.message });
  }
});
module.exports = router;
