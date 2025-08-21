const bcrypt = require("bcryptjs");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { emailEvent } = require("../utils/email.event.utils");
const signup = async (req, res) => {
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
      return res.status(400).json({
        message: "The password and its confirmation do not match",
      });
    }

    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res
        .status(409)
        .json({ message: "This email is already registered" });
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
    return res.status(201).json({
      message:
        "The account has been created successfully. Please confirm your email.",
      token,
    });
  } catch (error) {
    console.error("Signup error:", error);
    console.log(parseInt(process.env.SOLT));
    return res.status(500).json({
      message: "An internal server error has occurred. Try later.",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "in-valid login Data" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(404).json({ message: "in-valid login Data" });
    }
    if (!user.confirmEmail) {
      return res
        .status(403)
        .json({ message: "Please confirm your email before proceeding" });
    }
    user.phone = CryptoJS.AES.decrypt(
      user.phoneNumber,
      process.env.ENCRYPT
    ).toString(CryptoJS.enc.Utf8);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({ message: "done", token });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const confirmEmail = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token format invalid" });
    }

    const token = authHeader.split(" ")[1];
    console.log(token);

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
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { signup, login, confirmEmail };
