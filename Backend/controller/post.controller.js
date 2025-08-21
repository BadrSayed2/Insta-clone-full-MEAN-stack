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

module.exports = { getUserPosts };
