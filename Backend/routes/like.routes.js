const {toggleReaction } = require("../controllers/react.controller");
const authenticate = require("../middlewares/auth-middleware");

const router = require("express").Router();

router.post('/comment/:comment/react', authenticate , toggleReaction)
router.post('/post/:Post/react', authenticate , toggleReaction)

module.exports = router;