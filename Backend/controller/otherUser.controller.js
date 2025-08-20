const User = require("../models/user.model");

const getOtherUserProfile = async (req, res) => { 
  try {
    const userid = req.params.id;
    const user = await User.findOne({ _id: userid }).select("userName fullName bio -_id");

    if (!user) {
      return res.status(404).json({  message: "User not found" });
    }
    return res.status(200).json({ user });
    
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getOtherUserProfile };

