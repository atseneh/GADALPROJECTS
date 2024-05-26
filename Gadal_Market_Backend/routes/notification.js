const express = require('express')
const router = express.Router();
const Notification = require('../models/notification.model')
router.get('/notifications', async (req, res) => {
  const filters = req.query ? req.query : {}
    try {
      const notifications = await Notification.find(filters);
      res.status(200).json(notifications);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  router.get('/notifications/:userId', async (req, res) => {
    const {userId} = req.params
    try {
      const notifications = await Notification.find({
        $or:[
            {
             user:userId
            },
            {
                isCampaign:true
            }
        ],
        expired:false,
        // seen:false
      })
      .sort({
        createdAt:-1
      });
      res.status(200).json(notifications);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  router.put('/notifications/updateSeen/:userId',async(req,res)=>{
  const {userId} = req.params
  try {
    await Notification.updateMany(
        {
        user:userId,
        isCampaign:false,
    },
    {
        seen:true
    }
)
res.status(200).json({message:'Successfuly updated'})
  } 
  catch (error) {
    res.status(400).json({message:'Something went wrong'})
  }
  })
  router.get('/notifications/unreadCount/:userId',async (req,res)=>{
    const {userId} = req.params
    try {
      const count = await Notification.countDocuments({
        $or:[
          {
            user:userId,
          },
          {
            isCampaign:true
          }
        ],
        seen:false,
        expired:false,
      })
      res.status(200).json({unreadCount:count})
    } catch (error) {
      res.status(200).json({message:'Something went wrong'})
    }

  })
  router.post('/notification/createCampaign',async (req,res)=>{
    const {campaignMessage} = req.body
    try {
      const campaign = await Notification.create({
        notification:campaignMessage,
        isCampaign:true
      })
      if(!campaign){
        return res.status(400).json({message:'Unable to create campaign'})
      }
      res.status(200).json({message:'Campaign successfuly created'})
    } catch (error) {
      res.status(200).json({message:'Something went wrong'})
    }
  })
  module.exports =  router