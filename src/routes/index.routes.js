import { Router } from "express";
import { getToken } from "../controllers/test.controllers.js";

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
