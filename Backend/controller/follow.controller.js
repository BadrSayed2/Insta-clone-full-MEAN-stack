const OTP = require("../models/follower.model");
const User = require("../models/user.model");
const logger = require("../utils/logger");

const followUser = async (req, res) => {
  const { userIdToFollow } = req.body;
  const currentUserId = req.user.id;
  logger.debug(`Follow request target=${userIdToFollow} by=${currentUserId}`);

  if (currentUserId === userIdToFollow) {
    return res.status(400).json({ message: "You cannot follow yourself" });
  }

  const currentUser = await User.findById({ _id: currentUserId });
  if (!currentUser) {
    return res.status(404).json({ message: "Current user not found" });
  }

  const userToFollow = await User.findById({ _id: userIdToFollow });
  if (!userToFollow) {
    return res.status(404).json({ message: "User to follow not found" });
  }

  const follow = await OTP.create({
    user: currentUser._id,
    followed: userToFollow._id,
  });

  return res.status(201).json({ message: "Followed successfully", follow });
};

module.exports = { followUser };
