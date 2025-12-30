import express from "express";
import {
  Register,
  Login,
  Logout,
  getUsers,
  getUsersById,
  getUsersByUsername,
  deleteUser,
} from "../controllers/UsersControllers.js";
import upload from "../config/multer.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/v1/users", getUsers);
router.get("/v1/users/:id", getUsersById);
router.delete("/v1/users/:id", deleteUser);
router.get("/v1/users/username/:username", getUsersByUsername);
router.post("/auth/register", upload.single("file"), Register);
router.post("/auth/login", Login);
router.delete("/auth/logout", Logout);

export default router;
