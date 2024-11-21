import express from "express";
import {
  getPosts,
  getPostsById,
  createPosts,
  deletePosts,
  updatePosts,
} from "../controllers/PostsControllers.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/v1/posts", getPosts);
router.get("/v1/posts/:id", getPostsById);
router.post("/v1/posts", verifyToken, createPosts);
router.patch("/v1/posts/:id", verifyToken, updatePosts);
router.delete("/v1/posts/:id", verifyToken, deletePosts);

export default router;
