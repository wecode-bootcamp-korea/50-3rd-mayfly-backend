const express = require("express");
const router = express.Router();

const likeRouter = require("./likeRouter");
const orderRouter = require("./orderRouter");
const adminRouter = require("./adminRouter");
const userRouter = require("./userRouter");
const hostRouter = require("./hostRouter");
const classesRouter = require("./classesRouter");
const schedulesRouter = require("./schedulesRouter");

router.use("/likes", likeRouter);
router.use("/orders", orderRouter);

router.use("/admins", adminRouter.router);
router.use("/users", userRouter.router);
router.use("/hosts", hostRouter.router);

router.use("/classes", classesRouter.router);
router.use("/schedules", schedulesRouter.router);

module.exports = router;
