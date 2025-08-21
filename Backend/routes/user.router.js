const express = require("express");
const { getOtherUserProfile } = require("../controller/user.controller.js");

const router = express.Router();

// User profile & related routes (non-auth)
router.get("/:id", getOtherUserProfile);
// posts and follow routes moved to post.router.js and follow.router.js

module.exports = router;
