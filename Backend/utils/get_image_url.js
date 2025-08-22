const cloudinary = require('../config/cloudinary.config')

function get_Picture_Url(publicId, type = 'profile') {
    let dimensions
    let crop ;
    let gravity;

    if (type == 'profile') {
        dimensions = { width: 200, height: 200 };
        crop = "thumb"
        gravity = "face"
    } else if (type == 'post') {
        dimensions.width = 1200
        crop = "fill"
        gravity = "auto"
    }

    return cloudinary.url(publicId, {
        transformation: [
            { ...dimensions, crop, gravity },
            { quality: "auto" },
            { fetch_format: "auto" }
        ]
    });
    
}

console.log(get_Picture_Url("insta/post_pics/1755713990534-907785721"));

module.exports = get_Picture_Url
