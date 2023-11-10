const express = require('express');
const categoryController = require("../controller/categoryController")

const router = express.Router()
router.post("/",categoryController.createTopCategory)
router.post("/sub",categoryController.createSubCategory)
router.get('/',categoryController.getTopCategories)
router.put('/:id',categoryController.updateTopCategory)
router.get('/sub',categoryController.getSubCategories)
router.put('/sub/:id',categoryController.updateSubCategory)




module.exports = router