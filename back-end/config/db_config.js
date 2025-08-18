const mongoose = require('mongoose');
const connect_to_mongodb = ()=>{
    mongoose.connect(process.env.MONGO_URL )
    .then(()=>{console.log("database connectd")})
    .catch(()=>{
        // console.log("database connection failed");
        error_logger.error("error log :" + e.message)
    })
}

module.exports = {connect_to_mongodb , mongoose}