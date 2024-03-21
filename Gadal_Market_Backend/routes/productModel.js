const express = require('express');
const router = express.Router();
const ProductModel = require('../models/productModel.model');

router.post('/productModels', async (req, res) => {
  try {
    const newProductModel = await ProductModel.create(req.body);
    res.status(201).json(newProductModel);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/productModels', async (req, res) => {
  try {
    let filter = {};
    Object.keys(req.query).forEach((key) => {
      filter[key] = req.query[key];
    });
    const productModels = await ProductModel.find(filter);
    res.status(200).json(productModels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/productModels/:id', async (req, res) => {
  try {
    const productModel = await ProductModel.findById(req.params.id);
    if (!productModel) {
      return res.status(404).json({ message: 'ProductModel not found' });
    }
    res.status(200).json(productModel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/productModels/:id', async (req, res) => {
  try {
    const updatedProductModel = await ProductModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProductModel) {
      return res.status(404).json({ message: 'ProductModel not found' });
    }
    res.status(200).json(updatedProductModel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/productModels/:id', async (req, res) => {
  try {
    const deletedProductModel = await ProductModel.findByIdAndRemove(req.params.id);
    if (!deletedProductModel) {
      return res.status(404).json({ message: 'ProductModel not found' });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
