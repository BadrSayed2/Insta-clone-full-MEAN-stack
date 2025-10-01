const express = require("express");
const {
  signup,
  login,
  forgetPassword,
  resetPassword,
  verifyOtp,
} = require("../controllers/auth.controller.js");
const authenticate = require("../middlewares/auth-middleware.js");
const validate = require("../middlewares/validate.middleware.js");
const { signupSchema, loginSchema, forgetPasswordSchema, resetPasswordSchema, verifyOtpSchema } = require("../validators/auth.validator.js");

const router = express.Router();
// check authentication status
router.get("/check", authenticate, (req, res) => {
  res
    .status(200)
    .json({ success: true, message: "you are authenticated", data: req.user });
});
router.post("/signup",validate(signupSchema, "body"), signup);
router.post("/login",validate(loginSchema, "body"), login);
router.post("/forget-password",validate(forgetPasswordSchema, "body"), forgetPassword);
router.post("/reset-password",validate(resetPasswordSchema, "body"), resetPassword);
router.post("/verify-otp",validate(verifyOtpSchema, "body"), verifyOtp);
module.exports = router;
