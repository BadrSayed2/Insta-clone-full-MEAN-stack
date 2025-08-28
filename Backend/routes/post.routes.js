const express = require("express");
/**
 * /users
  GET    /users/me
  PATCH  /users/me
  ------------------
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

const {
  createPost,
  deletePost,
  updatePostHandler,
  commentPost,
  feedPosts,
  getPost,
  get_comments,
} = require("../controllers/post.controller.js");
const authenticate = require("../middlewares/auth-middleware.js");
const upload = require("../config/multer.config.js");

const postRouter = express.Router();
//! create new Post
postRouter.post(
  "/",
  authenticate,
  upload.fields([
    { name: "post_video", maxCount: 1 },
    { name: "post_pic", maxCount: 1 },
  ]),
  createPost
);

postRouter.post("/comment/:postId", authenticate, postController.commentPost);

postRouter.get("/comment/:postId", authenticate ,postController.get_comments)

//! get user posts for users which he follows
postRouter.get("/feed", authenticate, feedPosts);
//!get specific Post with id
postRouter.get("/:postId", getPost);
v
postRouter.put(
  "/:postId",
  authenticate,
  upload.fields([
    { name: "post_video", maxCount: 1 },
    { name: "post_pic", maxCount: 1 },
  ]),
  updatePostHandler
);

// Get posts for a specific user: /posts/user/:id
postRouter.get("/user/:id", authenticate , postController.getUserPosts);

//! Delete post if it belongs to the user
postRouter.delete("/:postId", authenticate, deletePost);


module.exports = postRouter;
