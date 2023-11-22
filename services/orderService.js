const orderDao = require("../models/orderDao");
const error = require("../middleware/error");
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();
const { appDataSource } = require("../models/datasource");

//결제하기
const makeOrder = async (
  userId,
  classId,
  hostId,
  scheduleId,
  quantity,
  price,
  email
) => {
  try {
    const result = await appDataSource.transaction(async (transaction) => {
      //예외)예약 인원이 수업 잔여 인원을 넘을 때
      const checkRemainMember = await orderDao.checkRemainMember(
        scheduleId,
        transaction
      );
      if (checkRemainMember < quantity) {
        throw new Error("NO_SEATS_LEFT");
      }
      //예외)크레딧이 부족할 때
      const checkCredit = await orderDao.getUserCredit(userId, transaction);
      if (price > checkCredit) {
        throw new Error("NOT_ENOUGH_CREDITS");
      }
      //결제 내역 생성
      const orderId = await orderDao.createOrder(
        userId,
        classId,
        scheduleId,
        quantity,
        email,
        transaction
      );
      //해당 schedule에 수강 인원 추가
      await orderDao.addEnrolledMember(scheduleId, quantity, transaction);
      //유저 포인트 차감
      await orderDao.subtractUserCredit(userId, price, transaction);
      //호스트 포인트 증가
      await orderDao.addHostCredit(hostId, price, transaction);
      return orderId;
    });
    return result;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};
//전체 결제 내역 조회
const getAllOrders = async (userId) => {
  return await orderDao.getAllOrders(userId);
};
//특정 결제 내역 조회
const getOrder = async (orderId, userId) => {
  try {
    const checkOrder = await orderDao.checkOrder(orderId, userId);
    if (checkOrder.length == 0) {
      error.error(401, "UNAUTHORIZED_USER");
    }
    return await orderDao.getOrder(orderId);
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};
//결제 취소
const cancelOrder = async (orderId, userId) => {
  try {
    const checkOrder = await orderDao.checkOrder(orderId, userId);
    if (checkOrder.length == 0) {
      error.error(401, "UNAUTHORIZED_USER");
    }
    //결제 내역 삭제
    await orderDao.deleteOrder(orderId);
    //해당 schedule에 수강 인원 차감
    await orderDao.subtractEnrolledMember(orderId);
  } catch (err) {
    console.error(err.message);
    throw err;
  }
  //qr코드 삭제
};
//QR_CODE 조회 (호스트 전용)
const getOrderByHost = async (orderId, hostId) => {
  //해당 구매 내역의 호스트인지 확인
  const checkHostAuth = await orderDao.getOrderIdByHostId(orderId, hostId);
  if (checkHostAuth.length == 0) {
    error.error(400, "다른_호스트님의_수업입니다");
  }
  //결제 내역 조회
  return checkHostAuth;
};
//포인트 충전
const chargeUserCredit = async (userId, credit) => {
  await orderDao.addUserCredit(userId, credit);
};
//카카오 페이 결제 인증
const kakaoAuth = async (tid, pg_token) => {
  return await fetch("https://kapi.kakao.com/v1/payment/approve", {
    method: "POST",
    headers: {
      "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
      Authorization: `KakaoAK e74beff521d0ad616f99dec66c5d1817`,
    },
    body: new URLSearchParams({
      cid: "TC0ONETIME",
      tid,
      partner_order_id: "partner_order_id",
      partner_user_id: "partner_user_id",
      pg_token,
    }),
  });
};
//카카오톡 내게 보내기
const sendKakaoToMe = async (userId, orderId) => {
  try {
    const refreshToken = await orderDao.getRefreshToken(userId);
    const response = await axios({
      method: "post",
      url: "https://kauth.kakao.com/oauth/token",
      headers: {
        "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
      params: {
        grant_type: "refresh_token",
        client_id: process.env.KAKAO_KEY,
        refresh_token: refreshToken,
      },
    });
    //머지 후 대체 예정
    const accessToken = response.data.access_token;

    await orderDao.updateAccessToken(userId, accessToken);
    const userInfo = await orderDao.getOrder(orderId);

    const { address, title, name, qr_code, image_source } = userInfo[0];

    const url = "https://kapi.kakao.com/v2/api/talk/memo/default/send";

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const params = new URLSearchParams();
    params.append(
      "template_object",
      JSON.stringify({
        object_type: "location",
        content: {
          title: `${title}`,
          description: `${name}님이 예약하신 클래스의 상세 위치를 알려드려요😍`,
          image_url: `${image_source}`,
          image_width: 800,
          image_height: 800,
          link: {
            web_url: "https://developers.kakao.com",
            mobile_web_url: "https://developers.kakao.com/mobile",
            android_execution_params: "platform=android",
            ios_execution_params: "platform=ios",
          },
        },
        buttons: [
          {
            title: "QR체크인",
            link: {
              web_url: `https://chart.apis.google.com/chart?cht=qr&chs=300x300&chl=${qr_code}`,
              mobile_web_url: `https://chart.apis.google.com/chart?cht=qr&chs=300x300&chl=${qr_code}`,
              ios_execution_params: "platform=ios",
              android_execution_params: "platform=android",
            },
          },
        ],
        address: `${address}`,
        address_title: `${title}`,
      })
    );
    const result = await axios.post(url, params, { headers });

    if (result.data.result_code === 0) {
      return { message: "SEND_MESSAGE_SUCCESS" };
    } else {
      throw Error("SEND_MESSAGE_FAILED");
    }
  } catch (err) {
    throw err;
  }
};

//호스트 정산
const adjustHostCredit = async (hostId, amount) => {
  const hostCredit = await orderDao.getHostCredit(hostId);
  if (hostCredit < amount) {
    error.error(400, "NOT_ENOUGH_CREDIT");
  }
  return await orderDao.subtractHostCredit(hostId, amount);
};

module.exports = {
  makeOrder,
  getAllOrders,
  getOrder,
  cancelOrder,
  getOrderByHost,
  chargeUserCredit,
  kakaoAuth,
  sendKakaoToMe,
  adjustHostCredit,
};
