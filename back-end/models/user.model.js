const mongoose = (require('../config/db_config')).mongoose

// module.exports = mongoose.Model
const User = new mongoose.Schema({
    user_name:{}
})

module.exports = user_schema;