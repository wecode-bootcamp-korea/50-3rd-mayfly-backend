const { appDataSource } = require("./datasource");

//유저 조회
const checkUser = async (userId) => {
  return await appDataSource.query(`SELECT id FROM users WHERE id = ?`, [
    userId,
  ]);
};
//클래스 조회
const checkClass = async (classId) => {
  return await appDataSource.query(`SELECT id FROM classes WHERE id = ?`, [
    classId,
  ]);
};

//좋아요 생성
const createLike = async (userId, classId) => {
  await appDataSource.query(
    `INSERT INTO likes (user_id, class_id) VALUES(?,?)`,
    [userId, classId]
  );
};
//좋아요 삭제
const deleteLike = async (userId, classId) => {
  await appDataSource.query(
    `DELETE FROM likes WHERE user_id = ? AND class_id = ? `,
    [userId, classId]
  );
};

//유저 아이디로 전체 좋아요 조회
const getAllLikesByUserId = async (userId) => {
  return await appDataSource.query(
    `SELECT c.id, c.title, p.address, h.name AS hostName, i.image_source, t.name AS topName, sb.name AS subName
     FROM likes l 
     JOIN users u ON l.user_id = u.id
     JOIN classes c ON l.class_id = c.id
     JOIN places p ON p.id = c.place_id
     JOIN hosts h ON c.host_id = h.id
     JOIN images i ON i.class_id = c.id
     JOIN top_categories t ON t.id = c.top_category_id
     JOIN sub_categories sb ON sb.id = c.sub_category_id
     WHERE l.user_id =? AND i.name = "main"`,
    [userId]
  );
};

//유저 아이디로 해당 클래스 좋아요 조회
const getLike = async (userId, classId) => {
  return await appDataSource.query(
    `SELECT * FROM likes WHERE user_id =? AND class_id =?`,
    [userId, classId]
  );
};
//클래스의 전체 좋아요 갯수 조회
const getLikesClassCount = async (classId) => {
  const classLikes = await appDataSource.query(
    `SELECT COUNT(id) FROM likes WHERE class_id =?`,
    [classId]
  );

  return classLikes[0]["COUNT(id)"];
};

module.exports = {
  checkUser,
  checkClass,
  createLike,
  deleteLike,
  getAllLikesByUserId,
  getLike,
  getLikesClassCount,
};
