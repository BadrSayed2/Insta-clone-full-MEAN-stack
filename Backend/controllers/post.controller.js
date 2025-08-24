const path = require("path");

const Post = require("../models/post.model");
const Comment = require("../models/comment.model");
const Follower = require("../models/follower.model");

const uploadImage = require("../utils/upload-image");
const deleteImage = require("../utils/delete-image");

const postController = {};

const ApiResponse = require("../utils/api-response");
const ApiError = require("../utils/api-error");
const getPictureUrl = require("../utils/get-image-url");
const getVideoUrl = require("../utils/get-video-url");

postController.getUserPosts = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const posts = await Post.find({ user_id: userId }).sort({ createdAt: -1 });
    if (!posts.length) {
      return next(new ApiError("No posts found for this user", 404));
    }
    return res.status(200).json(new ApiResponse({ posts }));
  } catch (err) {
    return next(err);
  }
};

postController.deletePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return next(new ApiError("Post not found", 404));
    }
    // Check if the post belongs to the user
    if (post.user_id.toString() !== req.user.id) {
      return next(
        new ApiError("You are not authorized to delete this post", 403)
      );
    }
    await post.remove();
    return res
      .status(200)
      .json(new ApiResponse({ message: "Post deleted successfully" }));
  } catch (err) {
    return next(err);
  }
};

postController.addPostHandler = async (req, res, next) => {
  try {
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
    const result = await uploadImage(mediaPath, cloudinaryPath, mediaType);
    if (!result) {
      return next(new ApiError("Could not upload your file", 400));
    }

    newPost.media = { url: result, media_type: mediaType };
    newPost.user_id = userId;

    console.log(newPost);

    await Post.create({ ...newPost });

    return res
      .status(201)
      .json(new ApiResponse({ message: "Post added successfully" }));
  } catch (e) {
    return next(e);
  }
};

// Update Post
postController.updatePostHandler = async (req, res, next) => {
  if (req.fileValidationError) {
    return next(new ApiError(req.fileValidationError, 400));
  }

  const userId = req.user_id;
  const newPost = req?.body;

  const video = req.files["post_video"] ? req.files["post_video"][0] : null;
  const pic = req.files["post_pic"] ? req.files["post_pic"][0] : null;
  let mediaPathArr = ["uploads"];
  let mediaType = "";
  let cloudinaryPath = "";
  try {
    const postId = req?.params?.post_id;
    const foundPost = await Post.findById(postId);

    if (foundPost.user_id != userId) {
      return res
        .status(401)
        .json({ err: "this is not your post", success: false });
    }
    if (!pic && !video) {
      return res
        .status(400)
        .json({ err: "you must upload a picture or a video", success: false });
    } else if (pic) {
      // console.log(pic);

      mediaPathArr.push("post_pics");
      mediaPathArr.push(pic.filename);
      mediaType = "picture";
      cloudinaryPath = "post_pics";
    } else if (video) {
      console.log(video);

      mediaPathArr.push("post_videos");
      mediaPathArr.push(video.filename);
      mediaType = "video";
      cloudinaryPath = "post_videos";
    }

    if (pic || video) {
      const mediaPath = path.join(...mediaPathArr);

      const deleteResult = await deleteImage(foundPost.media.url);
      if (!deleteResult) {
        return res
          .status(400)
          .json({ err: "could not upload your file", success: false });
      }
      const result = await uploadImage(mediaPath, cloudinaryPath, mediaType);

      if (!result) {
        return res
          .status(400)
          .json({ err: "could not upload your file", success: false });
      }
      foundPost.media = {
        url: result,
        media_type: mediaType,
      };
    }
    foundPost.caption = newPost.caption;
    await foundPost.save();

    res.json({ message: "post updated successfully", success: true });
  } catch (e) {
    console.log(e.message);
    res
      .status(500)
      .json({ err: "server error please try again", success: false });
  }
};

postController.commentPost = async (req, res) => {
  try {
    const userId = req?.user_id;
    const postId = req?.params?.post_id;
    const comment = req?.body?.comment;
    if (!postId || !userId || !comment) {
      return res.status(401).json({
        err: "you must pass the post id and a comment",
        success: false,
      });
    }
    const post = await Post.findById(postId);
    if (post.user_id != userId) {
      return res
        .status(401)
        .json({ err: "this is not your post MF", success: false });
    }

    await Comment.create({
      post_id: postId,
      user_id: userId,
      content: comment,
    });

    post.commentsNumber++;
    post.save();
    res
      .status(201)
      .json({ message: "comment is created successfully", success: true });
  } catch (e) {
    console.log(e.message);
    res
      .status(500)
      .json({ err: "server error please try again", success: false });
  }
};

postController.feedPosts = async (req, res) => {
  try {
    const userId = req?.user_id;
    const offset = req?.query?.limit || 0;
    const following = await Follower.find({ user: userId }).select(
      "followed -_id"
    );
    const followingIds = following.map((f) => f.followed);

    const db_posts = await Post.find({ user_id: { $in: followingIds } })
      .sort({ createdAt: -1 })
      .skip(offset * 15)
      .limit(15)
      .select("-user_id")
      .populate({
        path: "user_id",
        select: "userName fullName profile_pic accessabilty",
      })
      .lean();
    const posts = db_posts.map((post) => {
      if (post.media.media_type == "picture") {
        post.media.url = getPictureUrl(post?.media?.url);
      } else if (post.media.media_type == "video") {
        post.media.url = getVideoUrl(post?.media?.url);
      } else {
      }
      return post;
    });
    return res.json({ posts, success: true });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ err: "server error", success: false });
  }
};

module.exports = postController;
