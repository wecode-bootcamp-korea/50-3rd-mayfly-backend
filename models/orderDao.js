const { appDataSource } = require("./datasource");

//잔여 좌석 확인
const checkRemainMember = async (scheduleId, transaction) => {
  const query = `SELECT max_member-enrolled_member AS remain_member FROM schedules WHERE id =?`;
  const result = await transaction.query(query, [scheduleId]);
  return result[0].remain_member;
};
//스케줄에 enrolled_member 추가
const addEnrolledMember = async (scheduleId, quantity, transaction) => {
  try {
    const query = `UPDATE schedules SET enrolled_member = enrolled_member + ? WHERE id = ?`;
    await transaction.query(query, [quantity, scheduleId]);
  } catch (err) {
    console.error("트랜잭션에서 에러 발생", err);
    throw err;
  }
};
//스케줄에 enrolled_member 빼기
const subtractEnrolledMember = async (orderId) => {
  const [getOrderQuantity] = await appDataSource.query(
    `SELECT quantity FROM orders WHERE id = ?`,
    [orderId]
  );
  const orderQuantity = getOrderQuantity.quantity;
  await appDataSource.query(
    `UPDATE schedules SET enrolled_member = enrolled_member -? WHERE id =?`,
    [orderQuantity, orderId]
  );
};

////유저 크레딧 관련
//유저 크레딧 확인
const getUserCredit = async (userId, transaction) => {
  const query = `SELECT credit FROM users WHERE id =?`;
  const result = await transaction.query(query, [userId]);
  return result[0].credit;
};
//유저 크레딧 추가
const addUserCredit = async (userId, credit) => {
  await appDataSource.query(`UPDATE users SET credit = credit +? WHERE id =?`, [
    credit,
    userId,
  ]);
};
//유저 크레딧 차감
const subtractUserCredit = async (userId, price, transaction) => {
  try {
    const query = `UPDATE users SET credit = credit - ? WHERE id =?`;
    await transaction.query(query, [price, userId]);
  } catch (err) {
    console.error("트랜잭션에서 에러 발생", err);
    throw err;
  }
};

////호스트 크레딧 관련
//호스트 크레딧 확인
const getHostCredit = async (hostId) => {
  const result = await appDataSource.query(
    `SELECT credit FROM hosts WHERE id = ?`,
    [hostId]
  );
  return result[0].credit;
};
//호스트 크레딧 추가
const addHostCredit = async (hostId, price, transaction) => {
  try {
    const query = `UPDATE hosts SET credit = credit +? WHERE id =?`;
    await transaction.query(query, [price, hostId]);
  } catch (err) {
    console.error("트랜잭션에서 에러 발생", err);
    throw err;
  }
};
//호스트 크레딧 차감
const subtractHostCredit = async (hostId, price) => {
  await appDataSource.query(
    `UPDATE hosts SET credit = credit - ? WHERE id =?`,
    [price, hostId]
  );
};
//특정 결제 내역 체크
const checkOrder = async (orderId, userId) => {
  return await appDataSource.query(
    `SELECT id FROM orders WHERE user_id =? AND id =?`,
    [userId, orderId]
  );
};
//결제 내역 생성
const createOrder = async (
  userId,
  classId,
  scheduleId,
  quantity,
  email,
  transaction
) => {
  const query = `INSERT INTO orders (user_id, class_id, quantity, email, schedule_id, created_at, status)VALUES(?,?,?,?,?,now(),1)`;
  const result = await transaction.query(query, [
    userId,
    classId,
    quantity,
    email,
    scheduleId,
  ]);
  //INSERT문으로 생성된 데이터에 orderId를 추출해 qr코드에서 쓸 주소 삽입
  const orderId = result.insertId;
  const query2 = `UPDATE orders SET qr_code = "localhost:8000/orders/qr_code/?" WHERE id =?`;
  await transaction.query(query2, [orderId, orderId]);
  return { orderId: orderId };
};
//전체 결제 내역 조회
const getAllOrders = async (userId) => {
  return await appDataSource.query(
    `SELECT c.title, o.quantity, o.created_at, o.status 
    FROM orders o 
    JOIN schedules s ON o.schedule_id = s.id  
    JOIN classes c ON s.class_id = c.id 
    JOIN users u ON o.user_id = u.id 
    JOIN places p ON c.place_id = p.id 
    WHERE u.id = ? AND o.deleted_at is NULL`,
    [userId]
  );
};
//특정 결제 내역 조회
const getOrder = async (orderId) => {
  return await appDataSource.query(
    `SELECT u.name, c.title, o.quantity, s.class_day, s.class_hour, p.address, o.created_at, o.status, 
    o.qr_code, i.image_source FROM orders o 
    JOIN schedules s ON o.schedule_id = s.id  
    JOIN classes c ON s.class_id = c.id 
    JOIN users u ON o.user_id = u.id 
    JOIN places p ON c.place_id = p.id 
    JOIN images i ON c.id = i.class_id
    WHERE o.id = ?
    AND i.name = "main"`,
    [orderId]
  );
};
//결제 내역 삭제
const deleteOrder = async (orderId) => {
  await appDataSource.query(
    `UPDATE orders SET deleted_at = NOW() WHERE id =?`,
    [orderId]
  );
};
//hostId로 주문내역 조회(추후 스케줄 테이블 조인해서 수업 날짜 및 시간도 받아오기)
const getOrderIdByHostId = async (orderId, hostId) => {
  return await appDataSource.query(
    `SELECT u.name, c.title, o.quantity, s.class_day FROM orders o 
    JOIN schedules s ON o.schedule_id = s.id  
    JOIN classes c ON s.class_id = c.id 
    JOIN users u ON o.user_id = u.id 
    JOIN hosts h ON c.host_id = h.id 
    WHERE o.id = ? AND h.id = ?`,
    [orderId, hostId]
  );
};
//리프레시 토큰 받아오기
const getRefreshToken = async (userId) => {
  const result = await appDataSource.query(
    `SELECT refresh_token FROM users WHERE id=?`,
    [userId]
  );
  return result[0].refresh_token;
};
//Access Token 업데이트
const updateAccessToken = async (userId, accessToken) => {
  return await appDataSource.query(
    `UPDATE users SET access_token = ? WHERE id =?`,
    [accessToken, userId]
  );
};
//큐알코드 조회
const getQrcode = async (orderId) => {
  const result = await appDataSource.query(
    `SELECT qr_code FROM orders WHERE id =?`,
    [orderId]
  );
  return result[0].qr_code;
};

module.exports = {
  checkRemainMember,
  createOrder,
  getAllOrders,
  getOrder,
  deleteOrder,
  addEnrolledMember,
  subtractEnrolledMember,
  getUserCredit,
  addUserCredit,
  subtractUserCredit,
  getHostCredit,
  addHostCredit,
  subtractHostCredit,
  getOrderIdByHostId,
  getRefreshToken,
  updateAccessToken,
  getQrcode,
  checkOrder,
};
