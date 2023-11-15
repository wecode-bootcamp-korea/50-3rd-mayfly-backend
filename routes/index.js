const express = require("express");
const router = express.Router();

const classesRouter = require("./classesRouter");
const schedulesRouter = require("./schedulesRouter");

router.use('/classes',classesRouter.router);
router.use('/schedules',schedulesRouter.router);

module.exports = router;

