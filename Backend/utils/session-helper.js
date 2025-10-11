const { generateAccessToken, generateRefreshToken } = require("./jwt");
const UAParser = require("ua-parser-js");
const geoip = require("geoip-lite");
const User = require("../models/user.model");

// Extract device info from user agent string
function extractDeviceInfo(uaString) {
  const parser = new UAParser(uaString);
  const result = parser.getResult();
  
  return {
    browserName: result.browser.name || "Unknown",
    browserVersion: result.browser.version || "Unknown",
    deviceType: result.device.type || "desktop",
    deviceModel: result.device.model || null,
    osName: result.os.name || "Unknown",
    osVersion: result.os.version || "Unknown",
  };
}

// Get location info from IP
function getLocationFromIP(clientIp) {
  if (!clientIp || clientIp === '::1' || clientIp === '127.0.0.1' || 
      clientIp.startsWith('192.168.') || clientIp.startsWith('10.')) {
    return {
      country: "Local",
      city: "Local", 
      region: "Local",
      timezone: "Local",
    };
  }

  const geo = geoip.lookup(clientIp);
  
  if (!geo) {
    return {
      country: "Unknown",
      city: "Unknown",
      region: "Unknown", 
      timezone: "Unknown",
    };
  }

  return {
    country: geo.country || "Unknown",
    city: geo.city || "Unknown",
    region: geo.region || "Unknown",
    timezone: geo.timezone || "Unknown",
  };
}

// Check if device session already exists
function findExistingDeviceSession(sessions, deviceInfo, clientIp) {
  return sessions.findIndex(session => 
    session.ip === clientIp &&
    session.device.browserName === deviceInfo.browserName &&
    session.device.deviceType === deviceInfo.deviceType &&
    session.device.osName === deviceInfo.osName &&
    session.expires > new Date() // Only consider non-expired sessions
  );
}

/**
 * Create or update session for a device
 * This is called during login process
 * Only saves refresh token in DB, returns access token for cookie
 */
async function createOrUpdateDeviceSession(user, deviceInfo, clientIp) {
  try {
    const refreshToken = generateRefreshToken(user._id);
    const accessToken = generateAccessToken(user._id);
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    const location = getLocationFromIP(clientIp);

    // Initialize sessions array if it doesn't exist
    if (!user.sessions) {
      user.sessions = [];
    }

    // Find existing session for this device
    const existingSessionIndex = findExistingDeviceSession(user.sessions, deviceInfo, clientIp);

    if (existingSessionIndex !== -1) {
      // Update existing device session
      user.sessions[existingSessionIndex] = {
        ...user.sessions[existingSessionIndex],
        refreshToken,
        expires,
        location,
        lastUsedAt: new Date(),
      };
      
      console.log('Updated existing device session');
    } else {
      // Create new device session
      const newSession = {
        refreshToken,
        device: deviceInfo,
        ip: clientIp,
        location,
        expires,
        lastUsedAt: new Date(),
      };
      
      user.sessions.push(newSession);
      console.log('Created new device session');
    }

    // Clean up expired sessions
    const initialSessionCount = user.sessions.length;
    user.sessions = user.sessions.filter(session => session.expires > new Date());
    
    if (user.sessions.length < initialSessionCount) {
      console.log(`Cleaned up ${initialSessionCount - user.sessions.length} expired sessions`);
    }

    // Limit to maximum 10 active sessions per user (keep most recent)
    if (user.sessions.length > 10) {
      user.sessions.sort((a, b) => new Date(b.lastUsedAt) - new Date(a.lastUsedAt));
      user.sessions = user.sessions.slice(0, 10);
      console.log('Limited sessions to 10 most recent');
    }

    await user.save();

    return { 
      accessToken,
      sessionInfo: {
        device: deviceInfo,
        location,
        ip: clientIp
      }
    };
  } catch (error) {
    console.error('Error in createOrUpdateDeviceSession:', error);
    throw new Error('Failed to create device session');
  }
}

/**
 * Check if device has valid session
 * Used by authentication middleware
 */
async function checkDeviceSession(userId, deviceInfo, clientIp) {
  try {
    const user = await User.findById(userId).select('+sessions.refreshToken');

    if (!user || !user.sessions || user.sessions.length === 0) {
      return { valid: false, user: null };
    }

    // Find session that matches this device
    const deviceSession = user.sessions.find(session => 
      session.expires > new Date() && // Not expired
      session.ip === clientIp && // Same IP
      session.device.browserName === deviceInfo.browserName && // Same browser
      session.device.deviceType === deviceInfo.deviceType && // Same device type
      session.device.osName === deviceInfo.osName // Same OS
    );

    if (deviceSession) {
      // Update last used time
      deviceSession.lastUsedAt = new Date();
      await user.save();
      
      return { 
        valid: true, 
        user: await User.findById(userId).select('-password -sessions.refreshToken')
      };
    }

    return { valid: false, user: null };
  } catch (error) {
    console.error('Error checking device session:', error);
    return { valid: false, user: null };
  }
}

/**
 * Logout from specific device
 */
