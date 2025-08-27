const mongoose = require("../config/connect-mongo").mongoose;

const refresh_token_schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

refresh_token_schema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 100 * 24 * 60 * 60 }
);

const RefreshToken = mongoose.model("RefreshToken", refresh_token_schema);

module.exports = RefreshToken;
