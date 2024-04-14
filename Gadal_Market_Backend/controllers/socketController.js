const socketIO = require("socket.io");
let io; 
const initSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: "http://localhost:3002",
      credentials: true,
    },
  });
  io.use((socket, next) => {
    const userId = socket.handshake.auth.userId;
    socket.userId = userId;
    next();
  });
  io.on("connection", (socket) => {
    console.log(`user connected with user id ${socket.userId}`)
    socket.emit("session", {
      userId: socket.userId,
    });
    socket.join(socket.userId)
    let users = [];
    for (let [id, socket] of io.of("/").sockets) {
      users.push(socket.userId);
    }
    io.of('/').emit("users", users);
    //  socket.on('join', (username) => {
    //  socket.username = username;
    //  console.log(`${username} joined the chat`);
    //  io.emit('message', { user: 'admin', text: `${username} has joined the chat` });
    // });
    socket.on('sendMessage', (message) => {
      console.log(`Message received: ${message} from ${socket.id}`);
      io.emit('message', { user: socket.username, text: message });
    });
    socket.on("disconnect", () => {
      console.log(`User disconnected ${socket.userId}`);
      io.of('/').emit('users',users.filter(user=>user !== socket.userId))
    // io.emit('message', { user: 'admin', text: `${socket.username} has left the chat` });
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
