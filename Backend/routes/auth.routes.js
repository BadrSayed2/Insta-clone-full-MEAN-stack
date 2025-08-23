const express = require("express");
const {
  signup,
  login,
  forgetPassword,
  resetPassword,
} = require("../controllers/auth.controller.js");

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/forget-password", forgetPassword);
authRouter.post("/reset-password", resetPassword);

module.exports = authRouter;
