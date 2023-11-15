const express = require('express');
const router = express.Router();
const schedulesController = require('../controller/schedulesController');
const auth = require('../middleware/auth');

//auth.userVerifyToken 다 집어 넣어야함

router.post('/:classid',schedulesController.createSchedule);
router.put('/update/:scheduleid',schedulesController.updateSchedule);
router.put('/delete/:scheduleid',schedulesController.deleteSchedule);






module.exports.router = router