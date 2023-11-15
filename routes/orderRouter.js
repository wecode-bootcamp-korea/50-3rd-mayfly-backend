const express = require("express");
const router = express.Router();
const orderController = require("../controller/orderController");
const auth = require("../middleware/auth");

router.post("/", auth.userVerifyToken, orderController.makeOrder);
router.get("/", orderController.getAllOrders);
router.get("/sendme", orderController.sendKakaoToMe);
router.get("/:orderId", orderController.getOrder);
router.put("/:orderId", orderController.cancelOrder);
router.get(
  "/qr_code/:orderId",
  auth.hostVerifyToken,
  orderController.getOrderByHost
);

router.post("/pay", auth.userVerifyToken, orderController.chargeUserCredit);

module.exports = router;
