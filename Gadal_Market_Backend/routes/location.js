const express = require('express');
const app = express.Router();
const Location = require('../models/location.model');

// app.post('/locations', async (req, res) => {
//   try {
//     const location = new Location(req.body);
//     await location.save();
//     res.status(201).json(location);
//   } catch (error) {
//     res.status(400).json({ error: 'Invalid data' });
//   }
// });
 app.post('/locations', async (req, res) => {
  try {
      const locationsData = req.body;
      const savedLocations = await Location.insertMany(locationsData);

      res.status(201).json(savedLocations);
  } catch (error) {
      res.status(400).json({ error: 'Invalid data' });
  }
});
app.get('/locations', async (req, res) => {
  const filters = req.query
  try {
    const locations = await Location.find(filters);
    res.json(locations);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/locations/:id', async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) {
      return res.status(404).json({ error: 'Location not found' });
    }
    res.json(location);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/locations/:id', async (req, res) => {
  try {
    const location = await Location.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!location) {
      return res.status(404).json({ error: 'Location not found' });
    }
    res.json(location);
  } catch (error) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

app.delete('/locations/:id', async (req, res) => {
  try {
    const location = await Location.findByIdAndRemove(req.params.id);
    if (!location) {
      return res.status(404).json({ error: 'Location not found' });
    }
    res.json({ message: 'Location deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = app;
