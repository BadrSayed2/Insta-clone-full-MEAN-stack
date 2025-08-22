const express = require("express");
const {
  getOtherUserProfile,
  getUserPosts,
} = require("../controller/user.controller.js");

const router = express.Router();

router.get("/:id", getOtherUserProfile);
router.get("/:id/posts", getUserPosts);

module.exports = router;
