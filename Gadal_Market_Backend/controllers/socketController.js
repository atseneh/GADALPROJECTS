const socketIO = require("socket.io");

let io; 

const initSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: "http://localhost:3002",
      credentials: true,
    },
  });

  global.onlineUsers = new Map();

  io.on("connection", (socket) => {
    global.chatSocket = socket;

    // Notify other users that this user is online
    io.emit("user-online", socket.id);

    socket.on("add-user", (userId) => {
      onlineUsers.set(userId, socket.id);
    });

    socket.on("send-msg", (data) => {
      const sendUserSocket = onlineUsers.get(data.to);
      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("msg-receive", data.msg);
      }
    });

    socket.on("disconnect", () => {
      // Remove the user from the online users list when they disconnect
      onlineUsers.forEach((value, key) => {
        if (value === socket.id) {
          onlineUsers.delete(key);
          // Notify other users that this user is offline
          io.emit("user-offline", socket.id);
        }
      });
    });
  });
};

const getIo = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

module.exports = { initSocket, getIo };
