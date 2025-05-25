import { Router } from "express";
import {
  getClientDistributionChart,
  getOrderBalanceChart,
  getSupplierDistributionChart,
} from "../controllers/metric.controllers.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { checkCompanyRole } from "../middleware/companyOwnerMiddleware.js";

const router = Router();

router.get(
  "/order/balance-chart/:companyId",
  verifyToken,
  checkCompanyRole("000000000"),
  getOrderBalanceChart
);
router.get(
  "/supplier-distribution-chart/:companyId",
  verifyToken,
  checkCompanyRole("000000000"),
  getSupplierDistributionChart
);
router.get(
  "/client-distribution-chart/:companyId",
  verifyToken,
  checkCompanyRole("000000000"),
  getClientDistributionChart
);

export default router;
