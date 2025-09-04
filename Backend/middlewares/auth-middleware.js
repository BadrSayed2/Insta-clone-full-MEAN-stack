const UserModel = require("../models/user.model");
const ApiError = require("../utils/api-error");
const { verifyAccessToken } = require("../utils/jwt");

const authenticate = async (req, res, next) => {
  try {
    const token = req?.cookies?.["authentication"];
    if (!token) return next(new ApiError("No token provided", 401));

    const payload = verifyAccessToken(token);
    const foundUser = await UserModel.findById(payload.userId);
    if (!foundUser) {
      return next(new ApiError("you need to login", 401));
    }

    if (!foundUser.isVerified) {
      return next(new ApiError("Email not verified", 401));
    }

    req.user = { id: payload.userId }; // Attach user ID to request
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authenticate;
