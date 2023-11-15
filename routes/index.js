const express = require("express");
const router = express.Router();

const likeRouter = require("./likeRouter");
const orderRouter = require("./orderRouter");

router.use("/likes", likeRouter);
router.use("/orders", orderRouter);

module.exports = router;
