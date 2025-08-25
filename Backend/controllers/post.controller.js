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

const postController = {};

const ApiResponse = require("../utils/api-response");
const ApiError = require("../utils/api-error");

postController.getUserPosts = async (req, res, next) => {
  const userId = req.params.id;
  const posts = await Post.find({ userId: userId }).sort({ createdAt: -1 });
  if (!posts.length) {
    return next(new ApiError("No posts found for this user", 404));
  }
  return res.status(200).json(new ApiResponse({ posts }));
};

postController.deletePost = async (req, res, next) => {
  const postId = req.params.id;
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
  await post.remove();
  return res
    .status(200)
    .json(new ApiResponse({ message: "Post deleted successfully" }));
};

postController.addPostHandler = async (req, res, next) => {
  if (req.fileValidationError) {
    return next(new ApiError(req.fileValidationError, 400));
  }

  const userId = req?.user?.id;
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
  const result = await uploadAsset(mediaPath, cloudinaryPath, mediaType);
  if (!result) {
    return next(new ApiError("Could not upload your file", 400));
  }

  newPost.media = { url: result, media_type: mediaType };
  newPost.userId = userId;

  console.log(newPost);

  await Post.create({ ...newPost });

  return res
    .status(201)
    .json(new ApiResponse({ message: "Post added successfully" }));
};

// Update Post
postController.updatePostHandler = async (req, res, next) => {
  if (req.fileValidationError) {
    return next(new ApiError(req.fileValidationError, 400));
  }

  const userId = req.user?.id;
  const newPost = req?.body;

  const video = req.files["post_video"] ? req.files["post_video"][0] : null;
  const pic = req.files["post_pic"] ? req.files["post_pic"][0] : null;
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
    return next(new ApiError("you must upload a picture or a video", 400));
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

    const deleteResult = await deleteAsset(foundPost.media.url, mediaType);
    if (!deleteResult) {
      return next(new ApiError("could not upload your file", 400));
    }
    const result = await uploadAsset(mediaPath, cloudinaryPath, mediaType);

    if (!result) {
      return next(new ApiError("could not upload your file", 400));
    }
    foundPost.media = {
      url: result,
      media_type: mediaType,
    };
  }
  foundPost.caption = newPost.caption;
  await foundPost.save();

  return res.json({ message: "post updated successfully", success: true });
};

postController.commentPost = async (req, res, next) => {
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

postController.feedPosts = async (req, res, next) => {
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
    if (post.media.media_type == "picture") {
      post.media.url = getImageUrl(post?.media?.url);
    } else if (post.media.media_type == "video") {
      post.media.url = getVideoUrl(post?.media?.url);
    } else {
    }
    return post;
  });
  return res.json({ posts, success: true });
};

module.exports = postController;
