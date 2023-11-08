const http = require('http');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const routes = require('./routes');

const app = express()
app.use(cors())
app.use(express.json())
app.use(routes)

app.get('/',(req,res) => {
    res.status(200).json({
        message: "hello"
    })
})

const server = http.createServer(app)

const start = async () => { // 서버를 시작하는 함수입니다.
    try {
      server.listen(process.env.TYPEORM_SERVER_PORT, () => console.log(
        `Server is listening on ${process.env.TYPEORM_SERVER_PORT}`))
    } catch (err) { 
      console.error(err)
    }
  }

start()

