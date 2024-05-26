const Messages = require('../models/message.model');
const mongoose = require('mongoose')
const socketController = require("./socketController");
const sharp = require('sharp')
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
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
    const unreadMessages = await Messages.aggregate([
      { $unwind: "$conversations" }, // Deconstruct the conversations array
      { $match: { "conversations.receiver": new mongoose.Types.ObjectId(userId), "conversations.seen": false } },
      { $count: "unreadCount" } // Count the number of matching documents
  ]);

  const unreadCount = unreadMessages.length > 0 ? unreadMessages[0].unreadCount : 0;
    res.json({unreadCount})
  } catch (error) {
    console.log(error)
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
    const searchQuery = req?.query?.searchQuery || ''
    const messages = await Messages.aggregate([
      {
        $match: {
          $or: [
            { productOwner: new mongoose.Types.ObjectId(user)},
            { interestedParty: new mongoose.Types.ObjectId(user)}
            ]
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'productOwner',
          foreignField: '_id',
          as: 'productOwnerData'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'interestedParty',
          foreignField: '_id',
          as:'interestedPartyData'
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
          productOwner: { $arrayElemAt: ["$productOwnerData", 0] },
          interestedParty: { $arrayElemAt: ["$interestedPartyData", 0] },
          lastConversation: 1,
          unreadCount:1,
        }
      },
      {
        $match: {
          $or: [
            { "productOwner.firstName": { $regex: searchQuery, $options: 'i' } },
            { "productOwner.lastName": { $regex: searchQuery, $options: 'i' } },
            { "interestedParty.firstName": { $regex: searchQuery, $options: 'i' } },
            { "interestedParty.lastName": { $regex: searchQuery, $options: 'i' } }
          ]
        }
      },
      {
        $sort: { "lastConversation.updatedAt": -1 } // Sort by timestamp of the last conversation in descending order
      }
    ])
    res.json(messages)
  } catch (error) {
    console.log(error)
    res.status(500).json({error:'an error occured'})
  }
}
// get all messages of a user 
module.exports.getAllMessages = async(req,res,next)=>{
  const {user} = req.params
  try {
    const allMessages = await Messages.find({
      $or:[
        {productOwner:user},
        {interestedParty:user}
      ],
    })
    if(allMessages){
      return res.status(200).json({messages:allMessages})
    }
    res.status(400).json({error:'No messages found'})
  } catch (error) {
    console.log(error)
    res.status(500).json({message:'an error occured'})
  }
}
// create messages for the first time
module.exports.createMessages = async (req,res,next)=>{
  const io = socketController.getIo();
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
          if(updatedMessage){
            io.emit('new_message', {
              messageId:updatedMessage?._id,
              sender,
              receiver,
              timestamp: updatedMessage.updatedAt ,
            });
          }
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
    if(data){
      io.emit('new_message', {
        messageId:data?._id,
        sender:buyer,
        receiver:owner,
        timestamp: data.updatedAt,
      });
    }
    const responseMsg = data ? "Message added successfully." : "Failed to add message to the database";
    res.json({ msg: responseMsg });
  } catch (error) {
    next(error)
  }
}
// add conversation to an existing chat
module.exports.addConversation = async(req,res,next)=>{
  try {
  const io = socketController.getIo();
  const {messageId,message,sender,receiver} = req.body
  let message2 = JSON.parse(message)
  if (req.file && message2.messageType === 'image') {
    const image = req.file;
      const inputPath = image.path;
      const fileToSaveName = `${image.filename}-${messageId}.webp`
      const outputPath = path.join(__dirname, '..','files', 'images/',fileToSaveName); // Change extension to .webp
      message2['message'] = `images/${fileToSaveName}`
      let image2 = sharp(inputPath).webp();  
      image2.toFile(outputPath);
  }
  if (req.file && message2.messageType === 'voice') {
    const voice = req.file;
      const inputPath = voice.path;
      const fileToSaveName = `${voice.filename}-${messageId}.wav`
      const outputPath = path.join(__dirname, '..','files','audios/',fileToSaveName); 
      message2['message'] = `audios/${fileToSaveName}`
      ffmpeg(inputPath)
      .audioBitrate(128)
      .toFormat('wav')
      .on('end', () => {
        console.log('Processing finished!');
        fs.unlinkSync(inputPath); // Remove the original file
        res.json({ message: 'File processed successfully', filePath: outputPath });
      })
      .on('error', (err) => {
        console.error('Error:', err.message);
        res.status(500).json({ error: err.message });
      })
      .save(outputPath);
  }
  const updatedMessage = await Messages.findOneAndUpdate(
    {_id:messageId},
    {$push:{conversations:{message:message2,sender,receiver,seen:false}}},
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
