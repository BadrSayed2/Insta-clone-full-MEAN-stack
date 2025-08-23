const mongoose = require("mongoose");
const logger = require("../utils/logger");

const connect_to_mongodb = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      logger.info("Database Connected");
    })
    .catch((e) => {
      logger.error(`Database Connection Failed: ${e?.message || ""}`);
    });
};

module.exports = { connect_to_mongodb, mongoose };
