// middleware/socket.js
const socketio = require("socket.io");

const server = http.createServer(app)
const io = socketio(server);
io.sockets.on("connection", socket => {
  socket.on("message", data => {
      io.sockets.emit("message", data);
  });
});

