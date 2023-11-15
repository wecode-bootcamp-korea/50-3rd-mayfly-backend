const express = require("express");
const router = express.Router();
const adminController = require("../controller/adminController");
const adminVerifyToken = require("../middleware/auth");

//회원가입
router.post("/signup", adminController.adminSignup);
//로그인
router.post("/login", adminController.adminLogin);
//유저 정보 조회
router.get("/users", adminVerifyToken.adminVerifyToken, adminController.adminGetUser);
//호스트 정보 조회
router.get("/hosts", adminVerifyToken.adminVerifyToken, adminController.adminGetHost);
//유저 정보 삭제
router.put("/users", adminVerifyToken.adminVerifyToken, adminController.adminDeleteUser);
//호스트 정보 삭제
router.put("/hosts", adminVerifyToken.adminVerifyToken, adminController.adminDeleteHost);

module.exports = {
    router
}

