const express = require('express');
const router = express.Router();
const EngagmentPrice = require('../models/engagmentPrice.modle');

router.post('/engagmentPrices', async (req, res) => {
  try {
    const newEngagmentPrice = await EngagmentPrice.create(req.body);
    res.status(201).json(newEngagmentPrice);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/engagmentPrices', async (req, res) => {
  try {
    const engagmentPrices = await EngagmentPrice.find();
    res.status(200).json(engagmentPrices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/engagmentPrices/:id', async (req, res) => {
  try {
    const engagmentPrice = await EngagmentPrice.findById(req.params.id);
    if (!engagmentPrice) {
      return res.status(404).json({ message: 'EngagmentPrice not found' });
    }
    res.status(200).json(engagmentPrice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/engagmentPricesUpdate/:id', async (req, res) => {
  try {
    const updatedEngagmentPrice = await EngagmentPrice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedEngagmentPrice) {
      return res.status(404).json({ message: 'EngagmentPrice not found' });
    }
    res.status(200).json(updatedEngagmentPrice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.delete('/engagmentPrices/:id', async (req, res) => {
  try {
    const deletedEngagmentPrice = await EngagmentPrice.findByIdAndRemove(req.params.id);
    if (!deletedEngagmentPrice) {
      return res.status(404).json({ message: 'EngagmentPrice not found' });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
