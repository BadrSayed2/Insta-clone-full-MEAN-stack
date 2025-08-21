const express = require('express');
const user_controller = require('../controllers/user.controller');
const authenticate = require('../middlewares/authenticate.middleware');
const router = express.Router();


// router.get('/' , (req,res)=>{
//     res.json({message : "Hello"})
// })
router.get('/' , authenticate , user_controller.get_profile)
router.post('/verify_otp',user_controller.verify_otp)
module.exports = router