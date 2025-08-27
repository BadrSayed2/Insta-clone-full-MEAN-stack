const express = require("express");
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

const {
  createPost,
  deletePost,
  updatePostHandler,
  commentPost,
  feedPosts,
  getPost,
  getUserPosts,
  getMyPosts,
} = require("../controllers/post.controller.js");
const authenticate = require("../middlewares/auth-middleware.js");
const upload = require("../config/multer.config.js");

// Enable mergeParams so :username from parent route is visible here when nested
const postRouter = express.Router({ mergeParams: true });
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
//? this will be in post.routes.js
// postRouter.post("/comment/:postId", authenticate, commentPost);

postRouter.get("/feed", authenticate, feedPosts);
// Authenticated user's posts
postRouter.get("/me", authenticate, getMyPosts);
//! update post
postRouter.put(
  "/:postId",
  authenticate,
  upload.fields([
    { name: "post_video", maxCount: 1 },
    { name: "post_pic", maxCount: 1 },
  ]),
  updatePostHandler
);

// Nested list route when mounted at /users/:username/posts
// If mounted at top-level /posts, this will return 400 from controller when username is missing
postRouter.get("/", getUserPosts);

// Single post endpoints at top-level /posts
postRouter.get("/:postId", getPost);

// Delete post if it belongs to the user
postRouter.delete("/:postId", authenticate, deletePost);

module.exports = postRouter;
