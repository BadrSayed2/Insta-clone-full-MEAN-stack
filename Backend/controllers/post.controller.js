const path = require("path");

const Post = require("../models/post.model");
const Comment = require("../models/comment.model");
const Follower = require("../models/follower.model");

const {
  uploadAsset,
  deleteAsset,
  getImageUrl,
  getVideoUrl,
} = require("../utils/media");
const ApiResponse = require("../utils/api-response");
const ApiError = require("../utils/api-error");
//! @desc    Get a post by ID
// @route   GET /posts/:postId
// @access  private/user
const getPost = async (req, res, next) => {
  const postId = req.params.postId;
  const post = await Post.findById(postId).select("-__v");
  if (!post) {
    return next(new ApiError("No post found with this ID", 404));
  }
  return res
    .status(200)
    .json(
      new ApiResponse({ data: post, message: "Post retrieved successfully" })
    );
};

const deletePost = async (req, res, next) => {
  const postId = req.params.postId;
  const post = await Post.findById(postId);
  if (!post) {
    return next(new ApiError("Post not found", 404));
  }
  // Check if the post belongs to the user
  if (post.userId.toString() !== req.user.id) {
    return next(
      new ApiError("You are not authorized to delete this post", 403)
    );
  }
  try {
    if (post.media?.publicId) {
      await deleteAsset(post.media.publicId, post.media.media_type);
    }
  } catch {}
  await post.deleteOne();
  return res
    .status(200)
    .json(new ApiResponse({ message: "Post deleted successfully" }));
};

const createPost = async (req, res, next) => {
  if (req.fileValidationError) {
    return next(new ApiError(req.fileValidationError, 400));
  }

  const userId = req?.user?.id || "68ada9aad10408e4e01f3109";
  const newPost = req?.body || {};

  const video =
    req.files && req.files["post_video"] ? req.files["post_video"][0] : null;
  const pic =
    req.files && req.files["post_pic"] ? req.files["post_pic"][0] : null;

  if (!video && !pic) {
    return next(
      new ApiError("You must upload either a video or a picture.", 400)
    );
  }

  let mediaPathArr = ["uploads"]; // local uploads folder
  let mediaType = "";
  let cloudinaryPath = "";

  if (pic) {
    mediaPathArr.push("post_pics", pic.filename);
    mediaType = "picture";
    cloudinaryPath = "post_pics";
  } else if (video) {
    mediaPathArr.push("post_videos", video.filename);
    mediaType = "video";
    cloudinaryPath = "post_videos";
  }

  const mediaPath = path.join(...mediaPathArr);
  const publicId = await uploadAsset(mediaPath, cloudinaryPath, mediaType);
  const imageUrl =
    mediaType === "picture"
      ? getImageUrl(publicId, "post")
      : getVideoUrl(publicId);
  if (!publicId) {
    return next(new ApiError("Could not upload your file", 400));
  }

  newPost.media = {
    url: imageUrl,
    media_type: mediaType,
    publicId: publicId,
  };
  newPost.userId = userId;

  await Post.create({ ...newPost });

  return res
    .status(201)
    .json(new ApiResponse({ message: "Post added successfully" }));
};

// Update Post
const updatePostHandler = async (req, res, next) => {
  if (req.fileValidationError) {
    return next(new ApiError(req.fileValidationError, 400));
  }

  const userId = req.user?.id;
  const newPost = req?.body;

  const video =
    req.files && req.files["post_video"] ? req.files["post_video"][0] : null;
  const pic =
    req.files && req.files["post_pic"] ? req.files["post_pic"][0] : null;
  let mediaPathArr = ["uploads"];
  let mediaType = "";
  let cloudinaryPath = "";

  const postId = req?.params?.postId;
  const foundPost = await Post.findById(postId);
  if (!foundPost) {
    return next(new ApiError("Post not found", 404));
  }

  if (foundPost.userId != userId) {
    return next(new ApiError("this is not your post", 401));
  }
  if (!pic && !video) {
    // Allow caption-only update
    if (typeof newPost?.caption === "string") {
      foundPost.caption = newPost.caption;
      await foundPost.save();
      return res.json({ message: "post updated successfully", success: true });
    }
    return next(
      new ApiError(
        "you must upload a picture or a video or provide a caption",
        400
      )
    );
  } else if (pic) {
    mediaPathArr.push("post_pics");
    mediaPathArr.push(pic.filename);
    mediaType = "picture";
    cloudinaryPath = "post_pics";
  } else if (video) {
    mediaPathArr.push("post_videos");
    mediaPathArr.push(video.filename);
    mediaType = "video";
    cloudinaryPath = "post_videos";
  }
  if (pic || video) {
    const mediaPath = path.join(...mediaPathArr);
    // Best-effort delete of previous asset using its publicId
    try {
      if (foundPost?.media?.publicId) {
        await deleteAsset(foundPost.media.publicId, mediaType);
      }
    } catch (e) {}
    const newPublicId = await uploadAsset(mediaPath, cloudinaryPath, mediaType);
    if (!newPublicId) {
      return next(new ApiError("could not upload your file", 400));
    }
    foundPost.media = {
      url:
        mediaType === "picture"
          ? getImageUrl(newPublicId, "post")
          : getVideoUrl(newPublicId),
      media_type: mediaType,
      publicId: newPublicId,
    };
  }
  foundPost.caption = newPost.caption;
  await foundPost.save();

  return res.json({ message: "post updated successfully", success: true });
};

