// server.js
require("dotenv").config();
const http = require('http');
const express = require('express');
const createApp = require("./app");
const { appDataSource } = require("./models/datasource");
const socketio = require("socket.io");

const start = async () => {
    try {
        const app = createApp();
        const server = http.createServer(app);
        const io = socketio(server, {
            cors: {
                origin: "*",
            },
        });

        app.get('/hi', (req, res) => {
            res.status(200).json({ message: "hello" });
        });

        appDataSource.initialize()
            .then(() => {
                console.log("Data Source has been initialized!");
            })
            .catch((err) => {
                console.error("Error occurred during Data Source initialization", err);
            });

        const messages = [];

        io.on('connection', (socket) => {
            console.log('소켓 연결 성공!');

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

        server.listen(process.env.TYPEORM_SERVER_PORT, () =>
            console.log(`Server is listening on ${process.env.TYPEORM_SERVER_PORT}`)
        );
    } catch (err) {
        console.error(err);
    }
};

start();
