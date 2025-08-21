const OTP = require('../models/follower.model');
const User = require('../models/user.model');

const followUser = async (req, res) => {
  try {
    const { userIdToFollow } = req.body;
    const currentUserId = req.user.id;
      console.log(userIdToFollow);
      console.log(currentUserId);
      
    if (currentUserId === userIdToFollow) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const currentUser = await User.findById({_id:currentUserId});
    if (!currentUser) {
      return res.status(404).json({ message: "Current user not found" });
    }

    const userToFollow = await User.findById({_id:userIdToFollow});
    if (!userToFollow) {
      return res.status(404).json({ message: "User to follow not found" });
    }

    const follow = await OTP.create({
      user: currentUser._id,
      followed: userToFollow._id
    });

    return res.status(201).json({ message: "Followed successfully", follow });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "You are already following this user" });
    }
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

module.exports = { followUser };
