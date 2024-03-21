const express = require('express');
const router = express.Router();
const { addMessage, getMessages } = require("../controllers/messageController");
const socketController = require("../controllers/socketController");

router.post("/addmsg", addMessage);
router.post("/getmsg", getMessages);

// Example: Broadcasting a message to all connected clients
router.post("/broadcast", (req, res) => {
    const io = socketController.getIo();
    io.emit("broadcast-message", "This is a broadcast message!");
    res.json({ msg: "Broadcast message sent!" });
});

module.exports = router;
