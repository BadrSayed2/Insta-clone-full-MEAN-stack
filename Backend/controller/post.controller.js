const Post = require("../models/post.model");
const ApiResponse = require("../utils/api-response");
const ApiError = require("../utils/api-error");

const getUserPosts = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const posts = await Post.find({ user_id: userId }).sort({ createdAt: -1 });
    if (!posts.length) {
      return next(new ApiError("No posts found for this user", 404));
    }
    return res.status(200).json(new ApiResponse({ posts }));
  } catch (err) {
    return next(err);
  }
};
const deletePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return next(new ApiError("Post not found", 404));
    }
    // Check if the post belongs to the user
    if (post.user_id.toString() !== req.user.id) {
      return next(
        new ApiError("You are not authorized to delete this post", 403)
      );
    }
    await post.remove();
    return res
      .status(200)
      .json(new ApiResponse({ message: "Post deleted successfully" }));
  } catch (err) {
    return next(err);
  }
};

module.exports = { getUserPosts, deletePost };
