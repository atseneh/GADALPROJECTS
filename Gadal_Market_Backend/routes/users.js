const express = require('express');
const router = express.Router();
const User = require("../models/user.model");
const Product = require("../models/product.model");
const verifyToken = require('../verifyToken');
const multer = require('multer');
const sharp = require('sharp')
const path = require('path');
const ConverttoWebp = async (inputPath, outputPath) => {
  let image = sharp(inputPath).webp();  // Convert all images to WEBP format
  return image.toFile(outputPath);
};

const upload = multer({dest:'/images'})
router.post('/users', async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/users/addToFav/:productId',verifyToken,async (req,res)=>{
  try {
  const {productId} = req.params;
  const {_id} = req.user;
  const updatedUser = await User.findByIdAndUpdate(_id,{$push:{favourites:productId}},{new:true})
  const updatedProduct = await Product.findByIdAndUpdate(productId,{$push:{likedBy:_id}},{new:true})
  if(updatedUser && updatedProduct){
    res.status(200).send('Successefully Added to Fav')
  }
  else {
    res.status(400).send('Something went Wrong')
  }
  } catch (error) {
    res.status(400).json({ error: error.message });
  
  }
})
router.put('/users/removeFromFav/:productId',verifyToken,async (req,res)=>{
  try {
  const {productId} = req.params;
  const {_id} = req.user;
  const updatedUser = await User.findByIdAndUpdate(_id,{$pull:{favourites:productId}},{new:true})
  const updatedProduct = await Product.findByIdAndUpdate(productId,{$pull:{likedBy:_id}},{new:true})
  if(updatedUser && updatedProduct){
    res.status(200).send('Successefully removed from Fav')
  }
  else {
    res.status(400).send('Something went Wrong')
  }
  } catch (error) {
    res.status(400).json({ error: error.message });
  
  }
})
router.get('/users', async (req, res) => {
  try {
    let filter = {};
    Object.keys(req.query).forEach((key) => {
      filter[key] = req.query[key];
    });

    // Pagination
    const page = parseInt(req.query.pageNum) || 1;
    const pageSize = parseInt(req.query.pageSize) || 100;  
    const skip = (page - 1) * pageSize;

    const users = await User.find(filter)
      .skip(skip)
      .limit(pageSize);

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/users/favorites',verifyToken,async (req,res)=>{
  try {
    const {_id} = req.user
    const favorites = await User.findById(_id,{recordStatus:1}).select('favourites').populate('favourites')
    res.json(favorites)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal server error' });
  }
})
  router.get('/userProfileDetail',verifyToken, async (req, res) => {
    const {_id} = req.user
    const productsPosted = await Product.find({
      consignee:_id
    })
    try {
      let user = await User.findById(_id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      user.noOfAds = 33
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  router.put('/users',verifyToken, upload.single('image') ,async (req, res) => {
    const {_id} = req.user
    let profilePic = ''
    try {
    
      if (req.file) {
        const image = req.file;
        // const processPromises = images.map((file, index) => {
          const inputPath = image.path;
          const outputPath = path.join(__dirname, '..', 'images/', `${image.filename}-${Date.now()}.webp`); // Change extension to .webp
          profilePic = `images/${image.filename}-${Date.now()}.webp`
          ConverttoWebp(inputPath, outputPath);
          
        // });
      }
      const updatedUser = await User.findByIdAndUpdate(_id, {...req.body,proflePic:profilePic}, {
        new: true,
      });
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  router.delete('/users/:id', async (req, res) => {
    try {
      const deletedUser = await User.findByIdAndDelete(req.params.id);
      if (!deletedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(deletedUser);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });
//   router.get('/users/byFollower/:followerId', async (req, res) => {
//     try {
//         const { followerId } = req.params;
//         console.log(followingId)
//         const users = await User.find({ followers: followerId }).exec();

//         res.json(users);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });
// router.get('/users/byFollowing/:followingId', async (req, res) => {
//   try {
//       const { followingId } = req.params;
//       console.log(followingId)
//       // Find users whom the given followingId is in their following list
//       const users = await User.find({ following: followingId }).exec();

//       res.json(users);
//   } catch (error) {
//       res.status(500).json({ error: error.message });
//   }
// });

module.exports = router;