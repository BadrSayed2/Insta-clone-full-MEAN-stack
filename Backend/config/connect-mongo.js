const mongoose = require("mongoose");
const logger = require("../utils/logger");

const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    logger.info("✅ Connected to MongoDB");
  } catch (err) {
    logger.error(`Database Connection Failed: ${err?.message || ""}`);
    throw err;
  }
};

module.exports = { connectMongo, mongoose };
