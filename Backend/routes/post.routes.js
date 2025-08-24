const express = require("express");
const postController = require("../controllers/post.controller.js");
const authenticate = require("../middlewares/authenticate.middleware.js");
const upload = require("../config/multer.config.js");

const postRouter = express.Router();

postRouter.post(
  "/",
  authenticate,
  upload.fields([
    { name: "post_video", maxCount: 1 },
    { name: "post_pic", maxCount: 1 },
  ]),
  postController.addPostHandler
);

postRouter.post("/comment/:post_id", authenticate, postController.commentPost);

postRouter.get("/feed", authenticate, postController.feedPosts);

postRouter.put(
  "/:post_id",
  authenticate,
  upload.fields([
    { name: "post_video", maxCount: 1 },
    { name: "post_pic", maxCount: 1 },
  ]),
  postController.updatePostHandler
);

// Create a post with optional image/video upload

// Get posts for a specific user: /posts/user/:id
postRouter.get("/user/:id", postController.getUserPosts);

// Delete post if it belongs to the user
postRouter.delete("/:id", authenticate, postController.deletePost);

module.exports = postRouter;
