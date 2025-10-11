const mongoose = require("../config/connect-mongo").mongoose;
const slugify = require("slugify");

const locationSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  region: {
    type: String,
    required: true,
  },
  timezone: {
    type: String,
    required: true,
  },
});

const deviceSchema = new mongoose.Schema({
  browserName: String,
  browserVersion: String,

  deviceType: String,
  deviceModel: String,

  osName: String,
  osVersion: String,
});

const sessionSchema = new mongoose.Schema({
  refreshToken: {
    type: String,
    required: true,
    default: "",
    select: false,
  },
  device: {
    type: deviceSchema,
    required: true,
  },
  ip: {
    type: String,
    required: true,
  },
  location: {
    type: locationSchema,
    required: true,
  },
  expires: {
    type: Date,
    required: true,
  },
});
const user_schema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 2,
    },
    lastName: {
      type: String,
      required: true,
      minlength: 2,
    },
    fullName: {
      type: String,
      required: true,
      minlength: 2,
    },
    userName: {
      type: String,
      required: true,
      minlength: 2,
      unique: true,
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

    bio: {
      type: String,
      maxlength: 160,
      default: null,
    },

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
    followCount: {
      type: Number,
      default: 0,
    },
    followingCount: {
      type: Number,
      default: 0,
    },
    postsCount: {
      type: Number,
      default: 0,
    },
    sessions: {
      type: [sessionSchema],
      default: null,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);
// slugify username
user_schema.pre("save", function (next) {
  this.userName = slugify(this.userName, { lower: true });
  next();
});
const User = mongoose.model("User", user_schema);

module.exports = User;
