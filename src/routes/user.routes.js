import { Router } from "express";
import {
  register,
  getUsers,
  login,
  requestPasswordChange,
  changePassword,
  getUser,
} from "../controllers/user.controllers.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/request-password-change", requestPasswordChange);
router.post("/change-password", changePassword);
router.get("/get-all", getUsers);
router.get("/get", verifyToken, getUser);

export default router;
