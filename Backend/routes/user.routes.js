const express = require("express");
const {
  getOtherUserProfile,
  getUserPosts,
  verify_otp,
  get_profile,
  get_followers,
  updateProfile,
} = require("../controllers/user.controller.js");
const authenticate = require("../middlewares/authenticate.middleware.js");

const router = express.Router();

// Profile routes (from legacy user.routes.js)
router.get("/", authenticate, get_profile);
router.get("/followers", authenticate, get_followers);
router.post("/verify_otp", verify_otp);

// Public user info + posts (from previous user.router.js)
router.get("/:id", getOtherUserProfile);
router.get("/:id/posts", getUserPosts);
router.put("/", authenticate, updateProfile);

module.exports = router;
