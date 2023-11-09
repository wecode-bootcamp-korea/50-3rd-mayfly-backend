const express = require("express");
const router = express.Router();

const categoryRouter = require("./categoryRouter")
router.use('/categories',categoryRouter)

module.exports = router;