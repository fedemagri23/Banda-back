import { Router } from "express";
import { getToken } from "../controllers/test.controllers.js";
import {
  addSupplier,
  getSuppliersByCompany,
  deleteSupplier,
} from "../controllers/supplier.controllers.js";
import {
  addProduct,
  getProductsByCompany,
} from "../controllers/product.controllers.js";
import { checkCompanyRole } from "../middleware/companyOwnerMiddleware.js";
import {
  addPurchaseOrder,
  getPurchaseOrders,
} from "../controllers/purchase.controllers.js";
import {
  addClient,
  getClientsByCompany,
  deleteClient,
} from "../controllers/client.controllers.js";
import {
  addSaleOrder,
  getSaleOrders,
} from "../controllers/sale.controllers.js";
import { getInventoryByCompany } from "../controllers/inventory.controllers.js";
import {
  getClientDistributionChart,
  getOrderBalanceChart,
  getSupplierDistributionChart,
} from "../controllers/metric.controllers.js";
import {
  createSession,
  getSession,
  invalidateSession,
  invalidateUserSessions,
} from "../controllers/session.controllers.js";
import {
  deleteArcaToken,
  deleteUserCertificate,
  getArcaToken,
  getCompanyCertificate,
  upsertArcaToken,
  upsertUserCertificate,
} from "../controllers/arcatoken.controllers.js";
import {
  checkSaleInvoiceExists,
  createSaleInvoice,
  deleteSaleInvoice,
  getAllSaleInvoices,
  getSaleInvoiceById,
} from "../controllers/invoice.controllers.js";
import {
  getAiInterests,
  askWithIaDatabase,
} from "../controllers/ai.controllers.js";
import {
  acceptInvitation,
  getNotifications,
  rejectInvitation,
} from "../controllers/notification.controllers.js";
import {
  addEmployee,
  createRole,
  getEmployees,
  getRoles,
  removeEmployee,
} from "../controllers/employee.controllers.js";

//Email services

import { sendSaleOrderEmail } from "../services/emailservices.js";

//Export services

import {
  exportClientsToCSV,
  exportSuppliersToCSV,
  exportPurchasesToCSV,
  exportSalesToCSV,
  exportInventoryToCSV,
  exportEmployeesToCSV,
} from "../controllers/export.controllers.js";

// Import services

import { importCheckMiddleware } from "../middleware/importCheckMiddleware.js";

import { processCSVWithAI } from "../controllers/ai.controllers.js";

const ROLE_COMPANY_OWNER = "111111111";

// Import modularized routes
import invoiceRoutes from "./invoice.routes.js";
import arcaRoutes from "./arca.routes.js";
import sessionRoutes from "./session.routes.js";
import userRoutes from "./user.routes.js";
import employeeRoutes from "./employee.routes.js";
import companyRoutes from "./company.routes.js";
import supplierRoutes from "./supplier.routes.js";
import productRoutes from "./product.routes.js";
import purchaseRoutes from "./purchase.routes.js";
import clientRoutes from "./client.routes.js";
import saleRoutes from "./sale.routes.js";
import inventoryRoutes from "./inventory.routes.js";
import metricRoutes from "./metric.routes.js";
import aiRoutes from "./ai.routes.js";
import notificationRoutes from "./notification.routes.js";
import communicationRoutes from "./communication.routes.js";
import exportRoutes from "./export.routes.js";

const router = Router();

// Ping Test
router.get("/", (_, res) => {
  res.json({ message: "API is running" });
});

//Imports
router.post(
  "/import/:companyId/:type",
  importCheckMiddleware,
  processCSVWithAI
);

// Use modularized routes
router.use("/sale-invoice", invoiceRoutes);
router.use("/arca", arcaRoutes);
router.use("/session", sessionRoutes);
router.use("/user", userRoutes);
router.use("/employee", employeeRoutes);
router.use("/company", companyRoutes);
router.use("/supplier", supplierRoutes);
router.use("/product", productRoutes);
router.use("/purchase", purchaseRoutes);
router.use("/client", clientRoutes);
router.use("/sale", saleRoutes);
router.use("/inventory", inventoryRoutes);
router.use("/metric", metricRoutes);
router.use("/ai", aiRoutes);
router.use("/notification", notificationRoutes);
router.use("/communication", communicationRoutes);
router.use("/export", exportRoutes);

// TODO: Al final BORRAR estos controllers
router.get("/token", getToken);

/*
router.post("/login", loginUser);
router.post("/users", createUser);
*/

// Auth
// router.get("/route", verifyToken, controller);

export default router;
