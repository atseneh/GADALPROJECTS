const express = require('express');
const router = express.Router();
const Estimation = require('../models/estimation.model');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); 
  },
});

const upload = multer({ storage: storage })


router.post('/estimations', upload.array('images', 10), async (req, res) => {
  const {
    title,
    description,
    category,
    consignee,
    location,
    attributes,
    subCity,
    wereda,
    transactionType,
    productType
  } = req.body
  let uploadedImages;
    let productAttributes = []
    if (req.files) {
      uploadedImages = req.files.map(file => file.filename);
    } 
    if(attributes){
      productAttributes = JSON.parse(attributes)
    }
  try {
    const newEstimationData = {
      title,
      description,
      service: parseInt(productType),
      category,
      images:uploadedImages,
      user:consignee,
      // brand and model are yet to be implemented
      // brand: req.body.brand,
      // model: req.body.model,
      attributes: productAttributes,
      location,
      subCity,
      wereda,
      transactionType:parseInt(transactionType),
    };

    const newEstimation = await Estimation.create(newEstimationData);
    const estimationData = await Estimation.findById(newEstimation._id).populate('category location wereda subCity')
    res.status(201).json(estimationData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/estimations', async (req, res) => {
  try {
    let filter = {};
    Object.keys(req.query).forEach((key) => {
      filter[key] = req.query[key];
    });

    const pageNum = parseInt(req.query.pageNum) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10; 

    const totalEstimations = await Estimation.countDocuments(filter);

    const estimations = await Estimation.find(filter)
      .populate('category location subCity wereda')
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize);

    const response = {
      pageNum: pageNum,
      pageSize: pageSize,
      totalEstimations: totalEstimations,
      estimations: estimations
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get('/estimations/:id', async (req, res) => {
  try {
    const estimation = await Estimation.findById(req.params.id).populate('category location subCity wereda');
    if (!estimation) {
      return res.status(404).json({ message: 'Estimation not found' });
    }
    res.status(200).json(estimation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/estimations/:id', async (req, res) => {
  try {
    const updatedEstimation = await Estimation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedEstimation) {
      return res.status(404).json({ message: 'Estimation not found' });
    }
    res.status(200).json(updatedEstimation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/estimations/:id', async (req, res) => {
  try {
    const deletedEstimation = await Estimation.findByIdAndRemove(req.params.id);
    if (!deletedEstimation) {
      return res.status(404).json({ message: 'Estimation not found' });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
