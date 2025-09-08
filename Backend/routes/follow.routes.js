// /**
//  * Follow system REST design (relationship = currentUser -> targetUser)
//  *
//  * CREATE FOLLOW
//  *   POST   /follows                 Body: { targetUserId }
//  *
//  * DELETE (UNFOLLOW)
//  *   DELETE /follows/:targetUserId
//  *
//  * AUTH USER LISTS (self)
//  *   GET    /follows/me/following    ?cursor=&limit=
//  *   GET    /follows/me/followers    ?cursor=&limit=
//  *
//  * OTHER USER LISTS (public or gated by privacy)
//  *   GET    /follows/:userId/following  ?cursor=&limit=
//  *   GET    /follows/:userId/followers  ?cursor=&limit=
//  *
//  * RELATIONSHIP BATCH CHECK
//  *   GET    /follows/relationships?userIds=id1,id2,id3   (returns map { userId: { following: bool, followedBy: bool } })
//  *
//  * SUGGESTIONS (who to follow)
//  *   GET    /follows/suggestions?cursor=&limit=
//  *
//  * NOTES:
//  * - cursor = opaque (e.g., last ObjectId or createdAt). limit default 20, max 50.
//  * - All modifying endpoints require auth.
//  * - Consider rate limiting POST/DELETE.
//  * - Ensure unique compound index on (followerId, targetUserId).
//  */

// const express = require("express");
// const authenticate = require("../middlewares/auth-middleware.js");

// const {
//   followUser, // POST /follows
//   unfollowUser, // DELETE /follows/:targetUserId
//   listMyFollowing, // GET /follows/me/following
//   listMyFollowers, // GET /follows/me/followers
//   listUserFollowing, // GET /follows/:userId/following
//   listUserFollowers, // GET /follows/:userId/followers
//   getRelationships, // GET /follows/relationships
//   getFollowSuggestions, // GET /follows/suggestions
// } = require("../controllers/follow.controller.js");

// const router = express.Router();

// // All routes require auth (adjust if you want public follower lists)
// router.use(authenticate);

// // Create follow
// router.post("/", followUser);

// // Unfollow
// router.delete("/:targetUserId", unfollowUser);

// // Auth user lists
// router.get("/me/following", listMyFollowing);
// router.get("/me/followers", listMyFollowers);

// // Other user lists (place before generic params that might shadow)
// router.get("/:userId/following", listUserFollowing);
// router.get("/:userId/followers", listUserFollowers);

// // Batch relationship check
// router.get("/relationships", getRelationships);

// // Suggestions
// router.get("/suggestions", getFollowSuggestions);

// module.exports = router;

const router = require("express").Router();
const authenticate = require("../middlewares/auth-middleware.js");
router.use(authenticate);
const {
  followUser,
  unfollowUser,
} = require("../controllers/follow.controller.js");
router.post("/", followUser);
router.delete("/:targetUserId", unfollowUser);
module.exports = router;
