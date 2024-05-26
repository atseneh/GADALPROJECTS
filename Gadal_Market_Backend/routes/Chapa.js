const express = require('express');
const request = require('request');
const router = express.Router();
require('dotenv').config(); 

router.post('/initialize-transaction', (req, res) => {

  let { amount, email, first_name, last_name, phone_number } = req.body;
  if (!amount) {
    return res.status(400).send({ error: 'Amount is required' });
  }
  // Generate unique tx_ref
  const txRef = `gadaltechuniqkey-${Date.now()}-6669`;
  // Convert amount to string
  amount = amount.toString();
  const callbackUrl = `${process.env.CHAPA_API_URL}/transaction/verify/${txRef}`;
  console.log(callbackUrl)
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
      "email": email,
      "first_name": first_name,
      "last_name": last_name,
      "phone_number": phone_number,
      "tx_ref": txRef,
      "callback_url": callbackUrl,
      "return_url": "https://gadalmarket.com",
      "customization[title]": "Payment for my favourite merchant",
      "customization[description]": "I love online payments"
    })
  };

  request(options, function (error, response, body) {
    if (error) {
      return res.status(500).send({ error: error.message });
    }

    try {
      const jsonResponse = JSON.parse(body);
      if (jsonResponse.status === "success" && jsonResponse.data && jsonResponse.data.checkout_url) {
        res.send({jsonResponse});
      } else {
        res.status(400).send({ error: 'Failed to initialize transaction', details: jsonResponse });
      }
    } catch (parseError) {
      res.status(500).send({ error: 'Failed to parse response from Chapa', details: parseError.message });
    }
  });
});
router.get('/packageTransaction/verify/:txRef', (req, res) => {
  const { txRef } = req.params;
  const chapaVerificationUrl = `${process.env.CHAPA_API_URL}/transaction/verify/${txRef}`;
  const options = {
    method: 'GET',
    url: chapaVerificationUrl,
    headers: {
      'Authorization': `Bearer ${process.env.CHAPA_API_KEY}`,
      'Content-Type': 'application/json'
    }
  };
  request(options, function (error, response, body) {
    if (error) {
      console.error('Verification request error:', error);
      return res.status(500).send({ error: error.message });
    }

    console.log('Verification response:', body);

    try {
      const jsonResponse = JSON.parse(body);
      if (jsonResponse.status === "success") {
        console.log('Payment verified successfully:', jsonResponse);
        res.send({ message: 'Payment verified successfully', data: jsonResponse });
      } else {
        console.log('Payment verification failed:', jsonResponse);
        res.status(400).send({ error: 'Payment verification failed', details: jsonResponse });
      }
    } catch (parseError) {
      console.error('Parse error:', parseError);
      res.status(500).send({ error: 'Failed to parse verification response from Chapa', details: parseError.message });
    }
  });
});

module.exports = router;
