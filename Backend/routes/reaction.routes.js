const router = require("express").Router();
const { toggleReaction } = require("../controllers/react.controller.js");
const authenticate = require("../middlewares/auth-middleware.js");
router.use(authenticate);
router.post("/toggle", toggleReaction);
module.exports = router;
