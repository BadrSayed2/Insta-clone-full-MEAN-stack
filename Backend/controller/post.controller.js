const Post = require("../models/post.model");

const getUserPosts = async (req, res) => {
  const userId = req.params.id;
  const posts = await Post.find({ user_id: userId }).sort({ createdAt: -1 });
  if (!posts.length) {
    return res.status(404).json({ message: "No posts found for this user" });
  }
  return res.status(200).json({ success: true, posts });
};

module.exports = { getUserPosts };
