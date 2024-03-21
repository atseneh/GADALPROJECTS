const express = require('express');
const app = express.Router();
const Currency = require('../models/currency.model'); 

app.post('/currencies', async (req, res) => {
  console.log(req.body)
  try {
    const newCurrency = await Currency.create(req.body);
    res.status(201).json(newCurrency);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create currency' });
  }
});


app.get('/currencies', async (req, res) => {
  try {
    let filter = {};
    Object.keys(req.query).forEach((key) => {
      filter[key] = req.query[key];
    });
    const currencies = await Currency.find(filter);
    res.status(200).json(currencies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch currencies' });
  }
});


app.get('/currencies/:currencyId', async (req, res) => {
  const { currencyId } = req.params;
  try {
    const currency = await Currency.findById(currencyId);
    if (currency) {
      res.status(200).json(currency);
    } else {
      res.status(404).json({ error: 'Currency not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch currency' });
  }
});


app.put('/currencies/:currencyId', async (req, res) => {
  const { currencyId } = req.params;
  try {
    const updatedCurrency = await Currency.findByIdAndUpdate(currencyId, req.body, { new: true });
    if (updatedCurrency) {
      res.status(200).json(updatedCurrency);
    } else {
      res.status(404).json({ error: 'Currency not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update currency' });
  }
});


app.delete('/currencies/:currencyId', async (req, res) => {
  const { currencyId } = req.params;
  try {
    const deletedCurrency = await Currency.findByIdAndRemove(currencyId);
    if (deletedCurrency) {
      res.status(200).json(deletedCurrency);
    } else {
      res.status(404).json({ error: 'Currency not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete currency' });
  }
});

module.exports = app;
