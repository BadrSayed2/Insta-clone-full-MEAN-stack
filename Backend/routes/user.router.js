const express = require("express");

const {
  signup,
  login,
  confirmEmail,
} = require("../controller/auth.controller.js");
const { getUserPosts } = require("../controller/user.control.getMyPost.js");
const {
  getOtherUserProfile,
} = require("../controller/otherUser.controller.js");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.patch("/confirm-email", confirmEmail);
router.get("/:id", getOtherUserProfile);
router.get("/posts/:id", getUserPosts);

module.exports = router;
