import { Router } from "express";
import {
  register,
  getUsers,
  login,
  requestPasswordChange,
  changePassword,
  getUserById,
} from "../controllers/user.controllers.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { addCompany, getCompaniesFromUser } from "../controllers/company.controllers.js";
import { getToken } from "../controllers/test.controllers.js";
import { addSupplier, getSuppliersByCompany } from "../controllers/supplier.controllers.js";
import { addProduct, getProductsByCompany } from "../controllers/product.controllers.js";
import { checkCompanyOwner } from "../middleware/companyOwnerMiddleware.js";
import { addPurchaseOrder, getPurchaseOrders } from "../controllers/purchase.controllers.js";
import { addClient, getClientsByCompany, deleteClient } from "../controllers/client.controllers.js";
import { addSaleOrder, getSaleOrders } from "../controllers/sale.controllers.js";
import { deleteSupplier } from "../controllers/supplier.controllers.js";
import { getInventoryByCompany } from "../controllers/inventory.controllers.js";
import { getOrderBalanceChart } from "../controllers/metric.controllers.js";
import { createSession, getSession, invalidateSession, invalidateUserSessions } from "../controllers/session.controllers.js";
import { deleteArcaToken, getArcaToken, upsertArcaToken } from "../controllers/arcatoken.controllers.js";
import { createSaleInvoice, deleteSaleInvoice, getAllSaleInvoices, getSaleInvoiceById } from "../controllers/invoice.controllers.js";

const router = Router();

// Facturas
router.post("/sale-invoice/create", createSaleInvoice); // Crear una nueva factura
router.get("/sale-invoice/get-all/:companyId", getAllSaleInvoices); // Obtener resumen de todas las facturas de una empresa
router.get("/sale-invoice/:id", getSaleInvoiceById); // Obtener detalle completo de una factura
router.delete("/sale-invoice/delete/:id", deleteSaleInvoice); // Eliminar una factura

// Token ARCA
router.get("/arca/token/:user_id/:cuit", getArcaToken);         // obtener TA si está vigente
router.post("/arca/token/:user_id/:cuit", upsertArcaToken);     // crear o actualizar (upsert)
router.delete("/arca/token/:user_id/:cuit", deleteArcaToken);   // eliminar manualmente

router.post("/session/create", createSession);
router.get("/session/:id", getSession);
router.delete("/user/sessions/:user_id", invalidateUserSessions);
router.delete("/session/:id", invalidateSession);

router.post("/user/register", register);
router.post("/user/login", login);
router.post("/user/request-password-change", requestPasswordChange);
router.post("/user/change-password", changePassword);
router.get("/user/get-all", getUsers);
router.get("/user/:id", getUserById);

router.post("/company/post", verifyToken, addCompany);
router.get("/company/get-all", verifyToken, getCompaniesFromUser);

router.post("/supplier/post/:companyId", verifyToken, checkCompanyOwner, addSupplier);
router.get("/supplier/get-all/:companyId", verifyToken, checkCompanyOwner, getSuppliersByCompany);
router.delete("/supplier/delete/:companyId/:supplierId", verifyToken, checkCompanyOwner, deleteSupplier);

router.post("/product/post/:companyId", verifyToken, checkCompanyOwner, addProduct);
router.get("/product/get-all/:companyId", verifyToken, checkCompanyOwner, getProductsByCompany);

router.post("/purchase/post/:companyId", verifyToken, checkCompanyOwner, addPurchaseOrder);
router.get("/purchase/get-all/:companyId", verifyToken, checkCompanyOwner, getPurchaseOrders);

router.post("/client/post/:companyId", verifyToken, checkCompanyOwner, addClient);
router.get("/client/get-all/:companyId", verifyToken, checkCompanyOwner, getClientsByCompany);
router.delete("/client/delete/:companyId/:clientId", verifyToken, checkCompanyOwner, deleteClient);

router.post("/sale/post/:companyId", verifyToken, checkCompanyOwner, addSaleOrder);
router.get("/sale/get-all/:companyId", verifyToken, checkCompanyOwner, getSaleOrders);

router.get("/inventory/get-all/:companyId", verifyToken, checkCompanyOwner, getInventoryByCompany); 

router.get("/metric/order/balance-chart/:companyId", verifyToken, checkCompanyOwner, getOrderBalanceChart); 


// TODO: Al final BORRAR estos controllers
router.get("/token", getToken);

/*
router.post("/login", loginUser);
router.post("/users", createUser);
*/

// Auth
// router.get("/route", verifyToken, controller);

export default router;
