const express = require("express");

const likeRouter = require("./likeRouter");
const orderRouter = require("./orderRouter");

const router = express.Router();

router.use("/likes", likeRouter);
router.use("/orders", orderRouter);

module.exports = { router };
