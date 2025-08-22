const apiError = require("../utils/api-error");
const logger = require("../utils/logger");

const sendErrorForDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
    timestamp: new Date().toLocaleString(),
    path: res.req?.originalUrl,
    method: res.req?.method,
    header: res.req?.headers,
  });
};

const sendErrorForProd = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.isOperational ? err.message : "Something went wrong!",
    timestamp: new Date().toISOString(),
  });
};

// Global error handler middleware
const globalError = (err, req, res, next) => {
  // Set default values
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // Log error details with winston logger
  const errorDetails = {
    name: err.name,
    message: err.message,
    statusCode: err.statusCode,
    path: req.originalUrl,
    method: req.method,
    ip: req.ip || req.connection.remoteAddress,
    userId: req.user?.id || "anonymous",
    timestamp: new Date().toISOString(),
  };

  // Log based on error severity
  if (err.statusCode >= 500) {
    logger.error("Server Error:", {
      ...errorDetails,
      stack: err.stack,
      body: req.body,
      params: req.params,
      query: req.query,
    });
  } else if (err.statusCode >= 400) {
    logger.warn("Client Error:", errorDetails);
  } else {
    logger.info("Request Error:", errorDetails);
  }

  if (process.env.NODE_ENV === "development") {
    sendErrorForDev(err, res);
  } else {
    // Only handle unexpected errors, don't transform known errors
    let error = { ...err };
    error.message = err.message;
    if (!error.isOperational) {
      logger.error("Unexpected Error:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
        url: req.originalUrl,
        userId: req.user?.id || "anonymous",
      });
      error = new apiError("Something went wrong!", 500);
    }
    sendErrorForProd(error, res);
  }
};

// Handle 404 errors for undefined routes
const handleNotFound = (req, res, next) => {
  logger.warn("Route Not Found:", {
    path: req.originalUrl,
    method: req.method,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get("User-Agent"),
    userId: req.user?.id || "anonymous",
  });
  const error = new apiError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};

module.exports = { globalError, handleNotFound };
