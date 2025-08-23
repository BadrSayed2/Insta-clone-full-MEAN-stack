const path = require('path')

const User = require('../models/post.model')
const Post = require('../models/post.model')

const Comment = require('../models/comment.model')

const upload_image = require('../utils/upload_image.util')
const deleteFile = require('../utils/delete_image.util')
const post_controller = {}

post_controller.add_post_handler = async (req, res) => {
    if (req.fileValidationError) {
        return res.status(400).json({ err: req.fileValidationError, success: false });
    }

    const user_id = req.user_id
    const new_post = req?.body
    // console.log(new_post);

    const video = req.files["post_video"] ? req.files["post_video"][0] : null;
    const pic = req.files["post_pic"] ? req.files["post_pic"][0] : null;

    if (!video && !pic) {
        return res.status(400).json({
            err: "You must upload either a video or a picture."
            , success: false
        });
    }

    let media_path_arr = ["uploads"]
    let media_type = ""
    let cloudinary_path = ""
    try {
        if (pic) {
            console.log(pic);

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

        const media_path = path.join(...media_path_arr)

        const result = await upload_image(media_path, cloudinary_path, media_type)
        if (!result) {
            return res.stauts(400).json({ err: "could not upload your file", success: false })
        }
        new_post.media = {
            url: result.filename,
            media_type
        }

        new_post.user_id = user_id

        await Post.create({
            ...new_post,
        })

        res.json({ message: "post added successfully", success: true })
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ err: "server error please try again", success: false })
    }

}

post_controller.update_post_handler = async (req, res) => {
    if (req.fileValidationError) {
        return res.status(400).json({ err: req.fileValidationError, success: false });
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
    } catch (e) {
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
        const post = await Post.findById(post_id).lean()
        if (post.user_id != user_id) {
            return res.status(401).json({ err: "this is not your post MF", success: false })
        }

        await Comment.create({
            post_id,
            user_id,
            content: comment,
        })

        res.status(201).json({ message: "comment is created successfully", success: true })
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ err: "server error please try again", success: false })

    }
}

post_controller.feed_posts = async (req, res) => {
    try{

    const user_id = req?.user_id
    const following = await Follower.find({ user: user_id }).select('followed -_id');
    const followingIds = following.map(f => f.followed);

    const posts = await Post.find({ user_id: { $in: followingIds } })
        .sort({ createdAt: -1 })
        .limit(limit)
        .select("-user_id")
        .populate({
            path: 'user_id',
            select: 'userName fullName profile_pic accessabilty',
        })
        .lean();

        return res.json({posts , success :true})
    }catch(e){
        console.log(e.message);
        return res.status(500).json({err : "server error", success:false})
        
    }
}

module.exports = post_controller