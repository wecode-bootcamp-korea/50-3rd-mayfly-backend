const express = require("express");
const router = express.Router();
const hostController = require("../controller/hostController");
const hostVerifyToken = require("../middleware/auth");


//호스트 카카오 회원가입 로그인
router.post("/signup",  hostController.hostSignup);
//호스트 정보 조회
router.get("/", hostVerifyToken.hostVerifyToken, hostController.getHost);
//호스트 정보 수정
router.put("/update", hostVerifyToken.hostVerifyToken, hostController.updateHost);
//호스트 정보 삭제
router.put("/delete", hostVerifyToken.hostVerifyToken, hostController.deleteHost);
//호스트 크레딧 조회
router.get("/credit", hostVerifyToken.hostVerifyToken, hostController.getHostCredit);

module.exports = {
    router
};