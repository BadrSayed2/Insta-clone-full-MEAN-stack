const express = require("express");
const post_controller = require("../controllers/post.controller.js");
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
  post_controller.add_post_handler
);

postRouter.post('/comment/:post_id', authenticate, post_controller.comment_post)

postRouter.get('/feed', authenticate, post_controller.feed_posts)

postRouter.put('/:post_id', authenticate,
    upload.fields([
        { name: "post_video", maxCount: 1 },
        { name: "post_pic", maxCount: 1 },
    ]), post_controller.update_post_handler)

// Create a post with optional image/video upload

// Get posts for a specific user: /posts/user/:id
postRouter.get("/user/:id", post_controller.getUserPosts);

// Delete post if it belongs to the user
postRouter.delete("/:id", authenticate, post_controller.deletePost);

module.exports = postRouter;
