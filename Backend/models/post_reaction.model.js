const mongoose = require("../config/connect-mongo").mongoose;

const post_reaction_schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reaction: {
      type: String,
      enum: ["like", "love", "angry", "sad"],
      required: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  { timestamps: true }
);

const PostReaction = mongoose.model("PostReaction", post_reaction_schema);

module.exports = PostReaction;
