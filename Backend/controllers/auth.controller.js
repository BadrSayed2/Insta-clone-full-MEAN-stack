const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const { emailEvent } = require("../utils/email-event");
const ApiError = require("../utils/api-error");
const ApiResponse = require("../utils/api-response");
const crypto = require("crypto");
const logger = require("../utils/logger");
const generateCode = require("../utils/generate-code");

const User = require("../models/user.model");
const OTP = require("../models/OTP.model");

const otpPrivateKey = fs.readFileSync(
  "./keys/OTP/OTP_private_key.pem",
  "utf-8"
);
const authPrivateKey = fs.readFileSync(
  path.join(__dirname, "../keys/auth/auth_private_key.pem"),
  "utf-8"
);

const refreshPrivateKey = fs.readFileSync(
  path.join(__dirname, "../keys/refresh/refresh_private_key.pem"),
  "utf-8"
);

const otpPublicKey = fs.readFileSync(
  path.join(__dirname, "../keys/OTP/OTP_public_key.pem"),
  "utf-8"
);

const signup = async (req, res, next) => {
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

  const hashPassword = await bcrypt.hash(password, parseInt(process.env.SALT));

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
  await OTP.create({ user_id: user._id, code });
  emailEvent.emit("sendConfirmEmail", { email, code });

  const token = jwt.sign({ _id: user._id }, otpPrivateKey, {
    expiresIn: "15m",
    algorithm: "RS256",
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
};

const login = async (req, res, next) => {
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
  await OTP.create({ user_id: user._id, code });

  emailEvent.emit("sendConfirmEmail", { email, code });

  const token = jwt.sign({ _id: user._id, code }, otpPrivateKey, {
    expiresIn: "15m",
    algorithm: "RS256",
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
const verifyOtp = async (req, res, next) => {
  const token = req?.cookies?.["OTP_verification_token"]; // contains user id
  const code = String(req?.body?.code ?? "").trim();
  if (!token) {
    return next(new ApiError("you need to login", 401));
  }
  if (!code || code.length !== 8) {
    return next(new ApiError("Invalid or missing OTP code", 400));
  }

  const payload = jwt.verify(token, otpPublicKey, {
    algorithms: ["RS256"],
  });

  const user = await User.findById(payload._id);
  if (!user) {
    return next(new ApiError("you need to login", 401));
  }

  const otpDoc = await OTP.findOne({ user_id: user._id, code });
  if (otpDoc) {
    if (!user?.isVerified) {
      user.isVerified = true;
      await user.save();
    }

    // Remove used OTPs (cleanup)
    await OTP.deleteMany({ user_id: user._id });

    const refreshToken = jwt.sign({ user_id: user._id }, refreshPrivateKey, {
      algorithm: "RS256",
      expiresIn: "10d",
    });

    const accessToken = jwt.sign({ user_id: user._id }, authPrivateKey, {
      algorithm: "RS256",
      expiresIn: "15m",
    });

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000,
    };

    res.cookie("authentication", accessToken, cookieOptions);
    res.cookie("refresh", refreshToken, {
      ...cookieOptions,
      maxAge: 10 * 24 * 60 * 60 * 1000,
    });

    res.clearCookie("OTP_verification_token");
    return res
      .status(200)
      .json(new ApiResponse({ message: "you are verified" }));
  } else {
    return next(new ApiError("Invalid or expired OTP code", 400));
  }
};

module.exports = { signup, login, forgetPassword, resetPassword, verifyOtp };
