const express = require("express");
const router = express.Router();

const {
  sendOtp,
  verifyOtp,
  resendOtp,
  userDetails,
} = require("../controllers/auth.controller");

const authMiddleware = require("../middlewares/auth.middleware");


router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.get("/user-details", authMiddleware, userDetails);

module.exports = router;
