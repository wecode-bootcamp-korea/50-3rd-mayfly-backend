const express = require("express");
const router = express.Router();

const categoryRouter = require("./categoryRouter")
const imageRouter = require("./imageRouter")
const chatRoomRouter = require("./chatRoomRouter")
const messageRouter = require("./messageRouter")
router.use('/categories',categoryRouter)
router.use('/images',imageRouter)
router.use('/chat',chatRoomRouter)
router.use('/message',messageRouter)

module.exports = router;