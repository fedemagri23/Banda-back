import { Router } from "express";
import {
  addProduct,
  getProductsByCompany,
} from "../controllers/product.controllers.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { checkCompanyRole } from "../middleware/companyOwnerMiddleware.js";

const router = Router();

router.post(
  "/post/:companyId",
  verifyToken,
  checkCompanyRole("000000000"),
  addProduct
);
router.get(
  "/get-all/:companyId",
  verifyToken,
  checkCompanyRole("000000000"),
  getProductsByCompany
);

export default router;
