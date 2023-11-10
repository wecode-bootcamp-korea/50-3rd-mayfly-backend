const express = require('express');
const router = express.Router()
const imageController = require('../controller/imageController')
const upload = require("../middleware/upload")

router.post('/', upload.single('image'), imageController.uploadImage);
router.get('/',imageController.getImages)
router.get('/:classId',imageController.getImage)
router.delete('/:id',imageController.deleteImage)


module.exports = router