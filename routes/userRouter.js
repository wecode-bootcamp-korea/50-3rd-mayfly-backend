const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const userVerifyToken = require("../middleware/auth")


//유저 카카오 회원가입 로그인
router.post("/signup",  userController.userSignup);
//유저 정보 조회
router.get("/", userVerifyToken.userVerifyToken, userController.getUserByInfo);
//유저 정보 수정
router.put("/update", userVerifyToken.userVerifyToken, userController.updateUser);
//유저 정보 삭제
router.put("/delete", userVerifyToken.userVerifyToken, userController.deleteUserByInfo);
//유저 크레딧 조회 수정 필요
router.get("/credit", userVerifyToken.userVerifyToken, userController.getUserByCredit);

module.exports = {
    router
};