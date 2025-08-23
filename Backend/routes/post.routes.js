const express = require('express');
const post_controller = require('../controllers/post.controller');
const authenticate = require('../middlewares/authenticate.middleware');
const upload = require('../config/multer.config');
const router = express.Router();

router.post('/',
    authenticate,
    upload.fields([
        { name: "post_video", maxCount: 1 },
        { name: "post_pic", maxCount: 1 },
    ]), post_controller.add_post_handler)



router.post('/comment/:post_id', authenticate, post_controller.comment_post)

router.post('/feed', authenticate, post_controller.feed_posts)

router.put('/:post_id', authenticate,
    upload.fields([
        { name: "post_video", maxCount: 1 },
        { name: "post_pic", maxCount: 1 },
    ]), post_controller.update_post_handler)

module.exports = router