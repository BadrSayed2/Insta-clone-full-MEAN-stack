const express = require("express");
const {
  getUserPosts,
  deletePost,
} = require("../controller/post.controller.js");

const postRouter = express.Router();

// Get posts for a specific user: /posts/user/:id
postRouter.get("/user/:id", getUserPosts);
// delete post if only post belong to the user
postRouter.delete("/:id", deletePost);
module.exports = postRouter;
