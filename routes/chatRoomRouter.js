const express = require('express');
const router = express.Router()
const chatRoomController = require('../controller/chatRoomController')
const auth = require('../middleware/auth')

router.post('/',auth.userVerifyToken,chatRoomController.createChatRoom)
router.get('/:id',auth.hostVerifyToken,chatRoomController.getChatRoom)


module.exports = router