const express = require('express');
const router = express.Router();
const PackageDefinition = require('../models/packageDefinition.model'); 

router.post('/packageDefinition', async (req, res) => {
    try {
      const packageDefinitions = req.body;
      const createdPackageDefinitions = [];
  
      for (const definitionData of packageDefinitions) {
        const newPackageDefinition = await PackageDefinition.create(definitionData);
        createdPackageDefinitions.push(newPackageDefinition);
      }
  
      res.status(201).json(createdPackageDefinitions);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  
router.get('/packageDefinition', async (req, res) => {
  try {
    let filter = {};
    Object.keys(req.query).forEach((key) => {
      filter[key] = req.query[key];
    });
    const packages = await PackageDefinition.find(filter);
    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/packageDefinition/:id', async (req, res) => {
  try {
    const pack = await PackageDefinition.findById(req.params.id);
    if (!pack) {
      return res.status(404).json({ message: 'Package not found' });
    }
    res.status(200).json(pack);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/packageDefinition/:id', async (req, res) => {
  try {
    const updatePackage = await PackageDefinition.findByIdAndUpdate(
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

router.delete('/packageDefinition/:id', async (req, res) => {
  try {
    const deletePackage = await PackageDefinition.findByIdAndRemove(req.params.id);
    if (!deletePackage) {
      return res.status(404).json({ message: 'Package not found' });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
