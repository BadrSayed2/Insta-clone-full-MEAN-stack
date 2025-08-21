const express = require("express");
const authenticate = require("../middlewares/authenticate.middleware.js");
const { followUser } = require("../controller/follow.controller.js");

const followRouter = express.Router();

// Follow a user: POST /follow  with body { userIdToFollow }
followRouter.post("/", authenticate, followUser);

module.exports = followRouter;
