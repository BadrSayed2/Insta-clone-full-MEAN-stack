const jwt = require('jsonwebtoken')
const dotenv =require('dotenv')
const user_model = require('../models/user.model')

dotenv.config()

const authenticate = (req,res,next)=>{
    const token = req.headers['authentication'].split(' ')[1]
    if(!token){
        return res.status(401).json({err : "you need to login"})
    }
    const user = jwt.verify(token , process.env.JWT_SECRET)
    const found_user = user_model.findById(user.userId)
    if(!found_user){
        return res.status(401).json({err : "you need to login"})
    }
    req.user_id = user.userId
    next()
}

module.exports = authenticate