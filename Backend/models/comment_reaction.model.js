const mongoose = require("../config/connect-mongo").mongoose;

const Comment_reaction_schema = new mongoose.Schema(
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
    commentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      required: true,
    },
  },
  { timestamps: true }
);

const CommentReaction = mongoose.model(
  "CommentReaction",
  Comment_reaction_schema
);

module.exports = CommentReaction;
