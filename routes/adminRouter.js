const express = require("express");
const router = express.Router();
const adminController = require("../controller/adminController");
const adminVerifyToken = require("../middleware/auth");

//회원가입
router.post("/signup", adminController.adminSignup);
//로그인
router.post("/login", adminController.adminLogin);
//하루 모든하루리스트 가져다 주기
router.get("/userlist", adminVerifyToken.adminVerifyToken, adminController.getUsersList);
//하루 해당 유저 삭제시키기(soft)
router.put("/users/:userId", adminVerifyToken.adminVerifyToken, adminController.deleteUserByUserId);
//하루 해당 유저 삭제 복원시키기
router.put("/users/update/:userId", adminVerifyToken.adminVerifyToken, adminController.restoreUserByUserId);
//등대 모든 등대리스트 가져다 주기
router.get("/hostlist", adminVerifyToken.adminVerifyToken, adminController.getHostsList);
//등대 해당 유저 삭제시키기(soft)
router.put("/hosts/:hostId", adminVerifyToken.adminVerifyToken, adminController.deleteHostByHostId);
//등대 해당 유저 복원시키기
router.put("/hosts/update/:hostId", adminVerifyToken.adminVerifyToken, adminController.restoreHostByHostId);

module.exports = {
    router
}

