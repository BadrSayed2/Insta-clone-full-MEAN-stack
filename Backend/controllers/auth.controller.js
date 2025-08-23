const fs = require('fs')
const bcrypt = require("bcryptjs");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const { emailEvent } = require("../utils/email.event.utils");
const ApiError = require("../utils/api-error");
const ApiResponse = require("../utils/api-response");
const crypto = require("crypto");
const logger = require("../utils/logger");
const generateCode = require("../utils/generate_code.util");

const User = require("../models/user.model");
const OTP = require('../models/OTP.model')

const OTP_private_key = fs.readFileSync(
  "./keys/OTP/OTP_private_key.pem",
  "utf-8"
);

const signup = async (req, res, next) => {
  try {
    const {
      userName,
      fullName,
      email,
      password,
      confirmationPassword,
      phoneNumber,
      gender,
      bio,
      DOB,
    } = req.body;

    if (password !== confirmationPassword) {
      return next(
        new ApiError("The password and its confirmation do not match", 400)
      );
    }

    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return next(new ApiError("This email is already registered", 409));
    }

    const hashPassword = await bcrypt.hash(password);

    const encryptedPhone = CryptoJS.AES.encrypt(
      phoneNumber,
      process.env.ENCRYPT
    ).toString();

    const user = await User.create({
      userName,
      fullName,
      email,
      password: hashPassword,
      phoneNumber: encryptedPhone,
      gender,
      bio,
      date_of_birth: DOB,
    });
    const code = generateCode();
    await OTP.create({user_id : user._id , code})
    emailEvent.emit("sendConfirmEmail", { email, code });

    const token = jwt.sign({ phoneNumber, code }, OTP_private_key, {
      expiresIn: "5m",
    });
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 5 * 60 * 1000,
    };

    res.cookie("OTP_verification_token", token, cookieOptions);

    return res.status(201).json(
      new ApiResponse({
        message:
          "The account has been created successfully. Please check your email for verification.",
        status: "success",
      })
    );
  } catch (err) {
    return next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.isVerified) {
      return next(new ApiError("in-valid login Data", 400));
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return next(new ApiError("in-valid login Data", 400));
    }

    const code = generateCode();
    await OTP.create({user_id : user._id , code})
    emailEvent.emit("sendConfirmEmail", { email, code });

    const token = jwt.sign({ phoneNumber, code }, OTP_private_key, {
      expiresIn: "5m",
    });
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 5 * 60 * 1000,
    };

    res.cookie("OTP_verification_token", token, cookieOptions);

    return res
      .status(200)
      .json(
        new ApiResponse({ message: "please check your email", success: true })
      );
  } catch (err) {
    return next(err);
  }
};


const forgetPassword = async (req, res, next) => {
  const email = req.body.email;
  const user = await User.findOne({ email });
  if (!user)
    return next(
      new ApiError("if Email exists activation link will be sent", 404)
    );
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save();
  const resetUrl = `${process.env.API_BASE_URL}/auth/reset-password?token=${resetToken}`;
  logger.info(`Password reset URL: ${resetUrl}`);
  //send email
  emailEvent.emit("sendResetPasswordEmail", { email, resetUrl });
  res.status(200).json(
    new ApiResponse({
      message: "if Email exists activation link will be sent",
      url: resetUrl,
    })
  );
};

const resetPassword = async (req, res, next) => {
  const { token } = req.query;
  const { newPassword } = req.body;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiError("Link is invalid or has expired", 400));
  }

  user.password = await bcrypt.hash(newPassword, parseInt(process.env.SALT));
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  res
    .status(200)
    .json(new ApiResponse({ message: "Password reset successful" }));
};

module.exports = { signup, login,  forgetPassword, resetPassword };
