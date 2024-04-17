const express = require('express');
const router = express.Router();
const Review = require('../models/review.model');

router.post('/reviews', async (req, res) => {
  const {description,stars,product,user} = req.body
  const data = {
    user,
    product,
    status:1,
    description,
    stars,
    recordStatus:1,
    remark:'',
  }
  try {
    const newReview = await Review.create(data);
    res.status(201).json(newReview);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/reviews', async (req, res) => {
  try {
    let filter = {};
    Object.keys(req.query).forEach((key) => {
      filter[key] = req.query[key];
    });
    const reviews = await Review.find(filter).populate('user');
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/reviews/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get('/reviews/:productId', async (req, res) => {
  const {productId} = req.params
  try {
    const review = await Review.findOne({product:productId});
    // if (!review) {
    //   return res.status(404).json({ message: 'Review not found' });
    // }
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.put('/reviews/:id', async (req, res) => {
  try {
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedReview) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.status(200).json(updatedReview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/reviews/:id', async (req, res) => {
  try {
    const deletedReview = await Review.findByIdAndRemove(req.params.id);
    if (!deletedReview) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
