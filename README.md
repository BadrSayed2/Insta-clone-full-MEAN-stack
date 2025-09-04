# Insta-clone-full-MEAN-stack

this is a insta-clone project done as a Capstone project in the NTI CREATIVA MEAN stack course

==============Zakaria==============

## ✅ Completed Features

- User Signup (with email & password).
- User Login (JWT authentication).
- Confirm Email (using token sent by email).
- Created Get Posts page.
- Created Get User page.
- Created Added follow page.# Instagram Clone API Routes Structure

Based on our discussion, here are the route files you should create for your Instagram clone:

## 📁 Route Files Structure

```
routes/
├── auth.routes.js
├── users.routes.js
├── posts.routes.js
├── comments.routes.js
├── likes.routes.js
├── follows.routes.js
├── stories.routes.js
├── messages.routes.js
├── explore.routes.js
└── index.js (optional)
```

## 🔐 1. auth.routes.js

```javascript
const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  verifyEmail,
} = require("../controllers/authController");
const { auth } = require("../middlewares/auth");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", auth, logout);
router.post("/refresh-token", refreshToken);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/verify-email/:token", verifyEmail);
router.get("/me", auth, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
```

## 👥 2. users.routes.js

```javascript
const express = require("express");
const router = express.Router();
const {
  getProfile,
  updateProfile,
  searchUsers,
  getUserStats,
  getSuggestedUsers,
} = require("../controllers/userController");
const { auth } = require("../middlewares/auth");
const upload = require("../middlewares/upload");

router.get("/me", auth, getProfile);
router.patch("/me", auth, upload.single("avatar"), updateProfile);
router.get("/search", auth, searchUsers);
router.get("/suggested", auth, getSuggestedUsers);
router.get("/:username", auth, getProfile);
router.get("/:username/stats", auth, getUserStats);

module.exports = router;
```

## 📸 3. posts.routes.js

```javascript
const express = require("express");
const router = express.Router();
const {
  createPost,
  getFeed,
  getPost,
  updatePost,
  deletePost,
  getUserPosts,
  explorePosts,
} = require("../controllers/postController");
const { auth } = require("../middlewares/auth");
const upload = require("../middlewares/upload");

router.post("/", auth, upload.array("media", 10), createPost);
router.get("/feed", auth, getFeed);
router.get("/explore", auth, explorePosts);
router.get("/:postId", auth, getPost);
router.patch("/:postId", auth, upload.array("media", 10), updatePost);
router.delete("/:postId", auth, deletePost);
router.get("/user/:username", auth, getUserPosts);

module.exports = router;
```

## 💬 4. comments.routes.js

```javascript
const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  createComment,
  getComments,
  updateComment,
  deleteComment,
} = require("../controllers/commentController");
const { auth } = require("../middlewares/auth");

router.post("/", auth, createComment);
router.get("/", auth, getComments);
router.patch("/:commentId", auth, updateComment);
router.delete("/:commentId", auth, deleteComment);

module.exports = router;
```

## ❤️ 5. likes.routes.js

```javascript
const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  likePost,
  unlikePost,
  getLikes,
  getLikedPosts,
} = require("../controllers/likeController");
const { auth } = require("../middlewares/auth");

router.post("/", auth, likePost);
router.delete("/", auth, unlikePost);
router.get("/", auth, getLikes);
router.get("/me/liked", auth, getLikedPosts);

module.exports = router;
```

## 🤝 6. follows.routes.js

```javascript
const express = require("express");
const router = express.Router();
const {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
} = require("../controllers/followController");
const { auth } = require("../middlewares/auth");

router.post("/:username", auth, followUser);
router.delete("/:username", auth, unfollowUser);
router.get("/:username/followers", auth, getFollowers);
router.get("/:username/following", auth, getFollowing);

module.exports = router;
```

## 🎬 7. stories.routes.js

```javascript
const express = require("express");
const router = express.Router();
const {
  createStory,
  getStories,
  getStory,
  deleteStory,
  viewStory,
} = require("../controllers/storyController");
const { auth } = require("../middlewares/auth");
const upload = require("../middlewares/upload");

router.post("/", auth, upload.single("media"), createStory);
router.get("/feed", auth, getStories);
router.get("/:storyId", auth, getStory);
router.delete("/:storyId", auth, deleteStory);
router.post("/:storyId/view", auth, viewStory);

module.exports = router;
```

## 💌 8. messages.routes.js

```javascript
const express = require("express");
const router = express.Router();
const {
  getConversations,
  getConversation,
  sendMessage,
  deleteMessage,
} = require("../controllers/messageController");
const { auth } = require("../middlewares/auth");
const upload = require("../middlewares/upload");

router.get("/", auth, getConversations);
router.get("/:userId", auth, getConversation);
router.post("/:userId", auth, upload.array("media", 5), sendMessage);
router.delete("/:messageId", auth, deleteMessage);

module.exports = router;
```

## 🔍 9. explore.routes.js

```javascript
const express = require("express");
const router = express.Router();
const {
  explorePosts,
  exploreTags,
  exploreUsers,
} = require("../controllers/exploreController");
const { auth } = require("../middlewares/auth");

router.get("/posts", auth, explorePosts);
router.get("/tags/:tag", auth, exploreTags);
router.get("/users", auth, exploreUsers);

module.exports = router;
```

## 🏗️ Main app.js setup

```javascript
const express = require("express");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/users.routes");
const postRoutes = require("./routes/posts.routes");
const commentRoutes = require("./routes/comments.routes");
const likeRoutes = require("./routes/likes.routes");
const followRoutes = require("./routes/follows.routes");
const storyRoutes = require("./routes/stories.routes");
const messageRoutes = require("./routes/messages.routes");
const exploreRoutes = require("./routes/explore.routes");

const app = express();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/posts/:postId/comments", commentRoutes);
app.use("/api/posts/:postId/likes", likeRoutes);
app.use("/api/follows", followRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/explore", exploreRoutes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

module.exports = app;
```

## 🔑 Key Features of This Structure:

1. **RESTful Design**: Clean, predictable endpoints following REST principles
2. **Proper Nesting**: Comments and likes nested under posts
3. **Separation of Concerns**: Each resource has its own route file
4. **Authentication**: All protected routes use auth middleware
5. **File Uploads**: Support for media uploads where needed
6. **Instagram Features**: Includes all core Instagram functionality
7. **Scalable Structure**: Easy to add new features and endpoints

This structure follows industry best practices and will provide a solid foundation for your Instagram clone API.
