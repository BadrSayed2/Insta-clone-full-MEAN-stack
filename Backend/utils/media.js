const cloudinary = require("../config/cloudinary.config");

function getImageUrl(publicId, variant = "profile", options = {}) {
  const transformation = [];
  if (variant === "profile") {
    transformation.push({
      width: 200,
      height: 200,
      crop: "thumb",
      gravity: "faces",
    });
  } else if (variant === "post") {
    transformation.push({ width: 1200, crop: "fill", gravity: "auto" });
  }
  transformation.push({ quality: "auto" }, { fetch_format: "auto" });

  return cloudinary.url(publicId, { transformation, ...options });
}

function getVideoUrl(publicId, options = {}) {
  return cloudinary.url(publicId, {
    resource_type: "video",
    quality: "auto",
    fetch_format: "auto",
    ...options,
  });
}

async function uploadAsset(filePath, folder, mediaType = "image") {
  try {
    const opts = {
      use_filename: true,
      unique_filename: false,
      overwrite: true,
      folder: `insta/${folder}`,
      resource_type: mediaType === "video" ? "video" : "image",
    };
    const result = await cloudinary.uploader.upload(filePath, opts);
    return result.public_id;
  } catch (error) {
    return false;
  }
}

async function deleteAsset(publicId, mediaType = "image") {
  try {
    const opts = mediaType === "video" ? { resource_type: "video" } : {};
    const result = await cloudinary.uploader.destroy(publicId, opts);
    // cloudinary returns { result: 'ok' } or 'not_found'
    return (
      !!result && (result.result === "ok" || result.result === "not_found")
    );
  } catch (error) {
    return false;
  }
}

module.exports = {
  getImageUrl,
  getVideoUrl,
  uploadAsset,
  deleteAsset,
};
