const express = require('express');
const router = express.Router();
const ProductBrand = require('../models/productBrand.model');

router.post('/productBrands', async (req, res) => {
  try {
    const newProductBrand = await ProductBrand.create(req.body);
    res.status(201).json(newProductBrand);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/productBrands', async (req, res) => {
  try {
    let filter = {};
    Object.keys(req.query).forEach((key) => {
      filter[key] = req.query[key];
    });
    const productBrands = await ProductBrand.find(filter);
    res.status(200).json(productBrands);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/productBrands/:id', async (req, res) => {
  try {
    const productBrand = await ProductBrand.findById(req.params.id);
    if (!productBrand) {
      return res.status(404).json({ message: 'ProductBrand not found' });
    }
    res.status(200).json(productBrand);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/productBrands/:id', async (req, res) => {
  try {
    const updatedProductBrand = await ProductBrand.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProductBrand) {
      return res.status(404).json({ message: 'ProductBrand not found' });
    }
    res.status(200).json(updatedProductBrand);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/productBrands/:id', async (req, res) => {
  try {
    const deletedProductBrand = await ProductBrand.findByIdAndRemove(req.params.id);
    if (!deletedProductBrand) {
      return res.status(404).json({ message: 'ProductBrand not found' });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
