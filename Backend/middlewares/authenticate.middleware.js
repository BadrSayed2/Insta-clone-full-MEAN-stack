const jwt = require("jsonwebtoken");
const user_model = require("../models/user.model");
const ApiError = require("../utils/api-error");
const fs = require('fs')
const authentication_public_key = fs.readFileSync(
  "./keys/auth/auth_public_key.pem",
  "utf-8"
);

const authenticate = async (req, res, next) => {
  try {
    const token = req?.cookies?.["authentication"]
    if (!token) return next(new ApiError("No token provided", 401));

    const user = jwt.verify(token, authentication_public_key, { algorithms: "RS256" });
    // console.log(user);
    
    const found_user = await user_model.findById(user.user_id);
    if (!found_user) {
      return next(new ApiError("you need to login", 401));
    }
    
    if (!found_user.isVerified) {
      return next(
        new ApiError("you need to login", 401)
      );
    }

    req.user = { id: user.user_id };
    req.user_id = user.user_id
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authenticate;
