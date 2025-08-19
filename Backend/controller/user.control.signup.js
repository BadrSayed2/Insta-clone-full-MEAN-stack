const bcrypt = require("bcryptjs");
const CryptoJS = require("crypto-js");
const { emailEvent } = require("../utils/email.event.utils");
const User = require("../models/user.model");

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
      accessabilty,
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
      parseInt(process.env.SOLT)
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
      accessabilty,
      bio,
      DOB,
    });

    emailEvent.emit("sendConfirmEmail", { email });

    return res.status(201).json({
      message:
        "The account has been created successfully. Please confirm your email.",
      user,
    });
  } catch (error) {
    console.error("Signup error:", error);
    console.log(parseInt(process.env.SOLT));
    return res.status(500).json({
      message: "An internal server error has occurred. Try later.",
    });
  }
};

module.exports = { signup };
