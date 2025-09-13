const express = require("express");
const {
  signup,
  login,
  refreshToken,
  logout,
  logoutAllDevicesController,
  getSessions,
  revokeSession,
  forgetPassword,
  resetPassword,
  verifyOtp,
  resendOtp,
} = require("../controllers/auth.controller.js");

// Import the new middleware (you'll need to update the path based on your structure)
const {
  authenticated,
  requireAuth,
  skipIfAuthenticated,
} = require("../middlewares/authenticate.middleware.js");

// Optional: Import validation middleware if you want to use them
const {
  validateSignup,
  validateLogin,
  validateForgetPassword,
  validateResetPassword,
  validateOTP,
  loginRateLimit,
  signupRateLimit,
  otpRateLimit,
  forgotPasswordRateLimit,
} = require("../middlewares/validation-middleware.js");

const router = express.Router();

// Check authentication status (keeping your original route name)
router.get("/check", authenticated, (req, res) => {
  if (req.user) {
    return res.status(200).json({
      success: true,
      message: "you are authenticated",
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
  } else {
    return res.status(401).json({
      success: false,
      message: "Not authenticated"
    });
  }
});

// Public routes (no authentication required)
router.post('/signup', validateSignup, signupRateLimit, skipIfAuthenticated, signup);
router.post("/login", loginRateLimit, validateLogin, skipIfAuthenticated, login);
router.post('/verify-otp', validateOTP, otpRateLimit, verifyOtp);
router.post('/resend-otp', validateOTP, otpRateLimit, resendOtp);
router.post("/forget-password", forgotPasswordRateLimit, validateForgetPassword, forgetPassword);
router.post("/reset-password", validateResetPassword, resetPassword);

// Token management routes
router.post("/refresh-token", refreshToken);

// Protected routes (authentication required)
router.post("/logout", requireAuth, logout);
router.post("/logout-all", requireAuth, logoutAllDevicesController);

// Session management routes
router.get("/sessions", requireAuth, getSessions);
router.delete("/sessions/:sessionId", requireAuth, revokeSession);

// Additional route (same as /check but different endpoint name for consistency)
router.get("/me", authenticated, (req, res) => {
  if (req.user) {
    return res.status(200).json({
      success: true,
      message: "User authenticated",
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
  } else {
    return res.status(401).json({
      success: false,
      message: "Not authenticated"
    });
  }
});

module.exports = router;