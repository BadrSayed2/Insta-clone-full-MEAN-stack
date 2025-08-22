const express = require("express");
const {
  getUserPosts,
  deletePost,
  add_post_handler,
  update_post_handler,
} = require("../controllers/post.controller.js");
const authenticate = require("../middlewares/authenticate.middleware.js");
const upload = require("../config/multer.config.js");

const postRouter = express.Router();

// Create a post with optional image/video upload
postRouter.post(
  "/",
  authenticate,
  upload.fields([
    { name: "post_video", maxCount: 1 },
    { name: "post_pic", maxCount: 1 },
  ]),
  add_post_handler
);

// Update a post's caption/media
postRouter.put(
  "/:post_id",
  authenticate,
  upload.fields([
    { name: "post_video", maxCount: 1 },
    { name: "post_pic", maxCount: 1 },
  ]),
  update_post_handler
);

// Get posts for a specific user: /posts/user/:id
postRouter.get("/user/:id", getUserPosts);

// Delete post if it belongs to the user
postRouter.delete("/:id", authenticate, deletePost);

module.exports = postRouter;
