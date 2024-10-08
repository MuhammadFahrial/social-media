import express from "express";
import {
  Register,
  Login,
  Logout,
  getUsers,
} from "../controllers/UsersControllers.js";

const router = express.Router();

router.get("/v1/users", getUsers);
router.post("/auth/register", Register);
router.post("/auth/login", Login);
router.delete("/auth/logout", Logout);

export default router;
