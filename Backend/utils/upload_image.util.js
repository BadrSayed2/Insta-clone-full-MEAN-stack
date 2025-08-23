const cloudinary = require('../config/cloudinary.config')

const uploadImage = async (imagePath, cloudinary_path , type = null) => {

  // Use the uploaded file's name as the asset's public ID and 
  // allow overwriting the asset with new versions
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
    folder: `insta/${cloudinary_path}`
  };

  if(type && type == "video"){
    options = {
      ...options,
      resource_type: "video"
    }
  }

  try {
    // Upload the image
    const result = await cloudinary.uploader.upload(imagePath, options);
    // console.log(result);
    return result.public_id;
  } catch (error) {
    return false
    // console.error(error);
  }
};

// uploadImage('./صورة للمعلم.webp' , 'post_pics')
module.exports = uploadImage