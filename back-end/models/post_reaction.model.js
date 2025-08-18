const mongoose = (require('../config/db_config')).mongoose

const post_reaction_schema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reaction: {
        type: String,
        enum: ['like', 'love', 'angry', 'sad'],
        required: true,

    },
    post_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    }

}, { timestamps: true })

const PostReaction = mongoose.model('PostReaction', post_reaction_schema)

module.exports = PostReaction;
