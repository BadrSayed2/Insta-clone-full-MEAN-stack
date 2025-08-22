const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const fs = require('fs')
const user_model = require('../models/user.model')

dotenv.config()
const auth_public_key = fs.readFileSync('./keys/auth/auth_public_key.pem', 'utf-8')
const auth_private_key = fs.readFileSync('./keys/auth/auth_private_key.pem', 'utf-8')

const authenticate = (req, res, next) => {
    const token = req?.cookies['authentication']
    if (!token) {
        return res.status(401).json({ err: "you need to login" })
    }
    const user = jwt.verify(token, auth_public_key, { algorithms: "RS256" })
    // const found_user = user_model.findById(user.userId)
    let found_user;
    if(user?.user_id){
        found_user = user_model.findById(user?.user_id)
    }else{
        return res.status(401).json({ err: "you need to login" })
    }

    if (!found_user) {
        return res.status(401).json({ err: "you need to login" })
    }
    req.user_id = user.user_id
    next()
}

module.exports = authenticate