const commentPost = async (req, res, next) => {
  const userId = req?.user?.id;
  const postId = req?.params?.postId;
  const comment = req?.body?.comment;
  if (!postId || !userId || !comment) {
    return next(new ApiError("you must pass the post id and a comment", 400));
  }
  const post = await Post.findById(postId);
  if (!post) {
    return next(new ApiError("Post not found", 404));
  }
  if (post.userId != userId) {
    return next(new ApiError("this is not your post", 401));
  }

  await Comment.create({
    postId: postId,
    userId: userId,
    content: comment,
  });

  post.commentsNumber++;
  await post.save();
  return res
    .status(201)
    .json({ message: "comment is created successfully", success: true });
};

const feedPosts = async (req, res, next) => {
  const userId = req?.user?.id;
  const offset = req?.query?.limit || 0;
  const following = await Follower.find({ user: userId }).select(
    "followed -_id"
  );
  const followingIds = following.map((f) => f.followed);

  const db_posts = await Post.find({ userId: { $in: followingIds } })
    .sort({ createdAt: -1 })
    .skip(offset * 15)
    .limit(15)
    .select("-userId")
    .populate({
      path: "userId",
      select: "userName fullName profile_pic accessabilty",
    })
    .lean();
  const posts = db_posts.map((post) => {
    const hasHttpUrl =
      typeof post?.media?.url === "string" && post.media.url.startsWith("http");
    if (!hasHttpUrl) {
      const pid = post?.media?.publicId || post?.media?.url;
      if (post.media.media_type === "picture") {
        post.media.url = getImageUrl(pid);
      } else if (post.media.media_type === "video") {
        post.media.url = getVideoUrl(pid);
      }
    }
    return post;
  });
  return res.json({ posts, success: true });
};

// Get posts for a specific user (supports nested /users/:username/posts)
const getUserPosts = async (req, res, next) => {
  const username = req?.params?.username;
  if (!username) return next(new ApiError("User name is required", 400));
  const offset = Number(req?.query?.offset || 0);

  // Resolve username to userId
  const user = await require("../models/user.model")
    .findOne({ userName: username })
    .select("_id");
  if (!user) return next(new ApiError("User not found", 404));

  const db_posts = await Post.find({ userId: user._id })
    .sort({ createdAt: -1 })
    .skip(offset * 15)
    .limit(15)
    .lean();
  const posts = db_posts.map((post) => {
    const hasHttpUrl =
      typeof post?.media?.url === "string" && post.media.url.startsWith("http");
    if (!hasHttpUrl) {
      const pid = post?.media?.publicId || post?.media?.url;
      if (post.media.media_type === "picture") {
        post.media.url = getImageUrl(pid, "post");
      } else if (post.media.media_type === "video") {
        post.media.url = getVideoUrl(pid);
      }
    }
    return post;
  });
  return res.json({ posts, success: true });
};
const getMyPosts = async (req, res, next) => {
  const userId = req?.user?.id;
  console.log(`Fetching posts for user: ${userId}`);
  const posts = await Post.find({ userId }).sort({ createdAt: -1 }).lean();
  return res.json(new ApiResponse({ data: posts, success: true }));
};
module.exports = {
  getMyPosts,
  deletePost,
  createPost,
  updatePostHandler,
  commentPost,
  feedPosts,
  getPost,
  getUserPosts,
};
