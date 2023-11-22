const express = require("express");
const router = express.Router();

router.use('/categories',categoryRouter)
router.use('/images',imageRouter)
router.use('/chat',chatRoomRouter)
router.use('/message',messageRouter)

const likeRouter = require("./likeRouter");
const orderRouter = require("./orderRouter");
const adminRouter = require("./adminRouter");
const userRouter = require("./userRouter");
const hostRouter = require("./hostRouter");
const classesRouter = require("./classesRouter");
const schedulesRouter = require("./schedulesRouter");
const categoryRouter = require("./categoryRouter")
const imageRouter = require("./imageRouter")
const chatRoomRouter = require("./chatRoomRouter")
const messageRouter = require("./messageRouter")


router.use("/likes", likeRouter);
router.use("/orders", orderRouter);

router.use("/admins", adminRouter.router);
router.use("/users", userRouter.router);
router.use("/hosts", hostRouter.router);

router.use("/classes", classesRouter.router);
router.use("/schedules", schedulesRouter.router);

router.use('/categories',categoryRouter)
router.use('/images',imageRouter)
router.use('/chat',chatRoomRouter)
router.use('/message',messageRouter)


module.exports = router;
