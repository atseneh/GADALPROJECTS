const express = require('express');
const router = express.Router();
const PostTypeDefinition = require('../models/postTypeDefnition.model');


router.get('/postTypeDefinitions', async (req, res) => {
  try {
    const postTypeDefinitions = await PostTypeDefinition.find();
    res.json(postTypeDefinitions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});
router.get('/postTypeDefinitions/:id', async (req, res) => {
  const {id} = req.params
  try {
    const postType = await PostTypeDefinition.findById(id);
    res.json(postType);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/postTypeDefinitions', async (req, res) => {
    try {
      const postTypeDefinitions = req.body;

      if (!Array.isArray(postTypeDefinitions)) {
        return res.status(400).json({ message: 'Request body must be an array' });
      }
  
      const createdPostTypeDefinitions = [];

      for (const definition of postTypeDefinitions) {
        const newPostTypeDefinition = new PostTypeDefinition(definition);
        await newPostTypeDefinition.save();
        createdPostTypeDefinitions.push(newPostTypeDefinition);
      }
  
      res.status(201).json(createdPostTypeDefinitions);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });
  
router.put('/postTypeDefinitions/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedPostTypeDefinition = await PostTypeDefinition.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedPostTypeDefinition) {
      return res.status(404).json({ message: 'Post type definition not found' });
    }
    res.json(updatedPostTypeDefinition);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.delete('/postTypeDefinitions/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPostTypeDefinition = await PostTypeDefinition.findByIdAndDelete(id);
    if (!deletedPostTypeDefinition) {
      return res.status(404).json({ message: 'Post type definition not found' });
    }
    res.json({ message: 'Post type definition deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
