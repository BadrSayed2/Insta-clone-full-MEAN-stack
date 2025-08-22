const User = require("../models/user.model");
const Post = require("../models/post.model");
const ApiResponse = require("../utils/api-response");
const ApiError = require("../utils/api-error");

const getOtherUserProfile = async (req, res, next) => {
  try {
    const userid = req.params.id;
    const user = await User.findOne({ _id: userid }).select(
      "userName fullName bio -_id"
    );
    if (!user) {
      return next(new ApiError("User not found", 404));
    }
    return res.status(200).json(new ApiResponse({ user }));
  } catch (err) {
    return next(err);
  }
};
const getUserPosts = async (req, res, next) => {
  const userId = req.params.id;
  const userPosts = await Post.find({
    user_id: userId,
    privacy: "public",
  }).sort({ createdAt: -1 });
  if (!userPosts || userPosts.length === 0) {
    return res.status(404).json(new ApiError("No posts found", 404));
  }
  return res.status(200).json(new ApiResponse({ posts: userPosts }));
};

module.exports = { getOtherUserProfile, getUserPosts };
