const app = require("./app");
const logger = require("./utils/logger");
const { connectMongo } = require("./config/connect-mongo");

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectMongo(); // Connect DB first

    app.listen(PORT, () => {
      logger.info(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    logger.error("❌ Failed to start server:", err.message);
    process.exit(1); // Exit so container / process manager restarts
  }
}

startServer();
