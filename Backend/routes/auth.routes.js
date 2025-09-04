const express = require("express");
const {
  signup,
  login,
  forgetPassword,
  resetPassword,
  verifyOtp,
} = require("../controllers/auth.controller.js");
const authenticate = require("../middlewares/auth-middleware.js");

const router = express.Router();
// check authentication status
router.get("/check", authenticate, (req, res) => {
  res
    .status(200)
    .json({ success: true, message: "you are authenticated", data: req.user });
});
router.post("/signup", signup);
router.post("/login", login);
router.post("/forget-password", forgetPassword);
router.post("/reset-password", resetPassword);
router.post("/verify-otp", verifyOtp);
module.exports = router;
