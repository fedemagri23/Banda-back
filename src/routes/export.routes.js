import { Router } from "express";
import {
  exportClientsToCSV,
  exportSuppliersToCSV,
  exportPurchasesToCSV,
  exportSalesToCSV,
  exportInventoryToCSV,
  exportEmployeesToCSV,
} from "../controllers/export.controllers.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { checkCompanyRole } from "../middleware/companyOwnerMiddleware.js";

const router = Router();

router.get(
  "/clients/csv/:companyId",
  verifyToken,
  checkCompanyRole("0000000001"),
  exportClientsToCSV
);
router.get(
  "/suppliers/csv/:companyId",
  verifyToken,
  checkCompanyRole("0000000001"),
  exportSuppliersToCSV
);
router.get(
  "/purchases/csv/:companyId",
  verifyToken,
  checkCompanyRole("0000000001"),
  exportPurchasesToCSV
);
router.get(
  "/sales/csv/:companyId",
  verifyToken,
  checkCompanyRole("0000000001"),
  exportSalesToCSV
);
router.get(
  "/inventory/csv/:companyId",
  verifyToken,
  checkCompanyRole("0000000001"),
  exportInventoryToCSV
);
router.get(
  "/employees/csv/:companyId",
  verifyToken,
  checkCompanyRole("0000000001"),
  exportEmployeesToCSV
);

export default router;
