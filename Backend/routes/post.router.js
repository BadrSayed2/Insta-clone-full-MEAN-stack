const express = require("express");
const { getUserPosts } = require("../controller/post.controller.js");

const postRouter = express.Router();

// Get posts for a specific user: /posts/user/:id
postRouter.get("/user/:id", getUserPosts);

module.exports = postRouter;
