const path = require('path')

const User = require('../models/post.model')
const Post = require('../models/post.model')

const upload_image = require('../utils/upload_image.util')
const post_controller = {}

post_controller.add_post_handler = async (req, res) => {
    if (req.fileValidationError) {
        return res.status(400).json({ err: req.fileValidationError,success : false });
    }

    const user_id = req.user_id
    const new_post = req?.body
    console.log(new_post);

    const video = req.files["post_video"] ? req.files["post_video"][0] : null;
    const pic = req.files["post_pic"] ? req.files["post_pic"][0] : null;

    if (!video && !pic) {
        return res.status(400).json({err : "You must upload either a video or a picture."
            ,success:false});
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
        
        const media_path = path.join( ...media_path_arr)

        const result = await upload_image(media_path, cloudinary_path, media_type)
        if(!result){
            return res.stauts(400).json({err : "could not upload your file" , success : false})
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

module.exports = post_controller