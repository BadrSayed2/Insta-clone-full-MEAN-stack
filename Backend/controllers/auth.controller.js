const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/user.model");
const ApiError = require("../utils/api-error");
const { generateOTPToken, generateAccessToken, generateRefreshToken, verifyOTPToken } = require("../utils/jwt");
const {
  createOrUpdateDeviceSession,
  extractDeviceInfo,
  logoutDevice,
  logoutAllDevices,
  getUserActiveSessions,
  revokeSessionById
} = require("../utils/session-helper");
const { emailEvent } = require("../utils/email-event");
 const { refreshUserToken } = require("../utils/session-helper");
const generateCode = require("../utils/generate-code");
const { verifyRefreshToken  } = require("../utils/jwt");
const OTP = require("../models/OTP.model");
const ApiResponse = require("../utils/api-response");
const CryptoJS = require("crypto-js");
const { log } = require("console");

/**
 * User Signup
 */
const signup = async (req, res, next) => {

  try {
    // Check if user is already authenticated (handled by skipIfAuthenticated middleware)
    if (req.user) {
      return res.status(400).json({
        success: false,
        message: "You are already logged in"
      });
    }

    const {
      userName,
      fullName,
      email,
      password,
      phoneNumber,
      gender,
      bio,
      DOB,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phoneNumber }]
    });
    if (existingUser) {
      return next(new ApiError("User with this email or phone number already exists", 409));
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
    await OTP.create({ userId: user._id, code });
    emailEvent.emit("sendConfirmEmail", { email, code });

    const token = generateOTPToken(String(user.userName));

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 25 * 60 * 1000,
    };

    res.cookie("OTP_verification_token", token, cookieOptions);

    return res.status(201).json(
      new ApiResponse({
        message:
          "The account has been created successfully. Please check your email for verification.",
        status: "success",
      })
    );
  } catch (error) {
    console.log("Signup error:", error);
    return next(new ApiError("Registration failed", 500));
  }
}

/**
 * User Login
 */
const login = async (req, res, next) => {
  try {

    // Check if user is already authenticated (handled by skipIfAuthenticated middleware)
    if (req.user) {
      return res.status(200).json({
        success: true,
        message: "Already logged in",
        data: {
          user: {
            // id: req.user._id,
            userName: req.user.userName,
            fullName: req.user.fullName,
            email: req.user.email,
            profilePic: req.user.profile_pic.url,
            bio: req.user.bio,
            followCount: req.user.followCount,
            followingCount: req.user.followingCount,
            postsCount: req.user.postsCount,
          }
        }
      });
    }

    const { email, password } = req.body;

    // Find user by email or username
    const user = await User.findOne({
      $or: [
        { email: email.toLowerCase().trim() },
        { userName: email.toLowerCase().trim() }
      ]
    });


    if (!user) {
      return next(new ApiError("Invalid email/username or password", 401));
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(new ApiError("Invalid email/username or password", 401));
    }

    // Check if user is verified
    if (!user.isVerified) {
      // Generate new OTP code
      const otpCode = generateCode();

      // Update user with new OTP
      user.otpCode = otpCode;
      user.otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
      await user.save();

      // Generate new OTP token
      const otpToken = generateOTPToken(user._id);

      // Send OTP email
      emailEvent.emit("sendConfirmEmail", {
        email: user.email,
        code: otpCode
      });

      return res.status(403).json({
        success: false,
        message: "Please verify your email first. A new OTP has been sent.",
        data: {
          userId: user._id,
          email: user.email,
          otpToken, // Remove in production
          requiresVerification: true
        }
      });
    }

    // Set OTP_VERIFICATION_COOKIE token in cookie
    const code = generateCode();
    await OTP.create({ userId: user._id, code });
    emailEvent.emit("sendConfirmEmail", { email, code });

    const token = generateOTPToken(String(user.userName));

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 25 * 60 * 1000,
    };

    res.cookie("OTP_verification_token", token, cookieOptions);

    // Return user data
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: null,
    });

  } catch (error) {
    // console.error("Login error:", error);
    return next(new ApiError("Login failed", 500));
  }
};

