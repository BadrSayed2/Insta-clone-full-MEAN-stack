const bcrypt = require("bcryptjs");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { emailEvent } = require("../utils/email.event.utils");
const ApiError = require("../utils/api-error");
const ApiResponse = require("../utils/api-response");
const crypto = require("crypto");
const logger = require("../utils/logger");
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

    const hashPassword = await bcrypt.hash(
      password,
      parseInt(process.env.SALT)
    );

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
      DOB,
    });

    emailEvent.emit("sendConfirmEmail", { email });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return res.status(201).json(
      new ApiResponse({
        message:
          "The account has been created successfully. Please check your email for verification.",
        status: "success",
        token,
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
    if (!user) {
      return next(new ApiError("in-valid login Data", 404));
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return next(new ApiError("in-valid login Data", 404));
    }
    if (!user.confirmEmail) {
      return next(
        new ApiError("Please confirm your email before proceeding", 403)
      );
    }
    user.phone = CryptoJS.AES.decrypt(
      user.phoneNumber,
      process.env.ENCRYPT
    ).toString(CryptoJS.enc.Utf8);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res
      .status(200)
      .json(
        new ApiResponse({ message: "Login successful", token, data: user })
      );
  } catch (err) {
    return next(err);
  }
};

const confirmEmail = async (req, res, next) => {
  try {
    const token = req.query.token;
    if (!token) {
      return next(new ApiError("Activation token missing in query", 400));
    }
    const secret =
      process.env.SECRET_KEY_ACTIVE || process.env.SCRIT_KEY_ACTIVE;
    const decoded = jwt.verify(token, secret);

    const user = await User.findOneAndUpdate(
      { email: decoded.email },
      { confirmEmail: true },
      { new: true }
    );

    if (!user) {
      return next(new ApiError("User not found", 404));
    }

    // If accessed via browser GET (HTML expectation), show a simple HTML confirmation page
    if (req.method === "GET") {
      return res
        .status(200)
        .send(
          `<html><body style="font-family:Arial; text-align:center; padding:40px"><h2>✅ Email Verified</h2><p>Your account is now activated.</p></body></html>`
        );
    }
    return res.status(200).json(new ApiResponse({ user }, "Account activated"));
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
module.exports = { signup, login, confirmEmail, forgetPassword, resetPassword };