async function logoutDevice(userId, deviceInfo, clientIp) {
  try {
    const user = await User.findById(userId);
    
    if (!user || !user.sessions) {
      return { success: false, message: 'User or sessions not found' };
    }

    const initialSessionCount = user.sessions.length;
    
    // Remove session for this specific device
    user.sessions = user.sessions.filter(session => 
      !(session.ip === clientIp &&
        session.device.browserName === deviceInfo.browserName &&
        session.device.deviceType === deviceInfo.deviceType &&
        session.device.osName === deviceInfo.osName)
    );

    const removedSessions = initialSessionCount - user.sessions.length;
    
    if (removedSessions > 0) {
      await user.save();
      return { 
        success: true, 
        message: `Logged out from device (removed ${removedSessions} session(s))` 
      };
    } else {
      return { 
        success: false, 
        message: 'No active session found for this device' 
      };
    }
  } catch (error) {
    console.error('Error in logoutDevice:', error);
    return { success: false, message: 'Failed to logout device' };
  }
}

/**
 * Logout from all devices
 */
async function logoutAllDevices(userId) {
  try {
    const user = await User.findById(userId);
    
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    const sessionCount = user.sessions ? user.sessions.length : 0;
    user.sessions = [];
    await user.save();

    return { 
      success: true, 
      message: `Logged out from all devices (removed ${sessionCount} session(s))` 
    };
  } catch (error) {
    console.error('Error in logoutAllDevices:', error);
    return { success: false, message: 'Failed to logout all devices' };
  }
}

/**
 * Get active sessions for a user (for display in settings)
 */
async function getUserActiveSessions(userId) {
  try {
    const user = await User.findById(userId).select('sessions');
    
    if (!user) {
      throw new Error("User not found");
    }

    // Filter expired sessions and format for display
    const activeSessions = user.sessions
      .filter(session => session.expires > new Date())
      .map(session => ({
        id: session._id,
        device: {
          browserName: session.device.browserName,
          browserVersion: session.device.browserVersion,
          deviceType: session.device.deviceType,
          osName: session.device.osName,
          osVersion: session.device.osVersion,
        },
        location: session.location,
        ip: session.ip,
        lastUsedAt: session.lastUsedAt,
        expires: session.expires,
        // Add a "current" flag if this matches the current request
        isCurrent: false // This would be set by the calling function
      }))
      .sort((a, b) => new Date(b.lastUsedAt) - new Date(a.lastUsedAt)); // Most recent first

    return activeSessions;
  } catch (error) {
    console.error('Error getting user active sessions:', error);
    throw error;
  }
}

/**
 * Revoke a specific session by session ID
 */
async function revokeSessionById(userId, sessionId) {
  try {
    const result = await User.updateOne(
      { _id: userId },
      { $pull: { sessions: { _id: sessionId } } }
    );

    if (result.modifiedCount === 0) {
      throw new Error("Session not found or already revoked");
    }

    return { success: true, message: 'Session revoked successfully' };
  } catch (error) {
    console.error('Error revoking session:', error);
    throw error;
  }
}

/**
 * Clean expired sessions from all users
 * Should be run periodically
 */
async function cleanExpiredSessions() {
  try {
    const result = await User.updateMany(
      {},
      { 
        $pull: { 
          sessions: { 
            expires: { $lt: new Date() } 
          } 
        } 
      }
    );
    
    console.log(`Cleaned expired sessions for ${result.modifiedCount} users`);
    return result;
  } catch (error) {
    console.error('Error cleaning expired sessions:', error);
    throw error;
  }
}

/**
 * Get session statistics for admin/monitoring
 */
async function getSessionStats() {
  try {
    const stats = await User.aggregate([
      { $match: { sessions: { $exists: true, $ne: [] } } },
      { $unwind: "$sessions" },
      { $match: { "sessions.expires": { $gt: new Date() } } },
      { 
        $group: {
          _id: null,
          totalActiveSessions: { $sum: 1 },
          uniqueUsers: { $addToSet: "$_id" },
          avgSessionsPerUser: { $avg: { $size: "$sessions" } },
          deviceTypes: { $push: "$sessions.device.deviceType" },
          browsers: { $push: "$sessions.device.browserName" }
        }
      },
      {
        $project: {
          totalActiveSessions: 1,
          uniqueUsersCount: { $size: "$uniqueUsers" },
          avgSessionsPerUser: { $round: ["$avgSessionsPerUser", 2] },
          topDeviceTypes: { $slice: [{ $setUnion: "$deviceTypes" }, 10] },
          topBrowsers: { $slice: [{ $setUnion: "$browsers" }, 10] }
        }
      }
    ]);

    return stats[0] || {
      totalActiveSessions: 0,
      uniqueUsersCount: 0,
      avgSessionsPerUser: 0,
      topDeviceTypes: [],
      topBrowsers: []
    };
  } catch (error) {
    console.error('Error getting session stats:', error);
    throw error;
  }
}

// Schedule cleanup job to run every hour
function scheduleSessionCleanup() {
  setInterval(async () => {
    try {
      await cleanExpiredSessions();
    } catch (error) {
      console.error('Scheduled session cleanup failed:', error);
    }
  }, 60 * 60 * 1000); // 1 hour
  
  console.log('Session cleanup scheduled to run every hour');
}

module.exports = {
  extractDeviceInfo,
  getLocationFromIP,
  createOrUpdateDeviceSession,
  checkDeviceSession,
  logoutDevice,
  logoutAllDevices,
  getUserActiveSessions,
  revokeSessionById,
  cleanExpiredSessions,
  getSessionStats,
  scheduleSessionCleanup,
};