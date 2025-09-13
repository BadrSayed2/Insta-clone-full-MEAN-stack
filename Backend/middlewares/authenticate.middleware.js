const { verifyAccessToken, generateAccessToken } = require("../utils/jwt");
const { extractDeviceInfo } = require("../utils/session-helper");
const User = require("../models/user.model");
const ApiError = require("../utils/api-error");

/**
 * Enhanced authentication middleware that handles device-specific sessions
 * Flow:
 * 1. Check if device has access token in cookies
 * 2. If valid access token -> set req.user and continue
 * 3. If no/invalid access token -> check for valid refresh token for THIS device
 * 4. If valid device session found -> generate new access token
 * 5. If no valid tokens/sessions -> continue without req.user (requires login)
 */
const authenticated = async (req, res, next) => {
  try {
    const { authentication: accessToken } = req.cookies;
    const userAgent = req.headers['user-agent'];
    const clientIp = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for']?.split(',')[0];
    
    // Extract device info for session matching
    const deviceInfo = extractDeviceInfo(userAgent);

    // Step 1: Check if device has access token
    if (!accessToken) {
      console.log('No access token found in cookies');
      return next(); // No access token, user needs to login
    }

    // Step 2: Try to verify access token
    try {
      const payload = verifyAccessToken(accessToken);
      const user = await User.findById(payload.userId).select('-password -sessions.refreshToken');
      
      if (user) {
        req.user = user;
        console.log('Access token valid, user authenticated');
        return next();
      }
    } catch (error) {
      console.log('Access token invalid/expired, checking device session');
      
      // Step 3: Access token invalid, check for device-specific refresh token
      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.decode(accessToken); // Decode without verification to get userId
        
        if (decoded && decoded.userId) {
          // Find user and check for valid session for THIS device
          const user = await User.findById(decoded.userId).select('+sessions.refreshToken');
          
          if (user && user.sessions && user.sessions.length > 0) {
            // Find session that matches this device
            const deviceSession = user.sessions.find(session => 
              session.expires > new Date() && // Not expired
              session.ip === clientIp && // Same IP
              session.device.browserName === deviceInfo.browserName && // Same browser
              session.device.deviceType === deviceInfo.deviceType && // Same device type
              session.device.osName === deviceInfo.osName // Same OS
            );

            if (deviceSession) {
              console.log('Valid device session found, generating new access token');
              
              // Step 4: Generate new access token for this device
              const newAccessToken = generateAccessToken(user._id);
              
              // Update session last used time
              deviceSession.lastUsedAt = new Date();
              await user.save();
              
              // Set new access token in cookie
              const cookieOptions = {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: "Strict",
                maxAge: 24 * 60 * 60 * 1000, // 1 day
              };

              res.cookie("authentication", newAccessToken, cookieOptions);

              // Get user without sensitive data
              const authenticatedUser = await User.findById(decoded.userId).select('-password -sessions.refreshToken');
              if (authenticatedUser) {
                req.user = authenticatedUser;
                console.log('Device session refreshed, user authenticated');
                return next();
              }
            } else {
              console.log('No valid session found for this device');
            }
          }
        }
      } catch (decodeError) {
        console.log('Failed to decode expired token:', decodeError.message);
      }
    }

    // Step 5: No valid authentication found for this device
    console.log('No valid authentication found, clearing invalid cookie');
    res.clearCookie("authentication");
    return next();
  } catch (error) {
    console.error('Authentication middleware error:', error);
    return next();
  }
};

/**
 * Require authentication middleware - same logic but returns error if not authenticated
 */
