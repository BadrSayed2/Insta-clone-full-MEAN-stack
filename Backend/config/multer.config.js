const multer = require("multer");
const path = require("path");
const fs = require("fs");
const fileType = require('file-type')

const videoTypes = ["video/mp4", "video/quicktime"];
const imageTypes = ["image/jpeg", "image/png", "image/gif"];

// const videoTypes = [".mp4", ".mov"];
// const imageTypes = [".jpg", ".jpeg", ".png"];


const storage = multer.memoryStorage();

const fileFilter = async function (req, file, cb) {
  try {
    const fileInfo = await fileType.fromBuffer(file.buffer);

    let allowedTypes;
    let fileIsAllowed = false;

    if (file.fieldname === "post_video") {
      allowedTypes = videoTypes;
    } else if (file.fieldname === "profile" || file.fieldname === "post_pic") {
      allowedTypes = imageTypes;
    } else {
      req.fileValidationError = "Unknown file fieldname";
      return cb(null, false);
    }

    if (fileInfo && allowedTypes.includes(fileInfo.mime)) {
      fileIsAllowed = true;
    } else {
      req.fileValidationError = "File type not allowed";
      return cb(null, false);
    }

    file.filename = `${(Date.now() + "-" + Math.round(Math.random() * 1e9))}.${fileInfo.ext}`;
    cb(null,true)
  } catch (e) {
    req.fileValidationError = "File validation failed";
    cb(null, false)
  }
}
const upload = multer({
  storage: storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024,
  }
});
//  
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     let subFolder = "others";

//     if (file.fieldname === "post_pic") {
//       subFolder = `post_pics`;
//     } else if (file.fieldname === "profile") {
//       subFolder = `profiles`;
//     } else if (file.fieldname === "post_video") {
//       subFolder = `post_videos`;
//     }

//     const folderPath = path.join("uploads", subFolder);

//     fs.mkdirSync(folderPath, { recursive: true });
//     cb(null, folderPath);
//   },

//   filename: function (req, file, cb) {
//     const ext = path.extname(file.originalname);
//     const name = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
//     cb(null, name);
//   },
// });

// // File filter: Only allow certain types
// const fileFilter = function (req, file, cb) {
//   const ext = path.extname(file.originalname).toLowerCase();

//   if (file.fieldname === "post_video" && videoTypes.includes(ext)) {
//     cb(null, true);
//   } else if (
//     (file.fieldname === "profile" || file.fieldname === "post_pic") &&
//     imageTypes.includes(ext)
//   ) {
//     cb(null, true);
//   } else {
//     cb(null, false);

//     req.fileValidationError = "File type not allowed";
//   }
// };

// // File size limits
// const limits = {
//   fileSize: 50 * 1024 * 1024,
// };

// const upload = multer({
//   storage,
//   fileFilter,
//   limits,
// });

module.exports = upload;
