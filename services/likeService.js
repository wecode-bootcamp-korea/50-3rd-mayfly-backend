const likeDao = require("../models/likeDao");
const error = require("../middleware/error");
//좋아요 클릭
const clickLike = async (userId, classId) => {
  const checkLike = await likeDao.getLike(userId, classId);
  if (checkLike.length == !1) {
    await likeDao.createLike(userId, classId);
  } else {
    await likeDao.deleteLike(userId, classId);
  }
};
//유저 좋아요 목록
const getAllLikesByUserId = async (userId) => {
  const checkUser = await likeDao.checkUser(userId);
  if (checkUser.length == !1) {
    error.error(400, "존재하지 않는 회원입니다.");
  }
  return await likeDao.getAllLikesByUserId(userId);
};
//클래스 좋아요 갯수
const getLikesByClass = async (classId) => {
  const checkClass = await likeDao.checkClass(classId);
  if (checkClass.length == !1) {
    error.error(400, "존재하지 않는 클래스입니다");
  }
  return await likeDao.getLikesClassCount(classId);
};

module.exports = { clickLike, getAllLikesByUserId, getLikesByClass };
