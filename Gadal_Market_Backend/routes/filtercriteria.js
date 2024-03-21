const express = require('express');
const router = express.Router();
const Product = require("../models/product.model");
const { Number, Schema } = require('mongoose');

router.get('/filter/attributes', async (req, res) => {
    try {
        const categoryFilter = req.query.category; 

        const products = await Product.find(categoryFilter ? { category: categoryFilter } : {}).lean();
  
      const attributeList = {};
  
      products.forEach(product => {
        product.attributes.forEach(attribute => {
          const attributeName = attribute.name;
          const attributeValue = attribute.value;
  
          if (!attributeList[attributeName]) {
            attributeList[attributeName] = new Set();
          }
  
          attributeList[attributeName].add(attributeValue);
        });

      });
  
     
      const distinctAttributes = {};
      Object.keys(attributeList).forEach(attribute => {
        distinctAttributes[attribute] = Array.from(attributeList[attribute]);
      });
  
      res.json(distinctAttributes); 
    } catch (error) {
      res.status(500).json({ error: error });
    }
  });
  
module.exports = router;