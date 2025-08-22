const express = require("express");
const {
  signup,
  login,
  confirmEmail,
  forgetPassword,
  resetPassword,
} = require("../controllers/auth.controller.js");

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.get("/verify", confirmEmail);
authRouter.post("/forget-password", forgetPassword);
authRouter.post("/reset-password", resetPassword);

module.exports = authRouter;
