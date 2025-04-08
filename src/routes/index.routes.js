import { Router } from "express";
import {
  register,
  getUsers,
  login,
} from "../controllers/user.controllers.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { addCompany, getCompanies, getCompaniesByUserId } from "../controllers/company.controllers.js";
import { getToken } from "../controllers/test.controllers.js";
import { addSupplier } from "../controllers/supplier.controllers.js";

const router = Router();

router.post("/user/register", register);
router.post("/user/login", login);
router.get("/user", getUsers);

router.post("/company", verifyToken, addCompany);
router.get("/company", getCompanies);
router.get("/company/user/:id", verifyToken, getCompaniesByUserId);

router.post("/supplier", verifyToken, addSupplier);

// TODO: Al final BORRAR estos controllers
router.get("/token", getToken);

/*
router.post("/login", loginUser);
router.post("/users", createUser);
*/

// Auth
// router.get("/route", verifyToken, controller);

export default router;
