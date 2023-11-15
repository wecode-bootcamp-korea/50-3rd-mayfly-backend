const express = require('express');
const router = express.Router();
const classesController = require('../controller/classesController');
const auth = require('../middleware/auth');

router.get('/classeslist',classesController.getClassesList);//메인,강의리스트 페이지 사진(title)
router.get('/classeslist/upcomingclasses',classesController.getUpcomingClasses);//메인 마감임박 사진(title)

router.get('/myclass',auth.userVerifyToken,classesController.getMyClassesList); //유저 토큰 유저 수업 가져오기 
router.get('/hostclass',auth.hostVerifyToken,classesController.getHostClassesList);//등대 토큰 등대 수업 가져오기

router.get('/:classId',classesController.getClasseDetail); //상세페이지 가져오기 사진(title,content1,content2)

router.post('/createclass',auth.hostVerifyToken,classesController.createClass); //등대token 수업 등록
router.put('/delete/:classId',auth.hostVerifyToken,classesController.deleteClass) //등대token 수업 삭제(deleted_at에 삭제된 현재시간 표시로 가자)
router.put('/update/:classId',auth.hostVerifyToken,classesController.updateClass); //등대token 수업 수정

module.exports.router = router