const express = require('express');
const router = express.Router();
const Assets = require('../models/asset.model'); 

router.post('/assets', async (req, res) => {
  try {
    const newAsset = await Assets.create(req.body);
    res.status(201).json(newAsset);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/assets', async (req, res) => {
  try {
    
    const query = {};
    if (req.query.description) {
      query.description = { $regex: new RegExp(req.query.description, 'i') };
    }
    if (req.query.remark) {
      query.remark = { $regex: new RegExp(req.query.remark, 'i') };
    }
    if (req.query.recordStatus) {
      query.recordStatus = parseInt(req.query.recordStatus, 10);
    }
    if (req.query.assetType) {
      query.assetType = parseInt(req.query.assetType, 10);
    }

    const assets = await Assets.find(query);

    res.status(200).json(assets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get('assets/:id', async (req, res) => {
  try {
    const asset = await Assets.findById(req.params.id);
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }
    res.status(200).json(asset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/assets/:id', async (req, res) => {
  try {
    const updatedAsset = await Assets.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedAsset) {
      return res.status(404).json({ message: 'Asset not found' });
    }
    res.status(200).json(updatedAsset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/assets/:id', async (req, res) => {
  try {
    const deletedAsset = await Assets.findByIdAndRemove(req.params.id);
    if (!deletedAsset) {
      return res.status(404).json({ message: 'Asset not found' });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
