const express = require('express');
const router = express.Router()
const imageController = require('../controller/imageController')
const upload = require("../middleware/upload")
const auth = require('../middleware/auth')

router.post('/',auth.hostVerifyToken, upload.single('image'), imageController.uploadImage);
router.get('/',imageController.getImages)
router.get('/:classId',imageController.getImage)
router.delete('/:id',auth.hostVerifyToken,imageController.deleteImage)


module.exports = router