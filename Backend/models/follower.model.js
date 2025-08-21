const mongoose = require("../config/db_config").mongoose;

const OTP_schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    followed: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const OTP = mongoose.model("OTP", OTP_schema);

module.exports = OTP;
