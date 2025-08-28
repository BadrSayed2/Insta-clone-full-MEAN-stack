const express = require("express");
const {
  signup,
  login,
  forgetPassword,
  resetPassword,
  verifyOtp,
} = require("../controllers/auth.controller.js");
const authenticate = require("../middlewares/auth-middleware.js");

const authRouter = express.Router();
authRouter.get('/check' , authenticate, (req,res)=>{
  res.status(200).json({success : true})
})
authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/forget-password", forgetPassword);
authRouter.post("/reset-password", resetPassword);
authRouter.post("/verify_otp", verifyOtp);
module.exports = authRouter;
