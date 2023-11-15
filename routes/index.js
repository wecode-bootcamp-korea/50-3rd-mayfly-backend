const express = require("express");
const router = express.Router();

const adminRouter = require("./adminRouter");
const userRouter = require("./userRouter");
const hostRouter = require("./hostRouter");

router.use("/admins", adminRouter.router);
router.use("/users", userRouter.router);
router.use("/hosts", hostRouter.router);

module.exports = router;

