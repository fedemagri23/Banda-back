import { Router } from "express";
import {
  getUserById,
  createUser,
  loginUser,
} from "../controllers/index.controllers.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/login", loginUser);
router.post("/users", createUser);
router.get("/users/:id", getUserById);


// Auth
// router.get("/route", verifyToken, controller);

export default router;
