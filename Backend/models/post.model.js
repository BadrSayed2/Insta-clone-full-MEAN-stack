const mongoose = require("../config/connect-mongo").mongoose;

const post_schema = new mongoose.Schema(
  {
    caption: String,
    media: {
      url: String,
      media_type: {
        type: String,
        enum: ["video", "picture"],
        required: true,
      },
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    commentsNumber: {
      type: Number,
      default: 0,
    },
    privacy: {
      type: String,
      enum: ["public", "private", "followers"],
      default: "public",
    },
  },

  { timestamps: true }
);

const Post = mongoose.model("Post", post_schema);

module.exports = Post;
