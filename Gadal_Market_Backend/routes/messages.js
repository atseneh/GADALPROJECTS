const express = require('express');
const router = express.Router();
const {getMessages,createMessages,addConversation,getConversations,getUnreadMessagesCount,deleteAll } = require("../controllers/messageController");
router.get('/getMessages/:user',getMessages)
router.get('/getConversations/:id',getConversations)
router.get('/getUnreadMessages/:userId',getUnreadMessagesCount)
router.post('/createMessage',createMessages)
router.put('/addConversations',addConversation)
router.delete('/deleteAllMessages',deleteAll)
// Example: Broadcasting a message to all connected clients
router.post("/broadcast", (req, res) => {
    const io = socketController.getIo();
    io.emit("broadcast-message", "This is a broadcast message!");
    res.json({ msg: "Broadcast message sent!" });
});

module.exports = router;
