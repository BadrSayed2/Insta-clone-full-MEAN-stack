const fs = require("fs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const OTP = require("../models/OTP.model");
const Post = require("../models/post.model");
const Follower = require("../models/follower.model");
const ApiResponse = require("../utils/api-response");
const ApiError = require("../utils/api-error");
const get_image_url = require("../utils/get_image_url");
const get_video_url = require("../utils/get_video_url");

// Load keys (kept as in legacy controller)

const OTP_public_key = fs.readFileSync(
  "./keys/OTP/OTP_public_key.pem",
  "utf-8"
);
const auth_private_key = fs.readFileSync(
  "./keys/auth/auth_private_key.pem",
  "utf-8"
);

const refresh_private_key = fs.readFileSync(
  "./keys/refresh/refresh_private_key.pem",
  "utf-8"
);

const getOtherUserProfile = async (req, res, next) => {
  try {
    const userid = req.params.id;
    const user = await User.findOne({ _id: userid }).select(
      "userName fullName bio -_id"
    );
    if (!user) {
      return next(new ApiError("User not found", 404));
    }
    return res.status(200).json(new ApiResponse({ user }));
  } catch (err) {
    return next(err);
  }
};
const getUserPosts = async (req, res, next) => {
  const userId = req.params.id;
  const userPosts = await Post.find({
    user_id: userId,
    privacy: "public",
  }).sort({ createdAt: -1 });
  if (!userPosts || userPosts.length === 0) {
    return res.status(404).json(new ApiError("No posts found", 404));
  }
  return res.status(200).json(new ApiResponse({ posts: userPosts }));
};

// Additional handlers migrated from legacy controllers/user.controller.js
const verify_otp = async (req, res, next) => {
  try {
    const token = req?.cookies?.["OTP_verification_token"]; // fixed missing var
    if (!token) {
      return next(new ApiError("you need to login", 401));
    }

    const payload = jwt.verify(token, OTP_public_key, { algorithms: "RS256" });
    const code = payload?.code;
    const user = await User.findOne({ phoneNumber: payload?.phoneNumber });
    if (!user) {
      return next(new ApiError("you need to login", 401));
    }

    const db_code = await OTP.findOne({ user_id: user._id });
    if (db_code?.code && db_code?.code == code) {
      if (!user?.isVerified) {
        user.isVerified = true;
        await user.save();
      }

      const refresh_token = jwt.sign(
        { user_id: user._id },
        { key: refresh_private_key },
        { algorithm: "RS256", expiresIn: "10d" }
      );

      const access_token = jwt.sign(
        { user_id: user._id },
        { key: auth_private_key },
        { algorithm: "RS256", expiresIn: "15m" }
      );

      const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        maxAge: 15 * 60 * 1000,
      };

      res.cookie("authentication", access_token, cookieOptions);
      res.cookie("refresh", refresh_token, {
        ...cookieOptions,
        maxAge: 10 * 24 * 60 * 60 * 1000,
      });

      res.clearCookie("OTP_verification_token");
      return res
        .status(200)
        .json(new ApiResponse({ message: "you are verified" }));
    } else {
      return next(new ApiError("you need to login", 401));
    }
  } catch (e) {
    return next(e);
  }
};

const get_profile = async (req, res, next) => {
  try {
    const user_id = req?.user?.id;
    let profile = await User.findById(user_id)
      .select("-password -_id -email -phoneNumber -isVerified")
      .lean();

    if (!profile) return next(new ApiError("User not found", 404));
    profile.profile_pic = profile?.profile_pic
      ? get_image_url(profile.profile_pic)
      : null;

    let user_posts = await Post.find({ user_id })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();
    user_posts = user_posts.map((post) => {
      const media_type = post.media.media_type;
      const media_public_id = post.media.url;
      let media_url = "";
      if (media_type === "picture") {
        media_url = get_image_url(media_public_id, "post");
      } else if (media_type === "video") {
        media_url = get_video_url(media_public_id);
      }
      return {
        ...post,
        media: { media_type, url: media_url },
      };
    });
    return res.status(200).json(new ApiResponse({ profile, user_posts }));
  } catch (e) {
    return next(e);
  }
};
//! still need to handle the upload image
const updateProfile = async (req, res, next) => {
  try {
    const userId = req?.user?.id;
    if (!userId) return next(new ApiError("Unauthorized", 401));

    const {
      userName,
      fullName,
      bio,
      gender,
      accessability,
      profile_pic,
      phoneNumber,
    } = req.body;
    const updates = {
      ...(userName && { userName }),
      ...(fullName && { fullName }),
      ...(bio && { bio }),
      ...(gender && { gender }),
      ...(accessability && { accessability }),
      ...(profile_pic && { profile_pic }),
      ...(phoneNumber && { phoneNumber }),
    };

    if (Object.keys(updates).length === 0) {
      return next(new ApiError("No valid fields to update", 400));
    }

    const user = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    });

    if (!user) return next(new ApiError("User not found", 404));

    user.password = undefined;
    res.status(200).json(new ApiResponse({ user }));
  } catch (err) {
    next(err);
  }
};

const get_followers = async (req, res, next) => {
  try {
    const user_id = req?.user?.id;
    let followers = await Follower.find({ followed: user_id })
      .populate({
        path: "user",
        match: { accessibility: { $ne: "private" } },
        select: "-password -email -phoneNumber",
      })
      .lean();

    followers = followers.map((follower) => ({
      ...follower.user,
      profile_pic: follower?.user?.profile_pic
        ? get_image_url(follower?.user?.profile_pic)
        : null,
    }));
    return res.status(200).json(new ApiResponse({ followers }));
  } catch (e) {
    return next(e);
  }
};


module.exports = {
  getOtherUserProfile,
  getUserPosts,
  verify_otp,
  get_profile,
  get_followers,
  updateProfile,
};
