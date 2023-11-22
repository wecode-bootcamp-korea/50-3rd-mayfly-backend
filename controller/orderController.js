const orderService = require("../services/orderService");
const error = require("../middleware/error");
const axios = require("axios");

//결제하기
const makeOrder = async (req, res) => {
  try {
    const userId = req.users.id;
    const { classId, hostId, scheduleId, quantity, price, email } = req.body;
    if (
      !userId ||
      !classId ||
      !hostId ||
      !quantity ||
      !price ||
      !email ||
      !scheduleId
    ) {
      error.error(400, "KEY_ERROR");
    }
    const result = await orderService.makeOrder(
      userId,
      classId,
      hostId,
      scheduleId,
      quantity,
      price,
      email
    );
    const orderId = result.orderId;
    //카카오톡 내게 메시지 보내기로 예약 내역 전송
    await orderService.sendKakaoToMe(userId, orderId);

    // await orderService.sendKakaoToMe(userId, orderId);
    return res.status(200).json({ message: "ORDER_COMPLETED" });
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
};

//전체 결제 내역 조회하기
const getAllOrders = async (req, res) => {
  try {
    const userId = req.users.id;
    if (!userId) {
      error.error(400, "KEY_ERROR");
    }

    const result = await orderService.getAllOrders(userId);
    return res.status(200).json({ message: "ALL_ORDERS_LOADED", result });
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
};

//특정 결제 내역 조회하기
const getOrder = async (req, res) => {
  try {
    const userId = req.users.id;
    const orderId = req.params.orderId;
    if (!orderId) {
      error.error(400, "KEY_ERROR");
    }
    const result = await orderService.getOrder(orderId, userId);
    return res.status(200).json({ message: "ORDER_LOADED", result });
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
};

//결제 취소하기
const cancelOrder = async (req, res) => {
  try {
    const userId = req.users.id;
    const orderId = req.params.orderId;
    if (!orderId) {
      error.error(400, "KEY_ERROR");
    }
    const result = await orderService.cancelOrder(orderId, userId);
    return res.status(200).json({ message: "ORDER_CANCELED", result });
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
};

//qr코드로 구매 내역 조회(호스트 전용)
const getOrderByHost = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const hostId = req.headers.hostid;
    if (!orderId) {
      error.error(400, "KEY_ERROR");
    }
    if (!hostId) {
      error.error(400, "호스트_전용_페이지입니다.");
    }
    const result = await orderService.getOrderByHost(orderId, hostId);
    return res.status(200).json({ message: "ORDER_LOADED", result });
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
};

//크레딧 충전
const chargeUserCredit = async (req, res) => {
  try {
    console.log(req);
    const { tid, pg_token } = req.body;
    const userId = req.users.id;

    const responce = await orderService.kakaoAuth(tid, pg_token);
    const data = await responce.json();
    const credit = await data.amount.total;

    if (!userId || !credit) {
      error.error(400, "KEY_ERROR");
    }
    const result = await orderService.chargeUserCredit(userId, credit);
    return res.status(200).json({ message: "CREDIT_CHARGED", result });
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
};
//카카오톡 나에게 보내기
const sendKakaoToMe = async (req, res) => {
  try {
    const userId = req.users.id;
    const orderId = req.params.orderId;

    const result = await orderService.sendKakaoToMe(userId, orderId);
    return res.status(200).json({ message: "카카오톡_내게_보내기", result });
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
};

//호스트 정산
const adjustHostCredit = async (req, res) => {
  try {
    const hostId = req.hosts.id;
    const amount = req.body.amount;
    const result = await orderService.adjustHostCredit(hostId, amount);
    return res.status(200).json({ message: "ADJUST_COMPLETED", result });
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
};

module.exports = {
  makeOrder,
  getAllOrders,
  getOrder,
  cancelOrder,
  getOrderByHost,
  chargeUserCredit,
  sendKakaoToMe,
  adjustHostCredit,
};
