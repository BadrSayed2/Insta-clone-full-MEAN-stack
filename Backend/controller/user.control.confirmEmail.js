const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const logger = require("../utils/logger");

const confirmEmail = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token format invalid" });
    }

    const token = authHeader.split(" ")[1];
    logger.debug(`Confirm email token received`);

    const decoded = jwt.verify(token, process.env.SECRET_KEY_ACTIVE);

    const user = await User.findOneAndUpdate(
      { email: decoded.email },
      { confirmEmail: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "Account activated", user });
  } catch (error) {
    const logger = require("../utils/logger");
    logger.error(`Signup error: ${error.message}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { confirmEmail };
