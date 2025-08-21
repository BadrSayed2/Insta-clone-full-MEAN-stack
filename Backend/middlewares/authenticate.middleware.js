const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const user_model = require('../models/user.model')

dotenv.config()

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization']
    if (!authHeader) {
      return res.status(401).json({ err: "No token provided" })
    }
    
    const token = authHeader.split(' ')[1]
    if (!token) {
        return res.status(401).json({ err: "Invalid token format" })
    }
    
    const user = jwt.verify(token, process.env.JWT_SECRET)
    
    const found_user = await user_model.findById(user.id)
    if (!found_user) {
      return res.status(401).json({ err: "User not found" })
    }

    // 👇 خلي الاسم userId عشان يمشي مع الكنترولر
    req.user = { id: user.id }

    next()
  } catch (error) {
    return res.status(401).json({ err: "Invalid token", details: error.message })
  }
}

module.exports = authenticate
