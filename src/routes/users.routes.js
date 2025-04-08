import { Router } from "express";
import {
  register,
  getUsers,
} from "../controllers/index.controllers.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/user", register);
router.get("/user", getUsers);

/*
router.post("/login", loginUser);
router.post("/users", createUser);
*/

// Auth
// router.get("/route", verifyToken, controller);

export default router;
