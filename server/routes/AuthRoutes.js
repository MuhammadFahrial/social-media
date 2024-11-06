import express from "express";
import {
  Register,
  Login,
  Logout,
  getUsers,
  getUsersById,
  getUsersByUsername,
} from "../controllers/UsersControllers.js";

const router = express.Router();

router.get("/v1/users", getUsers);
router.get("/v1/users/:id", getUsersById);
router.get("/v1/users/username/:username", getUsersByUsername);
router.post("/auth/register", Register);
router.post("/auth/login", Login);
router.delete("/auth/logout", Logout);

export default router;
