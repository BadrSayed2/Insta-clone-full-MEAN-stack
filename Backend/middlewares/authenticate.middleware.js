<<<<<<< HEAD
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
=======
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const fs = require('fs')
const user_model = require('../models/user.model')

dotenv.config()
const auth_public_key = fs.readFileSync('./keys/auth/auth_public_key.pem', 'utf-8')
const auth_private_key = fs.readFileSync('./keys/auth/auth_private_key.pem', 'utf-8')

const authenticate = (req, res, next) => {
    const token = req?.cookies['authentication']
    if (!token) {
        return res.status(401).json({ err: "you need to login" })
    }
    const user = jwt.verify(token, auth_public_key, { algorithms: "RS256" })
    // const found_user = user_model.findById(user.userId)
    let found_user;
    if(user?.user_id){
        found_user = user_model.findById(user?.user_id)
    }else{
        return res.status(401).json({ err: "you need to login" })
    }

    if (!found_user) {
        return res.status(401).json({ err: "you need to login" })
    }
    req.user_id = user.user_id
    next()
}

module.exports = authenticate
>>>>>>> badr
