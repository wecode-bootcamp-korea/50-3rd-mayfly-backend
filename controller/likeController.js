const likeService = require("../services/likeService");
const error = require("../middleware/error");
//좋아요 클릭
const clickLike = async (req, res) => {
  try {
    // const userId = req.users.id(토큰 사용)
    const { userId, classId } = req.body;
    if (!userId || !classId) {
      error.error(500, "KEY_ERROR");
    }
    const result = await likeService.clickLike(userId, classId);
    return res.status(200).json({ message: "REQUEST_ACCEPTED", result });
  } catch (err) {
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
};
//유저 좋아요 목록 조회
const getAllLikesByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      error.error(500, "KEY_ERROR");
    }
    const result = await likeService.getAllLikesByUserId(userId);
    return res.status(200).json({ message: "LIKES_LOADED", result });
  } catch (err) {
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
};
//클래스 좋아요 갯수
const getLikesByClass = async (req, res) => {
  try {
    const { classId } = req.query;

    if (!classId) {
      error.error(500, "KEY_ERROR");
    }
    const likes = await likeService.getLikesByClass(classId);
    return res.status(200).json({ message: "LIKES_LOADED", likes });
  } catch (err) {
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
};

module.exports = { clickLike, getAllLikesByUserId, getLikesByClass };
