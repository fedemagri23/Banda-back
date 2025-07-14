import { Router } from "express";
import {
  addSupplier,
  getSuppliersByCompany,
  deleteSupplier,
} from "../controllers/supplier.controllers.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { checkCompanyRole } from "../middleware/companyOwnerMiddleware.js";

const router = Router();

router.post(
  "/post/:companyId",
  verifyToken,
  checkCompanyRole("0000110000"),
  addSupplier
);
router.get(
  "/get-all/:companyId",
  verifyToken,
  checkCompanyRole("0000100000"),
  getSuppliersByCompany
);
router.delete(
  "/delete/:companyId/:supplierId",
  verifyToken,
  checkCompanyRole("0000110000"),
  deleteSupplier
);

export default router;
