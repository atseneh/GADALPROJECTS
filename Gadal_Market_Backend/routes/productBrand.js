const express = require('express');
const router = express.Router();
const ProductBrand = require('../models/productBrand.model');
const Product = require('../models/product.model');
const mongoose = require('mongoose')
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
    // console.log("product by category")
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

router.get('/getProductBrandsByCategory/:category', async (req, res) => {
  try {
      // const categoryId = req.params.category; 
      const categoryId = new mongoose.Types.ObjectId(req.params.category);
      // console.log(categoryId)
      const brandsWithProductCount = await Product.aggregate([
        {
          $match: {
            category: categoryId
          }
        },
        {
          $lookup: {
            from: 'productbrands',
            localField: 'brand',
            foreignField: '_id',
            as: 'brandInfo'
          }
        },
        {
          $unwind: '$brandInfo'
        },
        {
          $group: {
            _id: '$brandInfo',
            id: { $first: '$brandInfo._id' },
            name: { $first: '$brandInfo.description' },
            icon: { $first: '$brandInfo.icon' },
            productCount: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: '$id',
            name: 1,
            icon: 1,
            productCount: 1
          }
        }
      ]);
  
      res.json(brandsWithProductCount); 
      // const productBrands = await ProductBrand.find({ category: categoryId }).populate('category');
      // const productBrandsWithCount = await Promise.all(productBrands.map(async (brand) => {
      //     const productCount = await Product.countDocuments({ brand: brand._id });
      //     return {
      //         brand: brand,
      //         productCount: productCount
      //     };
      // }));
      // res.json(productBrandsWithCount);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
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
