const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");

const User = require("../models/user.model");
const OTP = require("../models/OTP.model");
const Post = require("../models/post.model");
const Follower = require("../models/follower.model");

const ApiResponse = require("../utils/api-response");
const ApiError = require("../utils/api-error");

const get_image_url = require("../utils/get-image-url");
const get_video_url = require("../utils/get_video_url");
const uploadImage = require("../utils/upload-image");
const deleteImage = require("../utils/delete-image");
// Load keys (kept as in legacy controller)

const getOtherUserProfile = async (req, res, next) => {
  try {
    const userid = req.params.id;
    const user = await User.findOne({
      _id: userid,
      accessability: "public",
    }).select("-password -_id -email -phoneNumber -isVerified ");
    if (!user) {
      return next(new ApiError("User not found", 404));
    }
    return res.status(200).json(ApiResponse({ data: user }));
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
  return res.status(200).json(new ApiResponse({ data: { posts: userPosts } }));
};

const get_profile = async (req, res, next) => {
  try {
    const user_id = req?.user_id;

    let profile = await User.findById(user_id)
      .select("-password -_id -email -phoneNumber -isVerified")
      .lean();

    if (!profile) return next(new ApiError("User not found", 404));
    profile.profile_pic = profile?.profile_pic?.url || null;

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
    // console.log(profile , user_posts);

    return res
      .status(200)
      .json(new ApiResponse({ data: { profile, user_posts } }));
  } catch (e) {
    return next(e);
  }
};
const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    if (!userId) return next(new ApiError("Unauthorized", 401));

    const { userName, fullName, bio, gender, accessability, phoneNumber } =
      req.body;

    const updates = {
      ...(userName && { userName }),
      ...(fullName && { fullName }),
      ...(bio && { bio }),
      ...(gender && { gender }),
      ...(accessability && { accessability }),
      ...(phoneNumber && { phoneNumber }),
    };

    // Handle multer filter error (wrong file type/size)
    if (req.fileValidationError) {
      return next(new ApiError(req.fileValidationError, 400));
    }

    // If a profile image is uploaded (field name configured in multer: 'profile')
    if (req.file && req.file.fieldname === "profile") {
      const localPath = req.file.path;
      // Upload to Cloudinary under 'profiles' folder
      const newPublicId = await uploadImage(localPath, "profiles");
      // Remove local temp file
      try {
        if (localPath && fs.existsSync(localPath)) fs.unlinkSync(localPath);
      } catch {}
      if (!newPublicId) {
        return next(new ApiError("Failed to upload profile image", 500));
      }

      // Delete previous cloud image if any
      const existing = await User.findById(userId).select("profile_pic");
      if (!existing) return next(new ApiError("User not found", 404));
      if (existing.profile_pic?.public_id) {
        try {
          await deleteImage(existing.profile_pic.public_id);
        } catch {}
      }
      updates.profile_pic = {
        public_id: newPublicId,
        url: get_image_url(newPublicId, "profile"),
      };
    }

    if (Object.keys(updates).length === 0) {
      return next(new ApiError("No valid fields to update", 400));
    }

    const user = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    });

    if (!user) return next(new ApiError("User not found", 404));

    user.password = undefined;
    // Ensure the response returns a URL (avoid double-transform if already URL)
    const out = user.toObject();
    return res.status(200).json(new ApiResponse({ user: out }));
    res.status(200).json(new ApiResponse({ user: out }));
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
      profile_pic: follower?.user?.profile_pic?.url || null,
    }));
    return res.status(200).json(new ApiResponse({ data: followers }));
  } catch (e) {
    return next(e);
  }
};

module.exports = {
  getOtherUserProfile,
  getUserPosts,
  get_profile,
  get_followers,
  updateProfile,
};
