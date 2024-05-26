const express = require('express');
const router = express.Router();
const multer = require('multer')
const upload = multer({dest:'/images'})
const {getMessages,createMessages,addConversation,getConversations,getUnreadMessagesCount,deleteAll,updateSeen,getAllMessages } = require("../controllers/messageController");
router.get('/getMessages/:user',getMessages)
router.get('/getConversations/:id',getConversations)
router.get('/getUnreadMessages/:userId',getUnreadMessagesCount)
router.post('/createMessage',createMessages)
router.put('/addConversations',upload.single('file'),addConversation)
router.put('/updateSeen/:messageId/:receiver',updateSeen)
router.delete('/deleteAllMessages',deleteAll)
router.get('/allMessages/:user',getAllMessages)
// Example: Broadcasting a message to all connected clients
// router.post("/broadcast", (req, res) => {
//     const io = socketController.getIo();
//     io.emit("broadcast-message", "This is a broadcast message!");
//     res.json({ msg: "Broadcast message sent!" });
// });

module.exports = router;
