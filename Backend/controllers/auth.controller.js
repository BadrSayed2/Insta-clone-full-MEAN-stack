const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/user.model");
const ApiError = require("../utils/api-error");
const { generateOTPToken, generateAccessToken } = require("../utils/jwt");
const { 
  createOrUpdateDeviceSession, 
  extractDeviceInfo, 
  logoutDevice, 
  logoutAllDevices,
  getUserActiveSessions,
  revokeSessionById 
} = require("../utils/session-helper");
const { emailEvent } = require("../utils/email.events");
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
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      gender,
      DOB
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phoneNumber }]
    });

    if (existingUser) {
      return next(new ApiError("User with this email or phone number already exists", 409));
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create username from first and last name
    const baseUsername = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`;
    let userName = baseUsername;
    let counter = 1;

    // Ensure unique username
    while (await User.findOne({ userName })) {
      userName = `${baseUsername}.${counter}`;
      counter++;
    }

    // Create user
    const newUser = new User({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      fullName: `${firstName.trim()} ${lastName.trim()}`,
      userName,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      phoneNumber,
      gender: gender.toLowerCase(),
      date_of_birth: new Date(DOB),
    });

    await newUser.save();

    // Generate OTP token for verification
    const otpToken = generateOTPToken(newUser._id);

    // TODO: Send OTP to user's email
    // await sendOTPEmail(newUser.email, otpCode);

    res.status(201).json({
      success: true,
      message: "User registered successfully. Please verify your email with the OTP sent.",
      data: {
        userId: newUser._id,
        email: newUser.email,
        otpToken, // In production, don't send this - it's just for testing
      }
    });

  } catch (error) {
    console.error("Signup error:", error);
    return next(new ApiError("Registration failed", 500));
  }
};

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
            id: req.user._id,
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
      // Generate new OTP token
      const otpToken = generateOTPToken(user._id);
      
      // TODO: Send OTP to user's email
      // await sendOTPEmail(user.email, otpCode);

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

    // Extract device and IP information
    const userAgent = req.headers['user-agent'];
    const clientIp = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for']?.split(',')[0];
    const deviceInfo = extractDeviceInfo(userAgent);

    // Create or update device session
    const { accessToken, sessionInfo } = await createOrUpdateDeviceSession(user, deviceInfo, clientIp);

    // Set access token in cookie
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    };

    res.cookie("authentication", accessToken, cookieOptions);

    // Return user data
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          userName: user.userName,
          fullName: user.fullName,
          email: user.email,
          profilePic: user.profile_pic.url,
          bio: user.bio,
          followCount: user.followCount,
          followingCount: user.followingCount,
          postsCount: user.postsCount,
        },
        sessionInfo: {
          device: sessionInfo.device.deviceType,
          location: `${sessionInfo.location.city}, ${sessionInfo.location.country}`
        }
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    return next(new ApiError("Login failed", 500));
  }
};

/**
 * Verify OTP
 */
const verifyOtp = async (req, res, next) => {
  try {
    const { code } = req.body;
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      return next(new ApiError("OTP token required", 401));
    }

    const otpToken = authorization.split(' ')[1];

    try {
      const { verifyOTPToken } = require("../utils/jwt");
      const payload = verifyOTPToken(otpToken);

      const user = await User.findById(payload.userId);
      if (!user) {
        return next(new ApiError("User not found", 404));
      }

      if (user.isVerified) {
        return next(new ApiError("User already verified", 400));
      }

      // TODO: Verify the actual OTP code here
      // This is where you'd check the code against what was sent via email
      // For now, accepting any 8-digit code

      // Mark user as verified
      user.isVerified = true;
      await user.save();

      res.status(200).json({
        success: true,
        message: "Email verified successfully. You can now login.",
        data: {
          userId: user._id,
          email: user.email,
          isVerified: true
        }
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
 * Refresh Token (Legacy support - mainly for API clients)
 */
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken: providedRefreshToken } = req.body;

    if (!providedRefreshToken) {
      return next(new ApiError("Refresh token required", 401));
    }

    // Use legacy refresh method for API clients
    const { refreshUserToken } = require("../utils/session-helper");
    const result = await refreshUserToken(providedRefreshToken);

    res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      data: {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken
      }
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
const logoutAllDevicesController  = async (req, res, next) => {
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

    // TODO: Send reset email
    // const resetURL = `${req.protocol}://${req.get('host')}/reset-password?token=${resetToken}`;
    // await sendPasswordResetEmail(user.email, resetURL);

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
  refreshToken,
  logout,
  logoutAllDevicesController,
  getSessions,
  revokeSession,
  forgetPassword,
  resetPassword,
};