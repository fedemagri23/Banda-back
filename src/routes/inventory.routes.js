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
  checkCompanyRole("0000000010"),
  getInventoryByCompany
);
router.post(
  "/adjust/:companyId",
  verifyToken,
  checkCompanyRole("0000000010"),
  adjustInventoryPricesByCompany
);

export default router;
