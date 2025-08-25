const Follower = require("../models/follower.model");
const User = require("../models/user.model");
const logger = require("../utils/logger");
const ApiError = require("../utils/api-error");
const ApiResponse = require("../utils/api-response");

const followUser = async (req, res, next) => {
  const { userIdToFollow } = req.body;
  const currentUserId = req.user.id;
  logger.debug(`Follow request target=${userIdToFollow} by=${currentUserId}`);

  if (currentUserId === userIdToFollow) {
    return next(new ApiError("You cannot follow yourself", 400));
  }

  const currentUser = await User.findById({ _id: currentUserId });
  if (!currentUser) {
    return next(new ApiError("Current user not found", 404));
  }

  const userToFollow = await User.findById({ _id: userIdToFollow });
  if (!userToFollow) {
    return next(new ApiError("User to follow not found", 404));
  }

  const follow = await Follower.create({
    user: currentUser._id,
    followed: userToFollow._id,
  });

  return res
    .status(201)
    .json(new ApiResponse({ follow }, "Followed successfully"));
};

module.exports = { followUser };
