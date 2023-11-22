const express = require("express");
const router = express.Router();
const hostController = require("../controller/hostController");
const hostVerifyToken = require("../middleware/auth");


router.post("/signup", hostController.hostSignup);
router.get("/", hostVerifyToken.hostVerifyToken, hostController.getHost);
router.put("/update", hostVerifyToken.hostVerifyToken, hostController.updateHost);
router.put("/delete", hostVerifyToken.hostVerifyToken, hostController.deleteHost);
router.get("/credit", hostVerifyToken.hostVerifyToken, hostController.getHostCredit);

module.exports = {
    router
};