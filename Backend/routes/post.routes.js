
/**
 * /users
  GET    /users/me
  PATCH  /users/me
  GET    /users/:userId
  GET    /users/:userId/followers
  POST   /users/:userId/follow
  DELETE /users/:userId/follow
 */
/**
 * POST   /posts                 → create new post
  GET    /posts/:postId         → get single post
  DELETE /posts/:postId         → delete post
  PUT    /posts/:postId         → update post
  GET    /posts/feed            → get feed posts
  nested routes for comments and likes
 */
const express = require('express');

const {
  createPost,
  deletePost,
  updatePostHandler,
  feedPosts,
  getPost,
  getMyPosts,
} = require("../controllers/post.controller.js");
const authenticate = require("../middlewares/auth-middleware.js");
const upload = require("../config/multer.config.js");
const validate = require("../middlewares/validate.middleware.js");
const { deletePostSchema, getPostSchema, updatePostSchema } = require("../validators/post.validator.js");
const router = express.Router();



router.get("/me", authenticate, getMyPosts);
//h1 Create New Post
router.post(
  "/",
  authenticate,
  upload.fields([
    { name: "post_video", maxCount: 1 },
    { name: "post_pic", maxCount: 1 },
  ]),
  createPost
);

router.get("/feed", authenticate, feedPosts);
router.get("/:postId", validate(getPostSchema, "params") , getPost);

router.put(
  "/:postId",
  authenticate,
  upload.fields([
    { name: "post_video", maxCount: 1 },
    { name: "post_pic", maxCount: 1 },
  ]),
  validate(updatePostSchema, "params"),
  validate(updatePostSchema, "body"),
  updatePostHandler
);

router.delete("/:postId", validate(deletePostSchema, "params"), authenticate, deletePost);

module.exports = router;
