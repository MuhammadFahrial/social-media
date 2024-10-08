import express from "express";
import {
  getPosts,
  createPosts,
  deletePosts,
  updatePosts,
  createComments,
} from "../controllers/PostsControllers.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/v1/posts", getPosts);
router.post("/v1/posts", verifyToken, createPosts);
router.patch("/v1/posts/:id", verifyToken, updatePosts);
router.delete("/v1/posts/:id", verifyToken, deletePosts);

router.post("/v1/posts/comments/:id", verifyToken, createComments);

export default router;
