const express = require('express');
const router = express.Router();
const User = require("../models/user.model");
const Product = require("../models/product.model")
router.post('/users', async (req, res) => {
    try {
      const newUser = new User(req.body);
      const savedUser = await newUser.save();
      res.status(201).json(savedUser);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
router.put('/users/addToFav/:userId/:productId',async (req,res)=>{
  try {
  const {userId,productId} = req.params
  const updatedUser = await User.findByIdAndUpdate(userId,{$push:{favourites:productId}},{new:true})
  const updatedProduct = await Product.findByIdAndUpdate(productId,{$push:{likedBy:userId}},{new:true})
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
router.get('/users', async (req, res) => {
  try {
    let filter = {};
    Object.keys(req.query).forEach((key) => {
      filter[key] = req.query[key];
    });

    // Pagination
    const page = parseInt(req.query.pageNum) || 1;
    const pageSize = parseInt(req.query.pageSize) || 4;  
    const skip = (page - 1) * pageSize;

    const users = await User.find(filter)
      .skip(skip)
      .limit(pageSize);

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/users/favorites/:userId',async (req,res)=>{
  try {
    const {userId} = req.params
    const favorites = await User.findById(userId,{recordStatus:1}).select('favourites').populate('favourites')
    res.json(favorites)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal server error' });
  }
})
  router.get('/users/:id', async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  router.put('/users/:id', async (req, res) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
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