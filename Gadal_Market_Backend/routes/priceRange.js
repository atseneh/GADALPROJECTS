const express = require('express');
const router = express.Router();
const Product = require("../models/product.model");
const { Number, Schema } = require('mongoose');


router.get('/priceRange', async (req, res) => {
  try {
    
    const categoryFilter = req.query.category; 

    const products = await Product.find(categoryFilter ? { category: categoryFilter } : {}).lean();
    if (products.length === 0) {
      return res.status(404).json({ message: 'No products found.' });
    }
     
    let minPrice =0;
    let maxPrice = 0;

    products.forEach((product) => {
        
        let currentPrice = parseFloat(product.currentPrice);
        if (isNaN(currentPrice)) {
          currentPrice = 0;
        }
      
        if (currentPrice < minPrice) {
          minPrice = currentPrice;
        }
        if (currentPrice > maxPrice) {
          maxPrice = currentPrice;
        }
      });
  
    const priceRangeStep = (maxPrice - minPrice) / 5;
    const priceRanges = [];
  
    for (let i = 0; i < 5; i++) {
      const rangeMin = minPrice + i * priceRangeStep;
      const rangeMax = minPrice + (i + 1) * priceRangeStep;
      priceRanges.push({
        min: rangeMin,
        max: rangeMax,
      })
    }

    res.status(200).json(priceRanges);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
