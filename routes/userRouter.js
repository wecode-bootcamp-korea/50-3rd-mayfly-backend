const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const userVerifyToken = require("../middleware/auth")


router.post("/signup", userController.userSignup);
router.get("/", userVerifyToken.userVerifyToken, userController.getUserByInfo);
router.put("/update", userVerifyToken.userVerifyToken, userController.updateUser);
router.put("/delete", userVerifyToken.userVerifyToken, userController.deleteUserByInfo);
router.get("/credit", userVerifyToken.userVerifyToken, userController.getUserByCredit);

module.exports = {
    router
};