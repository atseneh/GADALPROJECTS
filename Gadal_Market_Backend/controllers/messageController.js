const Messages = require('../models/message.model');
const mongoose = require('mongoose')
const io = require("../app");
module.exports.getConversations = async (req,res,next)=> {
  try {
    const {id} = req.params
    const messageDetail = await Messages.findById(id).populate('product').sort({updatedAt:-1})
    res.json(messageDetail)
  } catch (error) {
    res.status(500).json({error:'an error occured'})
  }
}
module.exports.deleteAll = async (req,res,next)=> {
  try {
    await Messages.deleteMany({})
    return true
  } catch (error) {
    res.status(500).json({error:'an error occured'})
  }
}
module.exports.getUnreadMessagesCount = async (req,res,next)=> {
  try {
    const {userId} = req.params
      const unreadCount1 = await Messages.find({
      $or:[
        {productOwner:userId},
        {interestedParty:userId}
      ],
      'conversations.seen':false,
      'conversations.receiver':userId
    })
    let unreadCount = 0;
    unreadCount1.forEach((message) => {
      message.conversations.forEach((conversation) => {
        if (!conversation.seen) {
          unreadCount++;
        }
      });
    });
    res.json({unreadCount})
  } catch (error) {
    res.status(500).json({error:'an error occured'})
  }
}
module.exports.updateSeen = async (req,res,next)=>{
  try {
  const {messageId,receiver} = req.params
  console.log(receiver)
  const result = await Messages.findOneAndUpdate(
    {_id:messageId},
    {$set:{ "conversations.$[elem].seen":true}},
    { 
      arrayFilters: [{ "elem.receiver": receiver }], // Apply this update only to elements that match the condition
      multi: true 
    }
  )
  if (result.modifiedCount === 0) {
    return res.status(404).send('Message not found or no update needed.');
  }
  res.send('All conversations updated to seen.');
  } catch (error) {
    console.log(error)
   res.status(500).json({error:'error occured'}) 
  }
}
module.exports.getMessages = async (req,res,next)=>{
  try {
    const {user} = req.params
    const messages = await Messages.aggregate([
      {
        $match: {
          $or: [{ productOwner: new mongoose.Types.ObjectId(user)}, { interestedParty: new mongoose.Types.ObjectId(user) }]
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'productOwner',
          foreignField: '_id',
          as: 'productOwner'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'interestedParty',
          foreignField: '_id',
          as: 'interestedParty'
        }
      },
      {
        $set: {
          lastConversation: { $arrayElemAt: ["$conversations", -1] },
          unreadCount:{
            $size:{
              $filter:{
                input: "$conversations",
                as: "conv",
                cond: {
                  $and:[
                    { $eq: ["$$conv.seen", false] },
                    {$ne: ["$$conv.sender",new mongoose.Types.ObjectId(user)] }
                  ]
                }
              }
            }
          }
        }
      },
      {
        $project: {
          // conversations: 0, // Exclude the original conversation array
          productOwner: { $arrayElemAt: ["$productOwner", 0] },
          interestedParty: { $arrayElemAt: ["$interestedParty", 0] },
          lastConversation: 1,
          unreadCount:1,
        }
      },
      {
        $sort: { "lastConversation.updatedAt": -1 } // Sort by timestamp of the last conversation in descending order
      }
    ])
    res.json(messages)
  } catch (error) {
    res.status(500).json({error:'an error occured'})
  }
}
// create messages for the first time
module.exports.createMessages = async (req,res,next)=>{
  try {
    const {product,owner,buyer,message} = req.body
     // check if there is already a chat for that prodcut between buyer and seller
     const messageData = await Messages.findOne({
      product,
      productOwner:owner,
      interestedParty:buyer,
     })
     if(messageData){
      try {
        const updatedMessage = await Messages.findOneAndUpdate(
          {_id:messageData?._id},
          {$push:{conversations:{message,sender:buyer,receiver:owner,seen:false}}},
          {new:true},
          )
          return res.status(200).json(updatedMessage)
      } catch (error) {
        next(error)
      }
     }
    const data = await Messages.create({
     product,
     productOwner:owner,
     interestedParty:buyer,
     conversations:[
      // the first converstation
      {
        message,
        sender:buyer,
        receiver:owner,
        seen:false
      }
     ]
    })
    const responseMsg = data ? "Message added successfully." : "Failed to add message to the database";
    res.json({ msg: responseMsg });
  } catch (error) {
    next(error)
  }
}
// add conversation to an existing chat
module.exports.addConversation = async(req,res,next)=>{
  try {
  const {messageId,message,sender,receiver} = req.body
  const updatedMessage = await Messages.findOneAndUpdate(
    {_id:messageId},
    {$push:{conversations:{message,sender,receiver,seen:false}}},
    {new:true},
    )
    io.emit('new_message', {
      messageId,
      sender,
      receiver,
      timestamp: updatedMessage.updatedAt ,
    });
    res.status(200).json(updatedMessage)
  } catch (error) {
    next(error)
  }
}
