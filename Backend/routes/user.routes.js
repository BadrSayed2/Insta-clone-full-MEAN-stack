const express = require("express");
const postRouter = require("../routes/post.routes.js");
const {
  getOtherUserProfile,
  getProfile,
  getFollowers,
  updateProfile,
} = require("../controllers/user.controller.js");
const upload = require("../config/multer.config.js");
const authenticate = require("../middlewares/auth-middleware.js");
const router = express.Router();
router.get("/me", authenticate, getProfile);
router.patch("/me", authenticate, upload.single("profile"), updateProfile);
//h1 -------
router.get("/:username", authenticate, getOtherUserProfile);
//! should be in follow routes
// router.get("/followers", authenticate, getFollowers);
router.use("/:username/posts", postRouter);

module.exports = router;
