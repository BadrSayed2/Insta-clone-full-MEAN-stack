const express = require("express");
const {
  signup,
  login,
  confirmEmail,
} = require("../controller/auth.controller.js");

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.patch("/confirm-email", confirmEmail);

module.exports = authRouter;
