const ApiError = require('../utils/api-error');
const validator = require('validator');

// Signup validation
const validateSignup = (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    gender,
    DOB,
  } = req.body;

  const errors = [];

  // First name validation
  if (!firstName || firstName.trim().length < 2) {
    errors.push('First name must be at least 2 characters long');
  }

  // Last name validation
  if (!lastName || lastName.trim().length < 2) {
    errors.push('Last name must be at least 2 characters long');
  }

  // Email validation
  if (!email || !validator.isEmail(email)) {
    errors.push('Please provide a valid email address');
  }

  // Password validation
  if (!password || password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  // Phone number validation
  if (!phoneNumber || !validator.isMobilePhone(phoneNumber)) {
    errors.push('Please provide a valid phone number');
  }

  // Gender validation
  if (!gender || !['male', 'female'].includes(gender.toLowerCase())) {
    errors.push('Gender must be either male or female');
  }

  // Date of birth validation
  if (!DOB || !validator.isDate(DOB)) {
    errors.push('Please provide a valid date of birth');
  } else {
    const birthDate = new Date(DOB);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    
    if (age < 13) {
      errors.push('You must be at least 13 years old to register');
    }
    
    if (birthDate > today) {
      errors.push('Date of birth cannot be in the future');
    }
  }

  if (errors.length > 0) {
    return next(new ApiError(errors.join(', '), 400));
  }

  next();
};

// Login validation
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  // Email validation
  if (!email || email.trim().length === 0) {
    errors.push('Email or username is required');
  }

  // Password validation
  if (!password || password.trim().length === 0) {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    return next(new ApiError(errors.join(', '), 400));
  }

  next();
};

// Forget password validation
const validateForgetPassword = (req, res, next) => {
  const { email } = req.body;

  if (!email || !validator.isEmail(email)) {
    return next(new ApiError('Please provide a valid email address', 400));
  }

  next();
};

// Reset password validation
const validateResetPassword = (req, res, next) => {
  const { token } = req.query;
  const { newPassword } = req.body;
  const errors = [];

  // Token validation
  if (!token || token.trim().length === 0) {
    errors.push('Reset token is required');
  }

  // Password validation
  if (!newPassword || newPassword.length < 8) {
    errors.push('New password must be at least 8 characters long');
  }

  // Password strength validation (optional but recommended)
  if (newPassword && !validator.isStrongPassword(newPassword, {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 0
  })) {
    errors.push('Password must contain at least one uppercase letter, one lowercase letter, and one number');
  }

  if (errors.length > 0) {
    return next(new ApiError(errors.join(', '), 400));
  }

  next();
};

// OTP validation
const validateOTP = (req, res, next) => {
  // const { code } = req.body;
  // const errors = [];

  // if (!code) {
  //   errors.push('OTP code is required');
  // } else if (typeof code !== 'string' || code.trim().length !== 8) {
  //   errors.push('OTP code must be exactly 8 characters long');
  // } else if (!/^\d{8}$/.test(code.trim())) {
  //   errors.push('OTP code must contain only numbers');
  // }

  // if (errors.length > 0) {
  //   return next(new ApiError(errors.join(', '), 400));
  // }

  next();
};

// Session ID validation for revoking sessions
const validateSessionId = (req, res, next) => {
  const { sessionId } = req.params;

  if (!sessionId || !validator.isMongoId(sessionId)) {
    return next(new ApiError('Please provide a valid session ID', 400));
  }

  next();
};

// Generic validation helper
const sanitizeInput = (str) => {
  if (typeof str !== 'string') return str;
  return validator.escape(str.trim());
};

// Middleware to sanitize all string inputs
const sanitizeInputs = (req, res, next) => {
  const sanitizeObject = (obj) => {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = sanitizeInput(obj[key]);
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitizeObject(obj[key]);
      }
    }
  };

  if (req.body && typeof req.body === 'object') {
    sanitizeObject(req.body);
  }

  next();
};

// Rate limiting helper (you might want to use express-rate-limit instead)
const createRateLimiter = (windowMs, max, message) => {
  const attempts = new Map();
  
  return (req, res, next) => {
    const key = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Clean old attempts
    const userAttempts = attempts.get(key) || [];
    const recentAttempts = userAttempts.filter(timestamp => timestamp > windowStart);
    
    if (recentAttempts.length >= max) {
      return next(new ApiError(message, 429));
    }
    
    recentAttempts.push(now);
    attempts.set(key, recentAttempts);
    
    next();
  };
};

// Rate limiters for different endpoints
const loginRateLimit = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  5, // 5 attempts
  'Too many login attempts, please try again later'
);

const signupRateLimit = createRateLimiter(
  60 * 60 * 1000, // 1 hour
  3, // 3 attempts
  'Too many signup attempts, please try again later'
);

const otpRateLimit = createRateLimiter(
  5 * 60 * 1000, // 5 minutes
  3, // 3 attempts
  'Too many OTP verification attempts, please try again later'
);

const forgotPasswordRateLimit = createRateLimiter(
  60 * 60 * 1000, // 1 hour
  3, // 3 attempts
  'Too many password reset requests, please try again later'
);

module.exports = {
  validateSignup,
  validateLogin,
  validateForgetPassword,
  validateResetPassword,
  validateOTP,
  validateSessionId,
  sanitizeInputs,
  loginRateLimit,
  signupRateLimit,
  otpRateLimit,
  forgotPasswordRateLimit,
};