const express = require('express');
const router = express.Router();
const multer = require('multer');
const Assets = require('../models/asset.model'); 
const upload = multer({dest:'/images'})
const path = require('path');
const sharp = require('sharp')
const ConverttoWebp = async (inputPath, outputPath) => {
  let image = sharp(inputPath).webp();  
  return image.toFile(outputPath);
};
router.post('/assets', upload.single('image'), async (req, res) => {
  try {
      if (!req.file) {
          return res.status(400).json({ error: 'No file uploaded' });
      }
      const image = req.file;
      const inputPath = image.path;
      const outputPath = path.join(__dirname, '..', 'images', `${image.filename}-${Date.now()}.webp`);
      const filePath = `images/${image.filename}-${Date.now()}.webp`;

      await ConverttoWebp(inputPath, outputPath);

      const filePathData = req.body ? { ...req.body, filePath: [filePath] } : req.body;
      const newAsset = await Assets.create(filePathData);
      res.status(201).json(newAsset);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
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
