const express = require('express');
const categoryController = require("../controller/categoryController")
const auth = require('../middleware/auth');

const router = express.Router()
router.post("/",auth.adminVerifyToken,categoryController.createTopCategory)
router.get('/',categoryController.getTopCategories)
router.put('/:id',auth.adminVerifyToken,categoryController.updateTopCategory)
router.delete('/:id',auth.adminVerifyToken,categoryController.deleteTopCategory)
router.post("/sub",auth.adminVerifyToken,categoryController.createSubCategory)
router.get('/sub',categoryController.getSubCategories)
router.put('/sub/:id',auth.adminVerifyToken,categoryController.updateSubCategory)
router.delete('/sub/:id',auth.adminVerifyToken,categoryController.deleteSubCategory)


module.exports = router