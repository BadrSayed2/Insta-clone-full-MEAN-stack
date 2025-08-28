const express = require("express");
const {
  getOtherUserProfile,
  getProfile,
  getFollowers,
  updateProfile,
} = require("../controllers/user.controller.js");
const upload = require("../config/multer.config.js");
const authenticate = require("../middlewares/auth-middleware.js");
const router = express.Router();

// Profile routes (from legacy user.routes.js)
router.get("/", authenticate, getProfile);
router.get("/followers", authenticate, getFollowers);
router.get("/:id", getOtherUserProfile);

router.patch("/", authenticate, upload.single("profile"), updateProfile);

module.exports = router;
