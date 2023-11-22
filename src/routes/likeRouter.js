const express = require("express");
const router = express.Router();
const likeController = require("../controller/likeController");
const auth = require("../middleware/auth");

router.post("/", auth.userVerifyToken, likeController.clickLike);
router.get("/", likeController.getLikesByClass);
router.get("/users", auth.userVerifyToken, likeController.getAllLikesByUserId);

module.exports = router;
