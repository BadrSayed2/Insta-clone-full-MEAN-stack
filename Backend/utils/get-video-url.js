function get_video_url(publicId) {
  return cloudinary.url(publicId, {
    resource_type: "video",
    quality: "auto",
    fetch_format: "auto",
  });
}

module.exports = get_video_url;
