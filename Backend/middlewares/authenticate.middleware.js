const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");
const ApiError = require("../utils/api-error");
const fs = require("fs");
const authenticationPublicKey = fs.readFileSync(
  "./keys/auth/auth_public_key.pem",
  "utf-8"
);

const authenticate = async (req, res, next) => {
  try {
    const token = req?.cookies?.["authentication"];
    if (!token) return next(new ApiError("No token provided", 401));

    const user = jwt.verify(token, authenticationPublicKey, {
      algorithms: "RS256",
    });

    const foundUser = await UserModel.findById(user.user_id);
    if (!foundUser) {
      return next(new ApiError("you need to login", 401));
    }

    if (!foundUser.isVerified) {
      return next(new ApiError("Email not verified", 401));
    }

    req.user = { id: user.user_id };
    req.user_id = user.user_id;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authenticate;
