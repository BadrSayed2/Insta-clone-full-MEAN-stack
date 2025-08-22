const multer = require("multer");
const path = require("path");
const fs = require("fs");

// File filters
const vedioTypes = [".mp4", ".mov"];
const imageTypes = [".jpg", ".jpeg", ".png"];

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let subFolder = "others";

        if (file.fieldname === "post_pic") {
            subFolder = `post_pics`;
        } else if (file.fieldname === "profile") {
            subFolder = `profiles`;
        } else if (file.fieldname === "post_video") {
            subFolder = `post_videos`;
        }

        const folderPath = path.join("uploads", subFolder);

        fs.mkdirSync(folderPath, { recursive: true });
        cb(null, folderPath);
    },

    filename: function (req, file, cb) {

        const ext = path.extname(file.originalname);
        const name = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
        cb(null, name);
    },
});

// File filter: Only allow certain types
const fileFilter = function (req, file, cb) {

    const ext = path.extname(file.originalname).toLowerCase();

    if (file.fieldname === "post_video" && vedioTypes.includes(ext)) {
        cb(null, true);
    } else if ((file.fieldname === "profile" || file.fieldname === "post_pic") && imageTypes.includes(ext)) {
        cb(null, true);
    } else {
        // cb(new Error("File type not allowed"), false);
        cb(null, false); // reject بدون error
        req.fileValidationError = "File type not allowed";
    }
};

// File size limits
const limits = {
    fileSize: 50 * 1024 * 1024, // max 50MB per file
};

const upload = multer({
    storage,
    fileFilter,
    limits,
});

module.exports = upload;