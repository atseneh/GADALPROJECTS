const Messages = require('../models/message.model');
module.exports.getMessages = async (req,res,next)=>{
  try {
    // message/:user
    const {user} = req.params
    const messages = await Messages.find({
      $or:[
        {productOwner:user},
        {interestedParty:user}
      ]
    }).sort({ updatedAt: -1 }).populate('interestedParty product productOwner');     
    res.json(messages)
  } catch (error) {
    res.status(500).json({error:'an error occured'})
    // next(error)
  }
}
// create messages for the first time
module.exports.createMessages = async (req,res,next)=>{
  try {
    const {product,owner,buyer,message} = req.body
    const data = await Messages.create({
     product,
     productOwner:owner,
     interestedParty:buyer,
     conversations:[
      // the first converstation
      {
        message,
        isFromInterestedParty:true,
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
  const {messageId,message,isFromBuyer} = req.body
  const updatedMessage = await Messages.findOneAndUpdate(
    {_id:messageId},
    {$push:{conversations:{message,isFromInterestedParty:isFromBuyer,seen:false}}},
    {new:true},
    )
    res.status(200).json(updatedMessage)
  } catch (error) {
    next(error)
  }
}
module.exports.getMessages2 = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    const messages = await Messages.find({
      users: [from, to],
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map(msg => ({
      fromSelf: msg.sender.toString() === from,
      message: msg.message.text,
    }));

    res.json(projectedMessages);
  } catch (error) {
    next(error);
  }
};

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;

    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    const responseMsg = data ? "Message added successfully." : "Failed to add message to the database";
    res.json({ msg: responseMsg });
  } catch (error) {
    next(error);
  }
};
