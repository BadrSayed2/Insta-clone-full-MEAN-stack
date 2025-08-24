
const path = require('path')

const User = require('../models/post.model')
const Post = require('../models/post.model')
const Comment = require('../models/comment.model')
const Follower = require("../models/follower.model")

const upload_image = require('../utils/upload_image.util')
const deleteFile = require('../utils/delete_image.util')

const post_controller = {}

const ApiResponse = require("../utils/api-response");
const ApiError = require("../utils/api-error");
const get_Picture_Url = require('../utils/get_image_url')
const get_video_url = require('../utils/get_video_url')


post_controller.getUserPosts = async (req, res, next) => {
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

post_controller.deletePost = async (req, res, next) => {
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


post_controller.add_post_handler = async (req, res,next) => {
  try {
    if (req.fileValidationError) {
      return next(new ApiError(req.fileValidationError, 400));
    }

    const user_id = req?.user?.id;
    const new_post = req?.body || {};

    const video =
      req.files && req.files["post_video"] ? req.files["post_video"][0] : null;
    const pic =
      req.files && req.files["post_pic"] ? req.files["post_pic"][0] : null;
    
    
    if (!video && !pic) {
      return next(
        new ApiError("You must upload either a video or a picture.", 400)
      );
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
    
    new_post.media = { url: result, media_type };
    new_post.user_id = user_id;
    
    console.log(new_post);
    
    await Post.create({ ...new_post });

    return res
      .status(201)
      .json(new ApiResponse({ message: "Post added successfully" }));
  } catch (e) {
    return next(e);
  }
}

// Update Post
post_controller.update_post_handler = async (req, res, next) => {
  if (req.fileValidationError) {
    return next(new ApiError(req.fileValidationError, 400));
  }

  const user_id = req.user_id
  const new_post = req?.body

  const video = req.files["post_video"] ? req.files["post_video"][0] : null;
  const pic = req.files["post_pic"] ? req.files["post_pic"][0] : null;
  let media_path_arr = ["uploads"]
  let media_type = ""
  let cloudinary_path = ""
  try {
    const post_id = req?.params?.post_id
    const found_post = await Post.findById(post_id)

    if (found_post.user_id != user_id) {
      return res.status(401).json({ err: "this is not your post", success: false })
    }
    if (!pic && !video) {
      return res.status(400).json({ err: "you must upload a picture or a video", success: false })
    }
    else if (pic) {
      // console.log(pic);

      media_path_arr.push("post_pics")
      media_path_arr.push(pic.filename)
      media_type = "picture"
      cloudinary_path = "post_pics"
    } else if (video) {
      console.log(video);

      media_path_arr.push("post_videos")
      media_path_arr.push(video.filename)
      media_type = "video"
      cloudinary_path = "post_videos"
    }

    if (pic || video) {
      const media_path = path.join(...media_path_arr)

      const delete_result = await deleteFile(found_post.media.url)
      if (!delete_result) {
        return res.stauts(400).json({ err: "could not upload your file", success: false })
      }
      const result = await upload_image(media_path, cloudinary_path, media_type)

      if (!result) {
        return res.stauts(400).json({ err: "could not upload your file", success: false })
      }
      found_post.media = {
        url: result.filename,
        media_type
      }

    }
    found_post.caption = new_post.caption
    await found_post.save()

    res.json({ message: "post updated successfully", success: true })
  }
  catch (e) {
    console.log(e.message);
    res.status(500).json({ err: "server error please try again", success: false })

  }
}

post_controller.comment_post = async (req, res) => {
  try {

    const user_id = req?.user_id
    const post_id = req?.params?.post_id
    const comment = req?.body?.comment
    if (!post_id || !user_id || !comment) {
      return res.status(401).json({ err: "you must pass the post id and a comment", success: false })
    }
    const post = await Post.findById(post_id)
    if (post.user_id != user_id) {
      return res.status(401).json({ err: "this is not your post MF", success: false })
    }

    await Comment.create({
      post_id,
      user_id,
      content: comment,
    })
    
    post.commentsNumber++;
    post.save();
    res.status(201).json({ message: "comment is created successfully", success: true })
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ err: "server error please try again", success: false })

  }
}

post_controller.feed_posts = async (req, res) => {
  try {

    const user_id = req?.user_id
    const offset = req?.query?.limit || 0;
    const following = await Follower.find({ user: user_id }).select('followed -_id');
    const followingIds = following.map(f => f.followed);

    const db_posts = await Post.find({ user_id: { $in: followingIds } })
      .sort({ createdAt: -1 })
      .skip(offset * 15)
      .limit(15)
      .select("-user_id")
      .populate({
        path: 'user_id',
        select: 'userName fullName profile_pic accessabilty',
      })
      .lean();
    const posts = db_posts.map( (post)=>{
      if(post.media.media_type =='picture'){
        post.media.url = get_Picture_Url(post?.media?.url)
      } else if(post.media.media_type =='video'){
        post.media.url = get_video_url(post?.media?.url)
      } else{

      }
      return post
    })
    return res.json({ posts, success: true })
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ err: "server error", success: false })

  }
}

module.exports = post_controller
