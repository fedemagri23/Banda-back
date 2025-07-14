import { Router } from "express";
import {
  addSaleOrder,
  getSaleOrders,
} from "../controllers/sale.controllers.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { checkCompanyRole } from "../middleware/companyOwnerMiddleware.js";

const router = Router();

router.post(
  "/post/:companyId",
  verifyToken,
  checkCompanyRole("0000000000"),
  addSaleOrder
);
router.get(
  "/get-all/:companyId",
  verifyToken,
  checkCompanyRole("0000000000"),
  getSaleOrders
);

export default router;
