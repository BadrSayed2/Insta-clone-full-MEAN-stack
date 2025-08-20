const express = require('express');
const post_controller = require('../controllers/post.controller');
const authenticate = require('../middlewares/authenticate.middleware');
const router = express.Router();

router.post('/post',authenticate,post_controller.add_post_handler)

module.exports = router