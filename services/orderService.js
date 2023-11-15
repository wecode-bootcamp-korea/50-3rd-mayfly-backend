const orderDao = require("../models/orderDao");
const error = require("../middleware/error");
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();
const { appDataSource } = require("../models/datasource");

// //결제하기
// const makeOrder = async (
//   userId,
//   classId,
//   hostId,
//   scheduleId,
//   quantity,
//   price,
//   email
// ) => {
//   await appDataSource.transaction(async (transactionalEntityManager) => {
//     try {
//       //예외)예약 인원이 수업 잔여 인원을 넘을 때
//       const checkRemainMember = await orderDao.checkRemainMember(
//         classId,
//         scheduleId
//       );
//       if (checkRemainMember < quantity) {
//         throw new Error("NO_SEATS_LEFT");
//       }
//       //예외)크레딧이 부족할 때
//       const [checkCredit] = await orderDao.getUserCredit(userId);
//       if (price > checkCredit.credit) {
//         throw new Error("NOT_ENOUGH_CREDITS");
//       }
//       //결제 내역 생성
//       await orderDao.createOrder(
//         userId,
//         classId,
//         hostId,
//         scheduleId,
//         quantity,
//         price,
//         email
//       );
//       //해당 schedule에 수강 인원 추가
//       await orderDao.addEnrolledMember(scheduleId, quantity);
//       //유저 포인트 차감
//       await orderDao.subtractUserCredit(userId);
//       //호스트 포인트 증가
//       await orderDao.addHostCredit(hostId, price);
//       //트랜잭션 커밋
//       await transactionalEntityManager.commit();
//     } catch (err) {
//       if (err.message === "NO_SEATS_LEFT") {
//         // 클라이언트에게 전달할 메시지 설정
//         err.statusCode = 400;
//         err.clientMessage = "No seats left for the class";
//       } else if (err.message === "NOT_ENOUGH_CREDITS") {
//         // 클라이언트에게 전달할 메시지 설정
//         err.statusCode = 400;
//         err.clientMessage = "Not enough points for the payment";
//       }
//       // 예외 재던지기
//       throw err;
//     }
//   });
// };

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
    await appDataSource.transaction(async (transaction) => {
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
      await orderDao.createOrder(
        userId,
        classId,
        hostId,
        scheduleId,
        quantity,
        price,
        email,
        transaction
      );
      //해당 schedule에 수강 인원 추가
      await orderDao.addEnrolledMember(scheduleId, quantity, transaction);
      //유저 포인트 차감
      await orderDao.subtractUserCredit(userId, price, transaction);
      //호스트 포인트 증가
      await orderDao.addHostCredit(hostId, price, transaction);
    });
  } catch (err) {
    console.error("에러발생", err.message);
    throw err;
  }
};

//전체 결제 내역 조회
const getAllOrders = async (userId) => {
  return await orderDao.getAllOrders(userId);
};
//특정 결제 내역 조회
const getOrder = async (orderId) => {
  return await orderDao.getOrder(orderId);
};

//결제 취소
const cancelOrder = async (orderId) => {
  //결제 내역 삭제
  await orderDao.deleteOrder(orderId);
  //해당 schedule에 수강 인원 차감
  await orderDao.subtractEnrolledMember(orderId);
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

//카카오 페이 인증

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

// return await fetch("https://kapi.kakao.com/v1/payment/approve", {
//   method: "POST",
//   headers: {
//     "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
//     Authorization: `KakaoAK e74beff521d0ad616f99dec66c5d1817`,
//   },
//   body: new URLSearchParams({
//     cid: "TC0ONETIME",
//     tid,
//     partner_order_id: "partner_order_id",
//     partner_user_id: "partner_user_id",
//     pg_token,
//   }),
// });

//카카오 내게 보내기
const sendKakaoToMe = async () => {
  const accessToken =
    "HNHSNv1dCgnrg4JZcHAvvxDzqlvN3NnWF18KKiUQAAABi9MHFPWSBpCp5rpDbg";

  const url = "https://kapi.kakao.com/v2/api/talk/memo/default/send";

  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  const data = {
    template_object: JSON.stringify({
      object_type: "text",
      text: "프로젝트 성공!!",
      link: {
        web_url: "https://www.naver.com",
      },
    }),
  };

  const response = await axios.post(url, data, { headers });
  res.send("메시지 전송 성공");
};

const sendKakaoToMe1 = async () => {
  /* const refreshToken = await orderDao.getRefreshToken(userId);
  console.log(refreshToken);
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
*/
  // const message = {
  //   object_type: "text",
  //   text: "테스트 메시지",
  //   link: {
  //     web_url: "https://www.google.co.kr",
  //     mobile_web_url: "https://www.google.co.kr",
  //   },
  //   button_title: "웹사이트 방문",
  // };

  const accessToken =
    "HNHSNv1dCgnrg4JZcHAvvxDzqlvN3NnWF18KKiUQAAABi9MHFPWSBpCp5rpDbg";

  const url = "https://kapi.kakao.com/v2/api/talk/memo/default/send";

  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  const data = {
    template_object: JSON.stringify({
      object_type: "text",
      text: "프로젝트 성공!!",
      link: {
        web_url: "https://www.naver.com",
      },
    }),
  };

  const response = await axios.post(url, data, { headers });
  res.send("메시지 전송 성공");
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
};
