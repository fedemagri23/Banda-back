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
router.post("/create", createSaleInvoice);
router.get("/get-all/:companyId", getAllSaleInvoices);
router.get("/:id", verifyToken, getSaleInvoiceById);
router.delete("/delete/:id", deleteSaleInvoice);
router.get("/exists/:companyId/:saleId", checkSaleInvoiceExists);

export default router;
