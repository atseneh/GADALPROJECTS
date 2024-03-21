const express = require('express');
const router = express.Router();
const Wereda = require('../models/wereda.model');

router.post('/wereda', async (req, res) => {
  try {
    const newWereda = await Wereda.create(req.body);
    res.status(201).json(newWereda);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/wereda', async (req, res) => {
  try {
    let filter = {};
    Object.keys(req.query).forEach((key) => {
      filter[key] = req.query[key];
    });

    const weredas = await Wereda.find(filter);
    res.status(200).json(weredas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get('/wereda/:id', async (req, res) => {
  try {
    const wereda = await Wereda.findById(req.params.id);
    if (!wereda) {
      return res.status(404).json({ message: 'Wereda not found' });
    }
    res.status(200).json(wereda);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/wereda/:id', async (req, res) => {
  try {
    const updatedWereda = await Wereda.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedWereda) {
      return res.status(404).json({ message: 'Wereda not found' });
    }
    res.status(200).json(updatedWereda);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/wereda/:id', async (req, res) => {
  try {
    const deletedWereda = await Wereda.findByIdAndRemove(req.params.id);
    if (!deletedWereda) {
      return res.status(404).json({ message: 'Wereda not found' });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
