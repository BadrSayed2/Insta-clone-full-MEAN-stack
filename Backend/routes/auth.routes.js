const express = require("express");
const {
  signup,
  login,
  forgetPassword,
  resetPassword,
  verifyOtp,
} = require("../controllers/auth.controller.js");

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/forget-password", forgetPassword);
authRouter.post("/reset-password", resetPassword);
authRouter.post("/verify_otp", verifyOtp);
module.exports = authRouter;
