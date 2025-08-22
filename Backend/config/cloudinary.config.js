const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
/**
CLOUDINARY_NAME = "dbatj7huc"
CLOUDINARY_API_KEY = "341945963128522"
CLOUDINARY_API_SECRET = "Fov-InqaI2bw3MwfvTux584qPcc" */
dotenv.config();
// Return "https" URLs by setting secure: true
cloudinary.config({
  secure: true,
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = cloudinary;