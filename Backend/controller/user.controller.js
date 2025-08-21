const User = require("../models/user.model");
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

module.exports = { getOtherUserProfile };
