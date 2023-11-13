const express = require('express');
const router = express.Router()
const auth = require('../middleware/auth');
const messageController = require('../controller/messageController')

router.use(auth.userVerifyToken)
router.use(auth.hostVerifyToken)
router.post('/',messageController.createMessage)
// router.get('/:id',auth.userVerifyToken,messageController.getAllMessages)
// router.get('/:id',auth.hostVerifyToken,messageController.getAllMessages)
router.get('/:id',messageController.getAllMessages)

module.exports = router