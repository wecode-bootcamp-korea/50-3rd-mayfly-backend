const express = require('express');
const router = express.Router()
const chatRoomController = require('../controller/chatRoomController')

router.post('/',chatRoomController.createChatRoom)

module.exports = router