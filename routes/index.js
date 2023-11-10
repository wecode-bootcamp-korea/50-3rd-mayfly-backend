const express = require("express");
const router = express.Router();

const categoryRouter = require("./categoryRouter")
const imageRouter = require("./imageRouter")
router.use('/categories',categoryRouter)
router.use('/images',imageRouter)

module.exports = router;