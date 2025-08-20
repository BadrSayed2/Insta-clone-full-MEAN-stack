const express = require("express");
const { login } = require("../controller/user.control.login.js");
const { signup } = require("../controller/user.control.signup.js");
const { confirmEmail } = require("../controller/user.control.confirmEmail.js");
const { getUserPosts } = require("../controller/user.control.getMyPost.js");
const { getOtherUserProfile } = require("../controller/otherUser.controller.js");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.patch("/confirm-email", confirmEmail);
router.get("/:id" , getOtherUserProfile );
router.get("/posts/:id", getUserPosts );

module.exports = router;   
