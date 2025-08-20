const User = require('../models/post.model')
const Post = require('../models/post.model')
const post_controller = {}

post_controller.add_post_handler = async (req, res) => {
    const user_id = req.user_id
    const user = await User.findById(user_id)

    const new_post = req?.body


    
}

module.exports = post_controller