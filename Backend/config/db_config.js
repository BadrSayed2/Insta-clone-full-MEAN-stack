const mongoose = require("mongoose");
const path = require("path");

const connect_to_mongodb = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("Database Connected");
    })
    .catch(() => {
      console.log("Database Connection Failed");
    });
};

module.exports = { connect_to_mongodb, mongoose };
