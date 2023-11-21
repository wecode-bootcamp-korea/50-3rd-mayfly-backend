const http = require('http');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const routes = require('./routes');
const socketio = require("socket.io");
const fs = require("fs")
dotenv.config()

const app = express()
const server = http.createServer(app)
const io = socketio(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors())
app.use(express.json())
app.use(routes)

// app.get('/',(req,res) => {
//     res.status(200).json({
//         message: "hello"
//     })
// })


// app.get("/", (req, res) => {
//   fs.readFile("./index.html", (error, data) => {
//       if (error) {
//           console.log(error);
//           return res.sendStatus(500);
//       }

//       res.writeHead(200, { "Content-Type": "text/html" });
//       res.end(data);
//   });
// });

const messages = [];

io.on('connection', (socket) => {
  console.log('연결 성공!');

  // 클라이언트가 메시지를 전송할 때
  socket.on('message', (msg) => {
    messages.push(msg); // 메시지를 배열에 추가

    // 방에 속한 모든 클라이언트에게 메시지 전송
    io.emit('message', msg);
  });

  // 클라이언트가 채팅방에 접속할 때
  socket.on('join room', () => {
    // 클라이언트에게 저장된 메시지 전송
    socket.emit('load messages', messages);
  });
});


const start = async () => { // 서버를 시작하는 함수입니다.
    try {
      server.listen(process.env.TYPEORM_SERVER_PORT, () => console.log(
        `Server is listening on ${process.env.TYPEORM_SERVER_PORT}`))
    } catch (err) { 
      console.error(err)
    }
  }

start()

