const express = require("express");
const router = express.Router();
const orderController = require("../controller/orderController");
const auth = require("../middleware/auth");
//결제 생성
router.post("/", auth.userVerifyToken, orderController.makeOrder);
//유저의 전체 결제 내역 조회
router.get("/", auth.userVerifyToken, orderController.getAllOrders);
//유저의 특정 결제 내역 조회
router.get("/detail/:orderId", auth.userVerifyToken, orderController.getOrder);
//유저의 특정 결제 내역 삭제
router.put(
  "/detail/:orderId",
  auth.userVerifyToken,
  orderController.cancelOrder
);
//유저의 특정 결제 내역 본인에게 qr 보내기
router.get(
  "/sendme/:orderId",
  auth.userVerifyToken,
  orderController.sendKakaoToMe
);
//결제 내역 qr체크인(호스트가 확인)
router.get(
  "/qr_code/:orderId",
  auth.hostVerifyToken,
  orderController.getOrderByHost
);
//호스트 정산
router.post("/adjust", auth.hostVerifyToken, orderController.adjustHostCredit);
//유저 크레딧 충전
router.post("/pay", auth.userVerifyToken, orderController.chargeUserCredit);

module.exports = router;
