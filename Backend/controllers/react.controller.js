const Comment = require("../models/comment.model");
const Follower = require("../models/follower.model");
const Post = require("../models/post.model");
const ReactionModel = require("../models/Reaction.model");
const ApiResponse = require("../utils/api-response");
const apiError = require("../utils/apiError");
const apiResponse = require("../utils/apiResponse");

const reactToComment = async (req, res, next) => {
    try {
        const user_id = req?.user?.id
        const commentId = req?.comment;
        const reaction_type = req.body.reaction;
        // console.log(req.user);
        if (!commentId) {
            return next(new apiError("no comment found", 404));
        }
        const comment = await Comment.findById(commentId).lean()
        const post = await Post.findById(comment.postId).populate("userId", "userName").lean()
        if(!comment || !post){
            return next(new apiError("nonFound", 404));
        }
        if (post.privacy === "private") {
            return next(new apiError("unauthorized", 401));
        } else if (post.privacy == "followers") {
            const isFollower = await Follower.find({ user: user_id, followed: post.userId }).lean()
            if (isFollower.length <= 0) {
                return next(new apiError("you must follow " + post.userId.userName + " to view this", 401));
            }
        }

        const reaction = await ReactionModel.findOne({ user: user_id, targetType: "Comment", targetId: comment._id })
        let message = ""
        let status_code = 100;
        if (reaction) {
            if (reaction_type == reaction.type || reaction_type == "unract") {
                await ReactionModel.deleteOne({ _id: reaction._id })
                status_code = 200;
                message = "reaction removed successfully"
            } else {
                reaction.type = reaction_type
                await reaction.save()
                status_code = 201;
                message = "reaction updated successfully"
            }
            
        } else {
            await ReactionModel.create({
                user : user_id,
                type : reaction_type,
                targetType : "Comment",
                targetId : commentId
            })
            status_code = 201;
            message = "reaction created successfully"
            
        }
        return res
            .status(status_code)
            .json(
                new ApiResponse({ message })
            );
    } catch (e) {
        return next(new apiError(e.message, 500));
    }


}

module.exports = { reactToComment }