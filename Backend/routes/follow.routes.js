const express = require("express");
const authenticate = require("../middlewares/auth-middleware.js");
const { followUser } = require("../controllers/follow.controller.js");

const router = express.Router();

// Follow a user: POST /follow  with body { userIdToFollow }
router.post("/", authenticate, followUser);
module.exports = router;
