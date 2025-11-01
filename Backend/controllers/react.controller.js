
const Post = require("../models/post.model");
const ApiResponse = require("../utils/api-response");
const apiError = require("../utils/api-error");
const Reactions = require("../models/Reaction.model");


const toggleReaction = async (req, res, next) => {
  const { targetType, targetId, type = "like" } = req.body;
  const userId = req.user.id;
  let target;
  //h1 1) check if target specified is valid (Post or comments)
  if (targetType === "Post") {
    target = await Post.findById(targetId);
  }
  if (!target) {
    return next(new apiError(`No ${targetType} found with this ID`, 404));
  }
  //h1 2) check if reaction already exists, if yes
  let existingReaction = await Reactions.findOne({
    user: userId,
    targetType,
    targetId,
  });
  if (existingReaction) {
    await Reactions.findByIdAndDelete(existingReaction._id);
    res
      .status(200)
      .json(new ApiResponse({ message: "Reaction removed successfully" }));
  } else {
    const reaction = await Reactions.create({
      user: userId,
      type,
      targetType,
      targetId,
    });
    await reaction.populate("user", "userName profile_pic");
    res
      .status(200)
      .json(new ApiResponse({ message: "Reaction added successfully" }));
  }
};

module.exports = { toggleReaction};
