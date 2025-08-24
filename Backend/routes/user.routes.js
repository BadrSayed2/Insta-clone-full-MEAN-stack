const express = require("express");
const {
  getOtherUserProfile,
  getUserPosts,
  get_profile,
  get_followers,
  updateProfile,
} = require("../controllers/user.controller.js");
const upload = require("../config/multer.config.js");
const authenticate = require("../middlewares/authenticate.middleware.js");
const router = express.Router();

// Profile routes (from legacy user.routes.js)
router.get("/", authenticate, get_profile);
router.get("/followers", authenticate, get_followers);
router.get("/:id", getOtherUserProfile);

// Public user info + posts (from previous user.router.js)

router.get("/:id/posts", getUserPosts);
router.patch("/", authenticate, upload.single("profile"), updateProfile);

module.exports = router;