/**
 * Verify OTP
 */
const verifyOtp = async (req, res, next) => {
  try {
    const { code } = req?.body;
    const  OTP_token  = req.cookies["OTP_verification_token"];
    
    if (!OTP_token) {
      return next(new ApiError("you need to login", 401));
    }

    const token = OTP_token;
    
    try {
      const payload = verifyOTPToken(token);
      
      console.log(payload);
      
      const user = await User.findOne({ userName: payload?.userName });
      
      if (!user) {
        return next(new ApiError("User not found", 404));
      }
      
      const otp = await OTP.findOne({ userId: user._id }).sort({ createdAt: -1 });
      
      console.log(otp);
      
      if(!otp) {
        return next(new ApiError("OTP not found. Please request a new one.", 404));
      }


      if (!user.isVerified) {
        user.isVerified = true;
        await user.save();
      }

      // Verify the actual OTP code
      if (!otp.code || otp.code !== code) {
        return next(new ApiError("Invalid OTP code", 400));
      }


      // Extract device and IP information
      const userAgent = req.headers['user-agent'];
      const clientIp = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for']?.split(',')[0];
      const deviceInfo = extractDeviceInfo(userAgent);

      // Create or update device session
      const { accessToken, sessionInfo } = await createOrUpdateDeviceSession(user, deviceInfo, clientIp);

      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: "Strict",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        // maxAge: 15 * 60 * 1000, // 15 minutes
      };

      const refresh = generateRefreshToken(user._id, sessionInfo._id);

      res.cookie("refreshToken", refresh, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.cookie("authentication", accessToken, cookieOptions);

      res.status(200).json({
        success: true,
        message: "Email verified successfully. You can now login.",
        data: null,
      });

    } catch (error) {
      return next(new ApiError("Invalid or expired OTP token", 401));
    }

  } catch (error) {
    console.error("OTP verification error:", error);
    return next(new ApiError("OTP verification failed", 500));
  }
};

/**
 * Resend OTP
 */
const resendOtp = async (req, res, next) => {
  try {
    const token = req.cookies["OTP_verification_token"];
    const payload = verifyOTPToken(token);
    console.log(payload);
    
    const user = await User.findOne({ userName: payload?.userName });
    
    if (!user) {
      return next(new ApiError("User not found", 404));
    }

    // Delete any existing OTPs for this user
    await OTP.deleteMany({ userId: user._id });

    // Generate and save new OTP
    const otpCode = generateCode();
    const otp = new OTP({
      userId: user._id,
      code: otpCode,
    });

    await otp.save();

    // Generate new OTP token
    const otpToken = generateOTPToken(user.userName);

    // Send OTP email
    emailEvent.emit("sendConfirmEmail", {
      email: user.email,
      code: otpCode
    });

    res.status(200).json({
      success: true,
      message: "New OTP sent to your email",
      data: {
        email: user.email,
        otpToken, // Remove in production
      }
    });

  } catch (error) {
    console.error("Resend OTP error:", error);
    return next(new ApiError("Failed to resend OTP", 500));
  }
};

/**
 * Refresh Token (Legacy support - mainly for API clients)
 */

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken: providedRefreshToken } = req.cookies["refreshToken"];

    if (!providedRefreshToken) {
      return next(new ApiError("you need to login", 401));
    }

    // Use legacy refresh method for API clients
    // const result = await refreshUserToken(providedRefreshToken);
    const payload = verifyRefreshToken(providedRefreshToken);
    const user = await User.findById(payload.userId);
    
    if (!user) {
      return next(new ApiError("you need to login", 401));
    }

    const { accessToken, sessionInfo } = await createOrUpdateDeviceSession(user, deviceInfo, clientIp);

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      // maxAge: 15 * 60 * 1000, // 15 minutes
    };
    res.cookie("authentication", accessToken, cookieOptions);

    res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      data: null
    });

  } catch (error) {
    console.error("Refresh token error:", error);
    return next(new ApiError("Token refresh failed", 401));
  }
};

