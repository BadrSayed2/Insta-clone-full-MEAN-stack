const { reactToComment } = require("../controllers/react.controller");
const authenticate = require("../middlewares/auth-middleware");

const router = require("express").Router();

router.post('/:comment/react', authenticate , reactToComment)
router.post('/:comment/unreact')