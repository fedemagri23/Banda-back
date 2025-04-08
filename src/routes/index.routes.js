import { Router } from "express";
import {
  register,
  getUsers,
} from "../controllers/user.controllers.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { addCompany, getCompanies } from "../controllers/company.controllers.js";

const router = Router();

router.post("/user", register);
router.get("/user", getUsers);

router.post("/company", verifyToken, addCompany);
router.get("/companies", verifyToken, getCompanies);


/*
router.post("/login", loginUser);
router.post("/users", createUser);
*/

// Auth
// router.get("/route", verifyToken, controller);

export default router;
