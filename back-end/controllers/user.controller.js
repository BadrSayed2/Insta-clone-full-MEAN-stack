const fs = require('fs')
const jwt = require('jsonwebtoken')

const User = require('../models/user.model')
const OTP = require('../models/OTP.model')
const Post = require('../models/post.model')

const user_controller = {}

const OTP_private_key = fs.readFileSync('./keys/OTP/OTP_private_key.pem', 'utf-8')
const OTP_public_key = fs.readFileSync('./keys/OTP/OTP_public_key.pem', 'utf-8')

const auth_private_key = fs.readFileSync('./keys/auth/auth_private_key.pem', 'utf-8')
const auth_public_key = fs.readFileSync('./keys/auth/auth_public_key.pem', 'utf-8')

const refresh_private_key = fs.readFileSync('./keys/refresh/refresh_private_key.pem', 'utf-8')
const refresh_public_key = fs.readFileSync('./keys/refresh/refresh_public_key.pem', 'utf-8')

user_controller.verify_otp = async (req, res) => {
  try {
    const cookie = req?.cookies["OTP_verification_token"]

    if (!cookie) {
      return res.status(401).json({ err: "you need to login", success: false })
    }

    const payload = jwt.verify(token, OTP_public_key, { algorithms: "RS256" })
    const code = payload?.code

    const user = await User.findOne({ phoneNumber: payload.phoneNumber })

    if (!user) {
      return res.status(401).json({ err: "you need to login", success: false })
    }

    const db_code = await OTP.findOne({ user_id: user._id })
    if (db_code?.code && db_code?.code == code) {
      if (!user?.isVerified) {
        user.isVerified = true
        user.save()
      }

      const refresh_token = jwt.sign(
        { user_id: user._id },
        { key: refresh_private_key },
        { algorithm: "RS256", expiresIn: "10d" }
      );

      const token = jwt.sign(
        { user_id: user._id },
        { key: auth_private_key },
        { algorithm: "RS256", expiresIn: "15m" }
      );

      const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
        maxAge: 15 * 60 * 1000,
      };

      res.cookie("authentication", token, cookieOptions);
      res.cookie("refresh", refresh_token, {
        ...cookieOptions,
        maxAge: 10 * 24 * 60 * 60 * 1000
      });

      res.clearCookie("OTP_verification_token");
      res.status(200).json({ message: "you are verified", success: true })
      return;
    } else {
      return res.status(401).json({ message: "you need to login", success: false })
    }
  } catch (e) {
    res.status(500).json({ message: "server error please try again", success: false })
  }

}
user_controller.get_profile = async (req, res) => {
  try {

    const user_id = req?.user_id
    const profile = await User
      .findById(user_id)
      .select("-password -_id -email -phoneNumber -isVerified")
      .lean()
    
    const user_posts = await Post.find({ user_id })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean()
    res.json({profile , user_posts})
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ err: "internal server error" })

  }


}
module.exports = user_controller