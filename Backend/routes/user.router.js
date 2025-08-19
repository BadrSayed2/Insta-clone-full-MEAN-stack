const express = require("express");
// const { validate } = require("../middlewares/validation.middleware.js");
// const { signupSchema } = require("../controller/user.validation.js");
const { login } = require("../controller/user.control.login.js");
const { signup } = require("../controller/user.control.signup.js");
const { confirmEmail } = require("../controller/user.control.confirmEmail.js");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.patch("/confirm-email", confirmEmail);

module.exports = router;   
