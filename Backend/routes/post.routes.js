const express = require('express');
const post_controller = require('../controller/post.controller');
const authenticate = require('../middlewares/authenticate.middleware');
const upload = require('../config/multer.config');
const router = express.Router();

router.post('/',
    authenticate,
    upload.fields([
        { name: "post_video", maxCount: 1 },
        { name: "post_pic", maxCount: 1 },
    ]), post_controller.add_post_handler)

router.put('/:post_id', authenticate,
    upload.fields([
        { name: "post_video", maxCount: 1 },
        { name: "post_pic", maxCount: 1 },
    ]), post_controller.update_post_handler)
module.exports = router