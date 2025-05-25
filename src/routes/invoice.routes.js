import { Router } from "express";
import {
  createSaleInvoice,
  getAllSaleInvoices,
  getSaleInvoiceById,
  deleteSaleInvoice,
  checkSaleInvoiceExists,
} from "../controllers/invoice.controllers.js";

const router = Router();

// Facturas
router.post("/create", createSaleInvoice);
router.get("/get-all/:companyId", getAllSaleInvoices);
router.get("/:id", getSaleInvoiceById);
router.delete("/delete/:id", deleteSaleInvoice);
router.get("/exists/:companyId/:saleId", checkSaleInvoiceExists);

export default router;
