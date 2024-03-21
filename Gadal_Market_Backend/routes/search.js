const express = require('express');
const router = express.Router();
const Product = require('../models/productModel.model');

// Search endpoint for all fields with sorting and pagination
router.get('/search', async (req, res) => {
  try {
    const { q, sortBy, sortOrder, page, pageSize } = req.body;

    // Use Mongoose find to search across multiple fields
    const products = await Product.find({
      $or: [
        { title: typeof q === 'string' ? { $regex: q, $options: 'i' } : undefined },
        { description: typeof q === 'string' ? { $regex: q, $options: 'i' } : undefined },
        {
          productType: isNaN(q) ? undefined : parseInt(q),
        }, // Only apply the regex if the query is a number
        // Add more fields as needed for your search
      ].filter((condition) => condition !== undefined), // Filter out undefined conditions
    })
      .populate('category')
      .populate('consignee')
      .populate('currency')
      .populate('brand')
      .populate('model')
      .populate('location')
      .populate('subCity')
      .populate('wereda')
      .populate('switch')
      .sort({ [sortBy || 'date']: sortOrder || 'desc' }) // Default to sorting by date in descending order
      .skip((page - 1) * (pageSize || 10)) // Default to 10 records per page
      .limit(pageSize || 10);

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
