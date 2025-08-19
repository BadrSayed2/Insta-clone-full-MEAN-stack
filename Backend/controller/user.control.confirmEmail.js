const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const confirmEmail = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token format invalid" });
    }

    const token = authHeader.split(" ")[1];
    console.log(token);

    const decoded = jwt.verify(token, process.env.SCRIT_KEY_ACTIVE);

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
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { confirmEmail };
