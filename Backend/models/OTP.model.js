const mongoose = (require('../config/db_config')).mongoose

const OTP_schema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    code : {
        type : String,
        required:true,
        minlength: 8,
        maxlength: 8,
    },

}, { timestamps: true  })

OTP_schema.index(
    { createdAt: 1 },
    { expireAfterSeconds: 5 * 60 }
);
const OTP = mongoose.model('OTP', OTP_schema)

module.exports = OTP;