/**
 * Logout current device
 */
const logout = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const userAgent = req.headers['user-agent'];
    const clientIp = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for']?.split(',')[0];
    const deviceInfo = extractDeviceInfo(userAgent);

    // Logout from current device
    const result = await logoutDevice(userId, deviceInfo, clientIp);

    // Clear authentication cookie
    res.clearCookie("authentication");

    if (result.success) {
      res.status(200).json({
        success: true,
        message: result.message
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message
      });
    }

  } catch (error) {
    console.error("Logout error:", error);
    return next(new ApiError("Logout failed", 500));
  }
};

/**
 * Logout all devices
 */
const logoutAllDevicesController = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const result = await logoutAllDevices(userId);

    // Clear authentication cookie
    res.clearCookie("authentication");

    if (result.success) {
      res.status(200).json({
        success: true,
        message: result.message
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message
      });
    }

  } catch (error) {
    console.error("Logout all devices error:", error);
    return next(new ApiError("Logout all devices failed", 500));
  }
};

/**
 * Get active sessions
 */
const getSessions = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const userAgent = req.headers['user-agent'];
    const clientIp = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for']?.split(',')[0];
    const currentDeviceInfo = extractDeviceInfo(userAgent);

    let sessions = await getUserActiveSessions(userId);

    // Mark current session
    sessions = sessions.map(session => ({
      ...session,
      isCurrent:
        session.ip === clientIp &&
        session.device.browserName === currentDeviceInfo.browserName &&
        session.device.deviceType === currentDeviceInfo.deviceType &&
        session.device.osName === currentDeviceInfo.osName
    }));

    res.status(200).json({
      success: true,
      message: "Active sessions retrieved successfully",
      data: {
        sessions,
        total: sessions.length
      }
    });

  } catch (error) {
    console.error("Get sessions error:", error);
    return next(new ApiError("Failed to retrieve sessions", 500));
  }
};

/**
 * Revoke specific session
 */
const revokeSession = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { sessionId } = req.params;

    const result = await revokeSessionById(userId, sessionId);

    res.status(200).json({
      success: true,
      message: result.message
    });

  } catch (error) {
    console.error("Revoke session error:", error);
    return next(new ApiError("Failed to revoke session", 500));
  }
};

/**
 * Forgot Password
 */
const forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      // Don't reveal if email exists for security
      return res.status(200).json({
        success: true,
        message: "If the email exists, a password reset link has been sent."
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set reset token and expiry
    user.passwordResetToken = resetTokenHash;
    user.passwordResetExpires = Date.now() + 15 * 60 * 1000; // 15 minutes

    await user.save();

    // Create reset URL
    const resetURL = `${req.protocol}://${req.get('host')}/reset-password?token=${resetToken}`;

    // Send reset email
    emailEvent.emit("sendResetPasswordEmail", {
      email: user.email,
      resetUrl: resetURL
    });

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
      // Remove in production:
      data: { resetToken }
    });

  } catch (error) {
    console.error("Forgot password error:", error);
    return next(new ApiError("Failed to process password reset request", 500));
  }
};

/**
 * Reset Password
 */
const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.query;
    const { newPassword } = req.body;

    if (!token) {
      return next(new ApiError("Reset token is required", 400));
    }

    // Hash the token to compare with stored hash
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      passwordResetToken: resetTokenHash,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return next(new ApiError("Invalid or expired reset token", 400));
    }

    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password and clear reset tokens
    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    // Revoke all sessions for security
    user.sessions = [];

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful. Please login with your new password."
    });

  } catch (error) {
    console.error("Reset password error:", error);
    return next(new ApiError("Password reset failed", 500));
  }
};

module.exports = {
  signup,
  login,
  verifyOtp,
  resendOtp,
  refreshToken,
  logout,
  logoutAllDevicesController,
  getSessions,
  revokeSession,
  forgetPassword,
  resetPassword,
};