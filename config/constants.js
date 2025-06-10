/**
 * Application Constants
 * Centralized configuration constants for the application
 */

module.exports = {
  // JWT Configuration
  JWT: {
    SECRET: process.env.JWT_SECRET || "randomString",
    EXPIRES_IN: process.env.JWT_EXPIRES_IN || "2days",
  },

  // File upload limits
  UPLOAD_LIMITS: {
    IMAGE_SIZE: 1000000, // 1MB
    MODEL_SIZE: 100000000, // 100MB
  },

  // Allowed file extensions
  ALLOWED_EXTENSIONS: {
    IMAGES: ['png', 'jpg', 'jpeg'],
    MODELS: ['pt', 'ptl', 'pth'],
  },

  // HTTP Status codes
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
  },

  // Upload directories
  UPLOAD_DIRS: {
    IMAGES: 'images',
    MODELS: 'modelsPytorch',
  },
};
