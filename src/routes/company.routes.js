import { Router } from "express";
import {
  addCompany,
  getCompaniesFromUser,
  getCompanyById,
} from "../controllers/company.controllers.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { checkCompanyRole } from "../middleware/companyOwnerMiddleware.js";

const router = Router();

router.post("/post", verifyToken, addCompany);
router.get("/get-all", verifyToken, getCompaniesFromUser);
router.get("/get/:companyId", verifyToken, getCompanyById);

export default router;
