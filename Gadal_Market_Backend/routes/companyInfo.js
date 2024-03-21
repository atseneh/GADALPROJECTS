const express = require('express');
const router = express.Router();
const CompanyInfo = require('../models/companyInfo.model');

router.post('/companies', async (req, res) => {
  try {
    const companyData = req.body;
    const company = new CompanyInfo(companyData);
    await company.save();
    res.status(201).json(company);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/companies', async (req, res) => {
  try {
    const companies = await CompanyInfo.find();
    res.status(200).json(companies);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/companies/:id', async (req, res) => {
  try {
    const company = await CompanyInfo.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    res.status(200).json(company);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/companies/:id', async (req, res) => {
  try {
    const companyData = req.body;
    const company = await CompanyInfo.findByIdAndUpdate(req.params.id, companyData, {
      new: true,
    });
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    res.status(200).json(company);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/companies/:id', async (req, res) => {
  try {
    const company = await CompanyInfo.findByIdAndRemove(req.params.id);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
