const mongoose = (require('../config/db_config')).mongoose

const OTP_schema = new mongoose.Schema({
    code : {
        type : String,
        required:true,
        minlength: 8,
        maxlength: 8,
    },

}, { timestamps: true  })

const OTP = mongoose.model('OTP', OTP_schema)

module.exports = OTP;
