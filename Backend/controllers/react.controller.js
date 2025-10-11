const apiError = require("../utils/api-error");
const apiResponse = require("../utils/api-response");
const Posts = require("../models/post.model");
const Reactions = require("../models/Reaction.model");
const toggleReaction = async (req, res, next) => {
  const { targetType, targetId, type = "like" } = req.body;
  const userId = req.user.id;
  let target;
  //h1 1) check if target specified is valid (posts or comments)
  if (targetType === "Post") {
    target = await Posts.findById(targetId);
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
      .json(new apiResponse({ message: "Reaction removed successfully" }));
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
      .json(new apiResponse({ message: "Reaction added successfully" }));
  }
};
module.exports = { toggleReaction };
