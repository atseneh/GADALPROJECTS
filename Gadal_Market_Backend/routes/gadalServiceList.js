const express = require('express');
const router = express.Router();
const GadalServiceList = require('../models/gadalServiceList.model');

router.post('/gadal-service-list', async (req, res) => {
  try {
    const newService = new GadalServiceList(req.body);
    const savedservice = await newProduct.save();
    res.status(201).json(savedservice);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
router.get('/gadal-service-list', async (req, res) => {
    try {
      const serviceListItems = await GadalServiceList.find();
      res.status(200).json(serviceListItems);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

router.get('/gadal-service-list/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const serviceListItem = await GadalServiceList.findById(id);
  
      if (!serviceListItem) {
        return res.status(404).json({ error: 'Item not found' });
      }
  
      res.status(200).json(serviceListItem);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  router.delete('/gadal-service-list', async (req, res) => {
    try {
      const deleteResult = await GadalServiceList.deleteMany({});
      if (deleteResult.deletedCount === 0) {
        return res.status(404).json({ message: 'No ProductBrands found' });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
   
  module.exports = router;

  
