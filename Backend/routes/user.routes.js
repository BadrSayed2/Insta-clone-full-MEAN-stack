const express = require("express");
const postRouter = require("../routes/post.routes.js");
const {
  getOtherUserProfile,
  getProfile,
  getFollowers,
  updateProfile,
  getUsers,
} = require("../controllers/user.controller.js");
const upload = require("../config/multer.config.js");
const authenticate = require("../middlewares/auth-middleware.js");
const router = express.Router();
router.get("/", getUsers); // get all users and search users
router.get("/me", authenticate, getProfile);
router.patch("/me", authenticate, upload.single("profile"), updateProfile);
router.get("/:username", authenticate, getOtherUserProfile);

router.use("/:username/posts", postRouter);
// router.get("/followers", authenticate, getFollowers);

module.exports = router;
