const mongoose = require("../config/db_config").mongoose;

const user_schema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      minlength: 2,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
      minlength: 2,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    accessability: {
      type: String,
      enum: ["private", "public"],
      default: "public",
    },
    profile_pic: {
      public_id: { type: String, default: null },
      url: {
        type: String,
        default:
          "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-vector-600nw-1745180411.jpg",
      },
    },

    bio: String,

    gender: {
      type: String,
      enum: ["male", "female"],
      default: "male",
    },

    phoneNumber: String,
    date_of_birth: {
      type: Date,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

const User = mongoose.model("User", user_schema);

module.exports = User;
