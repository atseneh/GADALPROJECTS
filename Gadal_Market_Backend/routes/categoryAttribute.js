const express = require('express');
const router = express.Router();
const CategoryAttributes = require('../models/categoryAttribute.model'); 
const Product = require("../models/product.model");
router.post('/categoryAttributes', async (req, res) => {
  try {
    const newCategoryAttributes = await CategoryAttributes.create(req.body);
    res.status(201).json(newCategoryAttributes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/ExistedcategoryAttributes', async (req, res) => {
  try {
    const categoryFilter = req.query.category;

    const products = await Product.find(categoryFilter ? { category: categoryFilter } : {}).lean();

    if (products.length === 0) {
      return res.status(404).json({ message: 'No products found.' });
    }

    const attributesList = [];
    products.forEach((product) => {
      product.attributes.forEach((attribute) => {
        const existingAttribute = attributesList.find((attr) => attr.name === attribute.name);

        if (existingAttribute) {
          
          if (!existingAttribute.values.includes(attribute.value)) {
            existingAttribute.values.push(attribute.value);
          }
        } else {
          attributesList.push({
            name: attribute.name,
            values: [attribute.value],
          });
        }
      });
    });

    res.status(200).json(attributesList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get('/categoryAttributes', async (req, res) => {
  const filters = req.query
  try {
    const categoryId = req.query.category;

    let filter = {};
    if (categoryId) {
      filter.category = categoryId;
    }
    const categoryAttributes = await CategoryAttributes.find(filters);

    res.status(200).json(categoryAttributes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get('/categoryAttributes/:id', async (req, res) => {
  try {
    const categoryAttributes = await CategoryAttributes.findById(req.params.id);
    if (!categoryAttributes) {
      return res.status(404).json({ message: 'CategoryAttributes not found' });
    }
    res.status(200).json(categoryAttributes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/categoryAttributes/:id', async (req, res) => {
  try {
    const updatedCategoryAttributes = await CategoryAttributes.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedCategoryAttributes) {
      return res.status(404).json({ message: 'CategoryAttributes not found' });
    }
    res.status(200).json(updatedCategoryAttributes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/categoryAttributes/:id', async (req, res) => {
  try {
    const deletedCategoryAttributes = await CategoryAttributes.findByIdAndRemove(req.params.id);
    if (!deletedCategoryAttributes) {
      return res.status(404).json({ message: 'CategoryAttributes not found' });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
