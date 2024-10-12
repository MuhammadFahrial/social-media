import express from "express";
import {
  getComments,
  createComments,
  getCommentByPostId,
  deleteComments,
  updateComments,
} from "../controllers/CommentsControllers.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/v1/comments", getComments);
router.get("/v1/comments/:postId", getCommentByPostId);
router.post("/v1/comments/:id", verifyToken, createComments);
router.patch("/v1/comments/:id", verifyToken, updateComments);
router.delete("/v1/comments/:id", verifyToken, deleteComments);

export default router;
