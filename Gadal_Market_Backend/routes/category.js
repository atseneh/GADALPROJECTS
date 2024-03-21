const express = require('express');
const router = express.Router();
const Category = require('../models/category.modle');

router.post('/categories', async (req, res) => {
  try {
    const newCategory = await Category.create(req.body);
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const { name, serviceId,remark, recordStatus } = req.query;
    const filter = {};

    if (name) {
      filter.name = { $regex: new RegExp(name, 'i') };
    }

    if (serviceId) {
      filter.serviceId = parseInt(serviceId, 10);
    }
    if (remark) {
      filter.remark = { $regex: new RegExp(remark, 'i') };
    }
    if (recordStatus) {
      filter.recordStatus = parseInt(recordStatus, 10);
    }

    const categories = await Category.find(filter);

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/categories/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get('/categories/:serviceId', async (req, res) => {
  try {
    const serviceId = req.params.serviceId;
    const categories = await Category.find({ serviceId });

    if (categories.length === 0) {
      return res.status(404).json({ message: 'No categories found for the provided serviceId.' });
    }

    res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.put('/categories/:id', async (req, res) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/categories/:id', async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndRemove(req.params.id);
    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
