const mongoose = require("mongoose");
const path = require("path");
const logger = require("../utils/logger");

const connect_to_mongodb = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      logger.info("Database Connected");
    })
    .catch((err) => {
      logger.error(`Database Connection Failed: ${err?.message || ""}`);
    });
};

module.exports = { connect_to_mongodb, mongoose };
