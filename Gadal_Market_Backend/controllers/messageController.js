const Messages = require('../models/message.model');

module.exports.getMessages = async (req, res, next) => {
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
