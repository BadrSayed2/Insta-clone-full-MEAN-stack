const jwt = require("jsonwebtoken");
const user_model = require("../models/user.model");
const ApiError = require("../utils/api-error");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return next(new ApiError("No token provided", 401));

    const token = authHeader.split(" ")[1];
    if (!token) return next(new ApiError("Invalid token format", 401));

    const user = jwt.verify(token, process.env.JWT_SECRET);

    const found_user = await user_model.findById(user.id);
    if (!found_user) {
      return next(new ApiError("User not found", 401));
    }

    if (!found_user.confirmEmail) {
      return next(
        new ApiError("Please confirm your email before proceeding", 403)
      );
    }

    req.user = { id: user.id };

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authenticate;
