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

  const currentUser = await User.findById(currentUserId);
  if (!currentUser) {
    return next(new ApiError("Current user not found", 404));
  }

  const userToFollow = await User.findById(userIdToFollow);
  if (!userToFollow) {
    return next(new ApiError("User to follow not found", 404));
  }

  const followDoc = await Follower.findOneAndUpdate(
    { follower: currentUser._id, following: userToFollow._id },
    {
      $setOnInsert: {
        follower: currentUser._id,
        following: userToFollow._id,
      },
    },
    {
      new: true,
      upsert: true,
      lean: true,
    }
  );

  const alreadyFollowing =
    followDoc.createdAt && followDoc.createdAt < new Date(Date.now() - 1000);

  return res.status(201).json(
    new ApiResponse({
      data: { user: userToFollow },
      alreadyFollowing,
      message: alreadyFollowing ? "Already following" : "Followed successfully",
    })
  );
};
const unfollowUser = async (req, res, next) => {
  const userIdToUnfollow = req.params.targetUserId;
  const currentUserId = req.user.id;
  logger.debug(
    `Unfollow request target=${userIdToUnfollow} by=${currentUserId}`
  );
  const unfollowDoc = await Follower.findOneAndDelete(
    { follower: currentUserId, following: userIdToUnfollow },
    { lean: true }
  );
  if (!unfollowDoc) {
    return next(new ApiError("you already unfollowed this user", 400));
  }
  return res.status(200).json(
    new ApiResponse({
      data: { user: userIdToUnfollow },
      message: "Unfollowed successfully",
    })
  );
};
module.exports = { followUser, unfollowUser };
