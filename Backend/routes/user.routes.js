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
const validate = require("../middlewares/validate");
const authenticate = require("../middlewares/auth-middleware.js");
const { getOtherUserProfileSchema, getUsersSchema, updateProfileSchema } = require("../validators/user.validator.js");


const router = express.Router();
router.get("/", validate(getUsersSchema, "query"), getUsers); // get all users and search users
router.get("/me", authenticate, getProfile);
router.patch("/me", authenticate, upload.single("profile") ,validate(updateProfileSchema, "body"), updateProfile);
router.get("/:username", authenticate, validate(getOtherUserProfileSchema, "params") , getOtherUserProfile);

router.use("/:username/posts", postRouter);
// router.get("/followers", authenticate, getFollowers);

module.exports = router;
