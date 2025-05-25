import { Router } from "express";
import {
  adjustInventoryPricesByCompany,
  getInventoryByCompany,
} from "../controllers/inventory.controllers.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { checkCompanyRole } from "../middleware/companyOwnerMiddleware.js";

const router = Router();

router.get(
  "/get-all/:companyId",
  verifyToken,
  checkCompanyRole("000000001"),
  getInventoryByCompany
);
router.post(
  "/adjust/:companyId",
  verifyToken,
  checkCompanyRole("000000001"),
  adjustInventoryPricesByCompany
);

export default router;