const requireAuth = async (req, res, next) => {
  try {
    const { authentication: accessToken } = req.cookies;
    const userAgent = req.headers['user-agent'];
    const clientIp = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for']?.split(',')[0];
    
    // Extract device info for session matching
    const deviceInfo = extractDeviceInfo(userAgent);

    if (!accessToken) {
      return next(new ApiError("Authentication required", 401));
    }

    // Try access token first
    try {
      const payload = verifyAccessToken(accessToken);
      const user = await User.findById(payload.userId).select('-password -sessions.refreshToken');
      
      if (user) {
        req.user = user;
        return next();
      }
    } catch (error) {
      // Access token invalid, try device session
      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.decode(accessToken);
        
        if (decoded && decoded.userId) {
          const user = await User.findById(decoded.userId).select('+sessions.refreshToken');
          
          if (user && user.sessions && user.sessions.length > 0) {
            // Find matching device session
            const deviceSession = user.sessions.find(session => 
              session.expires > new Date() &&
              session.ip === clientIp &&
              session.device.browserName === deviceInfo.browserName &&
              session.device.deviceType === deviceInfo.deviceType &&
              session.device.osName === deviceInfo.osName
            );

            if (deviceSession) {
              // Generate new access token
              const newAccessToken = generateAccessToken(user._id);
              
              // Update session
              deviceSession.lastUsedAt = new Date();
              await user.save();
              
              // Set new access token
              const cookieOptions = {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: "Strict",
                maxAge: 24 * 60 * 60 * 1000,
              };

              res.cookie("authentication", newAccessToken, cookieOptions);

              const authenticatedUser = await User.findById(decoded.userId).select('-password -sessions.refreshToken');
              if (authenticatedUser) {
                req.user = authenticatedUser;
                return next();
              }
            }
          }
        }
      } catch (decodeError) {
        console.log('Failed to refresh token for device:', decodeError.message);
      }
    }

    // Clear invalid cookie and return error
    res.clearCookie("authentication");
    return next(new ApiError("Invalid or expired authentication", 401));
  } catch (error) {
    console.error('RequireAuth middleware error:', error);
    return next(new ApiError("Authentication error", 500));
  }
};

/**
 * Skip if authenticated middleware - used on login/signup routes
 * If user is already authenticated, return user data instead of proceeding to login
 */
const skipIfAuthenticated = async (req, res, next) => {
  try {
    const { authentication: accessToken } = req.cookies;
    const userAgent = req.headers['user-agent'];
    const clientIp = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for']?.split(',')[0];
    
    if (!accessToken) {
      return next(); // No token, proceed to login/signup
    }

    const deviceInfo = extractDeviceInfo(userAgent);

    // Check access token
    try {
      const payload = verifyAccessToken(accessToken);
      const user = await User.findById(payload.userId).select('-password -sessions.refreshToken');
      
      if (user) {
        return res.status(200).json({
          message: "Already authenticated",
          success: true,
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
            }
          }
        });
      }
    } catch (error) {
      // Try device session refresh
      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.decode(accessToken);
        
        if (decoded && decoded.userId) {
          const user = await User.findById(decoded.userId).select('+sessions.refreshToken');
          
          if (user && user.sessions && user.sessions.length > 0) {
            const deviceSession = user.sessions.find(session => 
              session.expires > new Date() &&
              session.ip === clientIp &&
              session.device.browserName === deviceInfo.browserName &&
              session.device.deviceType === deviceInfo.deviceType &&
              session.device.osName === deviceInfo.osName
            );

            if (deviceSession) {
              const newAccessToken = generateAccessToken(user._id);
              
              deviceSession.lastUsedAt = new Date();
              await user.save();
              
              const cookieOptions = {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: "Strict",
                maxAge: 24 * 60 * 60 * 1000,
              };

              res.cookie("authentication", newAccessToken, cookieOptions);

              const authenticatedUser = await User.findById(decoded.userId).select('-password -sessions.refreshToken');
              if (authenticatedUser) {
                return res.status(200).json({
                  message: "Already authenticated",
                  success: true,
                  data: {
                    user: {
                      id: authenticatedUser._id,
                      userName: authenticatedUser.userName,
                      fullName: authenticatedUser.fullName,
                      email: authenticatedUser.email,
                      profilePic: authenticatedUser.profile_pic.url,
                      bio: authenticatedUser.bio,
                      followCount: authenticatedUser.followCount,
                      followingCount: authenticatedUser.followingCount,
                      postsCount: authenticatedUser.postsCount,
                    }
                  }
                });
              }
            }
          }
        }
      } catch (decodeError) {
        // Clear invalid cookie and proceed to login
        res.clearCookie("authentication");
      }
    }

    // No valid authentication found, proceed to login/signup
    return next();
  } catch (error) {
    console.error('SkipIfAuthenticated middleware error:', error);
    res.clearCookie("authentication");
    return next();
  }
};

module.exports = {
  authenticated,
  requireAuth,
  skipIfAuthenticated,
};