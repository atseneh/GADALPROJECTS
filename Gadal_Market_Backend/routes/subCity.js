const express = require('express');
const router = express.Router();
const SubCity = require('../models/subCity.model'); 

router.post('/subCities', async (req, res) => {
  try {
    const newSubCity = await SubCity.create(req.body);
    res.status(201).json(newSubCity);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/subCities', async (req, res) => {
  const filters = req.query
    try {
      let filter = {};
      Object.keys(req.query).forEach((key) => {
        filter[key] = req.query[key];
      });
      const subCities = await SubCity.find(filter);
      res.status(200).json(subCities);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

router.get('/subCities/:id', async (req, res) => {
  try {
    const subCity = await SubCity.findById(req.params.id);
    if (!subCity) {
      return res.status(404).json({ message: 'SubCity not found' });
    }
    res.status(200).json(subCity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/subCities/:id', async (req, res) => {
  try {
    const updatedSubCity = await SubCity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedSubCity) {
      return res.status(404).json({ message: 'SubCity not found' });
    }
    res.status(200).json(updatedSubCity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/subCities/:id', async (req, res) => {
  try {
    const deletedSubCity = await SubCity.findByIdAndRemove(req.params.id);
    if (!deletedSubCity) {
      return res.status(404).json({ message: 'SubCity not found' });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
