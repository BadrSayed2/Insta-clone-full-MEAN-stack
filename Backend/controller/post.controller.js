const path = require("path");
const Post = require("../models/post.model");
const ApiResponse = require("../utils/api-response");
const ApiError = require("../utils/api-error");
const upload_image = require("../utils/upload_image.util");
const deleteFile = require("../utils/delete_image.util");

const getUserPosts = async (req, res, next) => {
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
const deletePost = async (req, res, next) => {
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

module.exports = { getUserPosts, deletePost };

// Additional handlers migrated from legacy controllers/post.controller.js
// Add Post
const add_post_handler = async (req, res, next) => {
  try {
    if (req.fileValidationError) {
      return next(new ApiError(req.fileValidationError, 400));
    }

    const user_id = req?.user?.id;
    const new_post = req?.body || {};

    const video = req.files && req.files["post_video"] ? req.files["post_video"][0] : null;
    const pic = req.files && req.files["post_pic"] ? req.files["post_pic"][0] : null;

    if (!video && !pic) {
      return next(new ApiError("You must upload either a video or a picture.", 400));
    }

    let media_path_arr = ["uploads"]; // local uploads folder
    let media_type = "";
    let cloudinary_path = "";

    if (pic) {
      media_path_arr.push("post_pics", pic.filename);
      media_type = "picture";
      cloudinary_path = "post_pics";
    } else if (video) {
      media_path_arr.push("post_videos", video.filename);
      media_type = "video";
      cloudinary_path = "post_videos";
    }

    const media_path = path.join(...media_path_arr);
    const result = await upload_image(media_path, cloudinary_path, media_type);
    if (!result) {
      return next(new ApiError("Could not upload your file", 400));
    }

    new_post.media = { url: result.filename, media_type };
    new_post.user_id = user_id;

    await Post.create({ ...new_post });

    return res.status(201).json(new ApiResponse({ message: "Post added successfully" }));
  } catch (e) {
    return next(e);
  }
};

// Update Post
const update_post_handler = async (req, res, next) => {
  try {
    if (req.fileValidationError) {
      return next(new ApiError(req.fileValidationError, 400));
    }

    const user_id = req?.user?.id;
    const new_post = req?.body || {};

    const video = req.files && req.files["post_video"] ? req.files["post_video"][0] : null;
    const pic = req.files && req.files["post_pic"] ? req.files["post_pic"][0] : null;

    let media_path_arr = ["uploads"];
    let media_type = "";
    let cloudinary_path = "";

    const post_id = req?.params?.post_id;
    const found_post = await Post.findById(post_id);
    if (!found_post) {
      return next(new ApiError("Post not found", 404));
    }
    if (found_post.user_id.toString() !== user_id) {
      return next(new ApiError("This is not your post", 401));
    }

    if (pic) {
      media_path_arr.push("post_pics", pic.filename);
      media_type = "picture";
      cloudinary_path = "post_pics";
    } else if (video) {
      media_path_arr.push("post_videos", video.filename);
      media_type = "video";
      cloudinary_path = "post_videos";
    }

    if (pic || video) {
      const media_path = path.join(...media_path_arr);

      const delete_result = await deleteFile(found_post.media.url);
      if (!delete_result) {
        return next(new ApiError("Could not delete old file", 400));
      }
      const result = await upload_image(media_path, cloudinary_path, media_type);
      if (!result) {
        return next(new ApiError("Could not upload your file", 400));
      }
      found_post.media = { url: result.filename, media_type };
    }

    if (typeof new_post.caption !== "undefined") {
      found_post.caption = new_post.caption;
    }
    await found_post.save();

    return res.status(200).json(new ApiResponse({ message: "Post updated successfully" }));
  } catch (e) {
    return next(e);
  }
};

module.exports = {
  getUserPosts,
  deletePost,
  add_post_handler,
  update_post_handler,
};
