import { Router } from "express";
import {
  createSaleInvoice,
  getAllSaleInvoices,
  getSaleInvoiceById,
  deleteSaleInvoice,
  checkSaleInvoiceExists,
} from "../controllers/invoice.controllers.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { checkCompanyRole } from "../middleware/companyOwnerMiddleware.js";

const router = Router();

// Facturas
router.post("/create", verifyToken, checkCompanyRole("0000000000"), createSaleInvoice);
router.get("/get-all/:companyId", verifyToken, checkCompanyRole("0000000000"), getAllSaleInvoices);
router.get("/:id", verifyToken, checkCompanyRole("0000000000"), getSaleInvoiceById);
router.delete("/delete/:id", verifyToken, checkCompanyRole("0000000000"), deleteSaleInvoice);
router.get("/exists/:companyId/:saleId", verifyToken, checkCompanyRole("0000000000"), checkSaleInvoiceExists);

export default router;
