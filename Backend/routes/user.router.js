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
const authenticate = require("../middlewares/authenticate.middleware.js");
const { followUser } = require("../controller/follower.controller.js");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.patch("/confirm-email", confirmEmail);
router.get("/:id", getOtherUserProfile);
router.get("/posts/:id", getUserPosts);
router.post("/follow", authenticate, followUser);

module.exports = router;
