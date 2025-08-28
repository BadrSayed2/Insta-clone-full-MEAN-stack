const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const otpPublicKey = fs.readFileSync(
  path.join(__dirname, "../keys/OTP/OTP_public_key.pem"),
  "utf-8"
);
const otpPrivateKey = fs.readFileSync(
  "./keys/OTP/OTP_private_key.pem",
  "utf-8"
);
const authPrivateKey = fs.readFileSync(
  path.join(__dirname, "../keys/auth/auth_private_key.pem"),
  "utf-8"
);
const authPublicKey = fs.readFileSync(
  path.join(__dirname, "../keys/auth/auth_public_key.pem"),
  "utf-8"
);

const refreshPrivateKey = fs.readFileSync(
  path.join(__dirname, "../keys/refresh/refresh_private_key.pem"),
  "utf-8"
);
const generateOTPToken = (userId) => {
  const otpToken = jwt.sign({ userId }, otpPrivateKey, {
    expiresIn: "5m",
    algorithm: "RS256",
  });
  return otpToken;
};
const generateAccessToken = (userId) => {
  const accessToken = jwt.sign({ userId }, authPrivateKey, {
    expiresIn: "1d",
    algorithm: "RS256",
  });
  return accessToken;
};
const generateRefreshToken = (userId) => {
  const refreshToken = jwt.sign({ userId }, refreshPrivateKey, {
    expiresIn: "7d",
    algorithm: "RS256",
  });
  return refreshToken;
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, authPublicKey, { algorithms: ["RS256"] });
};

const verifyOTPToken = (token) => {
  return jwt.verify(token, otpPublicKey, { algorithms: ["RS256"] });
};

module.exports = {
  generateOTPToken,
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyOTPToken,
};
