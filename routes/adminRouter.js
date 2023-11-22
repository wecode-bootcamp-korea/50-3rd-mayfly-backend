const express = require("express");
const router = express.Router();
const adminController = require("../controller/adminController");
const adminVerifyToken = require("../middleware/auth");


router.post("/signup", adminController.adminSignup);
router.post("/login", adminController.adminLogin);
router.get("/userlist", adminVerifyToken.adminVerifyToken, adminController.getUsersList);
router.put("/users/:userId", adminVerifyToken.adminVerifyToken, adminController.deleteUserByUserId);
router.put("/users/update/:userId", adminVerifyToken.adminVerifyToken, adminController.restoreUserByUserId);
router.get("/hostlist", adminVerifyToken.adminVerifyToken, adminController.getHostsList);
router.put("/hosts/:hostId", adminVerifyToken.adminVerifyToken, adminController.deleteHostByHostId);
router.put("/hosts/update/:hostId", adminVerifyToken.adminVerifyToken, adminController.restoreHostByHostId);

module.exports = {
    router
}

