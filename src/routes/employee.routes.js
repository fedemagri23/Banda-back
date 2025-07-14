import { Router } from "express";
import {
  addEmployee,
  createRole,
  getEmployees,
  getRoles,
  removeEmployee,
} from "../controllers/employee.controllers.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { checkCompanyRole } from "../middleware/companyOwnerMiddleware.js";

const ROLE_COMPANY_OWNER = "1111111110";
const router = Router();

router.post(
  "/post/:companyId",
  verifyToken,
  checkCompanyRole(ROLE_COMPANY_OWNER),
  addEmployee
);
router.delete(
  "/delete/:companyId",
  verifyToken,
  checkCompanyRole(ROLE_COMPANY_OWNER),
  removeEmployee
);
router.get(
  "/get-all/:companyId",
  verifyToken,
  checkCompanyRole(ROLE_COMPANY_OWNER),
  getEmployees
);
router.post(
  "/role/post/:companyId",
  verifyToken,
  checkCompanyRole(ROLE_COMPANY_OWNER),
  createRole
);
router.get(
  "/role/get-all/:companyId",
  verifyToken,
  checkCompanyRole(ROLE_COMPANY_OWNER),
  getRoles
);

export default router;
