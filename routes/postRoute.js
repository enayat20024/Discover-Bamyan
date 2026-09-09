const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../Middleware/authorization");
// const postController = require("../controllers/postController");
const {
  getAllPosts,
  createPost,
  getPostById,
  getMyPosts,
  deletePost,
  getAllPostsForAdmin,
  deleteStoryByAdmin,
} = require("../controllers/postController");

router.get("/", getAllPosts);
router.get("/my-posts", isAuthenticated, getMyPosts);
router.get("/post/:postId", getPostById);
router.delete("/post/:id", isAuthenticated, deletePost);
router.delete("/delete-post/:id", isAuthenticated, deleteStoryByAdmin);
router.post("/post", isAuthenticated, createPost);
router.get("/posts", isAuthenticated, getAllPostsForAdmin);

module.exports = router;
