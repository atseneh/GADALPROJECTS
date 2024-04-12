const express = require('express');
const router = express.Router();
const Package = require('../models/package.model'); 
const verifyToken = require('../verifyToken');

router.post('/package', async (req, res) => {
  try {
    const newPackage = await Package.create(req.body);
    res.status(201).json(newPackage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/packages', async (req, res) => {
  try {
    let filter = {};
    Object.keys(req.query).forEach((key) => {
      filter[key] = req.query[key];
    });
    const packages = await Package.find(filter).populate('packageDefinition');
    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get('/usersPackage', async (req, res) => {
  const userId = req.query.user; 
  try {
    const packages = await Package.find({ user: userId }).populate('packageDefinition');
    if (packages.length === 0) {
      return res.status(404).json({ message: 'No packages found for the user.' });
    }
    res.status(200).json(packages);
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.get('/packages/:id', async (req, res) => {
  try {
    const pack = await Package.findById(req.params.id);
    if (!pack) {
      return res.status(404).json({ message: 'Package not found' });
    }
    res.status(200).json(pack);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/packages/:id', async (req, res) => {
  try {
    const updatePackage = await Package.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatePackage) {
      return res.status(404).json({ message: 'Package not found' });
    }
    res.status(200).json(updatePackage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/packages/:id', async (req, res) => {
  try {
    const deletePackage = await Package.findByIdAndRemove(req.params.id);
    if (!deletePackage) {
      return res.status(404).json({ message: 'Package not found' });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
