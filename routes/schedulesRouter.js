const express = require('express');
const router = express.Router();
const schedulesController = require('../controller/schedulesController');
const auth = require('../middleware/auth');

//auth.hostVerifyToken 다 집어 넣어야함
router.get('/:classid',auth.hostVerifyToken,schedulesController.getSchedulesByclassId)
router.post('/:classid',auth.hostVerifyToken,schedulesController.createSchedule);
router.put('/:scheduleid',auth.hostVerifyToken,schedulesController.updateSchedule);
router.delete('/:scheduleid',auth.hostVerifyToken,schedulesController.deleteSchedule);

module.exports.router = router