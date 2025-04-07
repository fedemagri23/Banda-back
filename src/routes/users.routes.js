import { Router } from "express";
import {
  getUserById,
  createUser,
  loginUser,
  register,
} from "../controllers/index.controllers.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", register);
router.get("/users/:id", getUserById);

/*
router.post("/login", loginUser);
router.post("/users", createUser);
*/

// Auth
// router.get("/route", verifyToken, controller);

export default router;
