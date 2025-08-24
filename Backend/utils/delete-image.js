const cloudinary = require('../config/cloudinary.config')

const deleteFile = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        console.log('File deleted successfully:', result);
        return true
    } catch (error) {
        console.error('Error deleting file:', error);
        return false
    }
};

module.exports = deleteFile