import { Router } from "express";
import {
  addPurchaseOrder,
  getPurchaseOrders,
} from "../controllers/purchase.controllers.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { checkCompanyRole } from "../middleware/companyOwnerMiddleware.js";

const router = Router();

router.post(
  "/post/:companyId",
  verifyToken,
  checkCompanyRole("110000000"),
  addPurchaseOrder
);
router.get(
  "/get-all/:companyId",
  verifyToken,
  checkCompanyRole("100000000"),
  getPurchaseOrders
);

export default router;
