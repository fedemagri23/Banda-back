import { Router } from "express";
import {
  register,
  getUsers,
  login,
  requestPasswordChange,
  changePassword,
  addEmployee,
  removeEmployee,
  getUser,
} from "../controllers/user.controllers.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  addCompany,
  getCompaniesFromUser,
  getCompanyById,
} from "../controllers/company.controllers.js";
import { getToken } from "../controllers/test.controllers.js";
import { addSupplier, getSuppliersByCompany, deleteSupplier } from "../controllers/supplier.controllers.js";
import { addProduct, getProductsByCompany } from "../controllers/product.controllers.js";
import { checkCompanyRole } from "../middleware/companyOwnerMiddleware.js";
import { addPurchaseOrder, getPurchaseOrders } from "../controllers/purchase.controllers.js";
import { addClient, getClientsByCompany, deleteClient } from "../controllers/client.controllers.js";
import { addSaleOrder, getSaleOrders } from "../controllers/sale.controllers.js";
import { getInventoryByCompany } from "../controllers/inventory.controllers.js";
import { getClientDistributionChart, getOrderBalanceChart, getSupplierDistributionChart } from "../controllers/metric.controllers.js";
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
  getUserCertificate,
  upsertArcaToken,
  upsertUserCertificate,
} from "../controllers/arcatoken.controllers.js";
import {
  createSaleInvoice,
  deleteSaleInvoice,
  getAllSaleInvoices,
  getSaleInvoiceById,
} from "../controllers/invoice.controllers.js";

const router = Router();

// Facturas
router.post("/sale-invoice/create", createSaleInvoice); // Crear una nueva factura
router.get("/sale-invoice/get-all/:companyId", getAllSaleInvoices); // Obtener resumen de todas las facturas de una empresa
router.get("/sale-invoice/:id", getSaleInvoiceById); // Obtener detalle completo de una factura
router.delete("/sale-invoice/delete/:id", deleteSaleInvoice); // Eliminar una factura

// Token ARCA
router.get("/arca/token/:user_id/:cuit", getArcaToken); // obtener TA si está vigente
router.post("/arca/token/:user_id/:cuit", upsertArcaToken); // crear o actualizar (upsert)
router.delete("/arca/token/:user_id/:cuit", deleteArcaToken); // eliminar manualmente

// Certificados de usuario para AFIP (WSAA)
router.get("/arca/certificate/:user_id/:cuit", getUserCertificate); // Obtener certificado+private_key para un user y cuit
router.post("/arca/certificate/:user_id/:cuit", upsertUserCertificate); // Crear o actualizar certificado+private_key para un user y cuit
router.delete("/arca/certificate/:user_id/:cuit", deleteUserCertificate); // Eliminar certificado+private_key para un user y cuit

router.post("/session/create", createSession);
router.get("/session/:id", getSession);
router.delete("/user/sessions/:user_id", invalidateUserSessions);
router.delete("/session/:id", invalidateSession);

router.post("/user/register", register);
router.post("/user/login", login);
router.post("/user/request-password-change", requestPasswordChange);
router.post("/user/change-password", changePassword);
router.get("/user/get-all", getUsers);
router.get("/user/get", verifyToken, getUser);
router.post("/employee/post/:companyId", verifyToken, checkCompanyRole(1), addEmployee);
router.delete("/employee/delete/:companyId", verifyToken, checkCompanyRole(1), removeEmployee);


router.post("/company/post", verifyToken, addCompany);
router.get("/company/get-all", verifyToken, getCompaniesFromUser);
router.get("/company/get/:companyId", verifyToken, checkCompanyRole(1), getCompanyById);

router.post("/supplier/post/:companyId", verifyToken, checkCompanyRole(2), addSupplier);
router.get("/supplier/get-all/:companyId", verifyToken, checkCompanyRole(2), getSuppliersByCompany);
router.delete("/supplier/delete/:companyId/:supplierId", verifyToken, checkCompanyRole(2), deleteSupplier);

router.post("/product/post/:companyId", verifyToken, checkCompanyRole(2), addProduct);
router.get("/product/get-all/:companyId", verifyToken, checkCompanyRole(2), getProductsByCompany);

router.post("/purchase/post/:companyId", verifyToken, checkCompanyRole(2), addPurchaseOrder);
router.get("/purchase/get-all/:companyId", verifyToken, checkCompanyRole(2), getPurchaseOrders);

router.post("/client/post/:companyId", verifyToken, checkCompanyRole(2), addClient);
router.get("/client/get-all/:companyId", verifyToken, checkCompanyRole(2), getClientsByCompany);
router.delete("/client/delete/:companyId/:clientId", verifyToken, checkCompanyRole(2), deleteClient);

router.post("/sale/post/:companyId", verifyToken, checkCompanyRole(2), addSaleOrder);
router.get("/sale/get-all/:companyId", verifyToken, checkCompanyRole(2), getSaleOrders);

router.get("/inventory/get-all/:companyId", verifyToken, checkCompanyRole(2), getInventoryByCompany); 

router.get("/metric/order/balance-chart/:companyId", verifyToken, checkCompanyRole(2), getOrderBalanceChart); 
router.get("/metric/supplier-distribution-chart/:companyId", verifyToken, checkCompanyRole(2), getSupplierDistributionChart);
router.get("/metric/client-distribution-chart/:companyId", verifyToken, checkCompanyRole(2), getClientDistributionChart);


// TODO: Al final BORRAR estos controllers
router.get("/token", getToken);

/*
router.post("/login", loginUser);
router.post("/users", createUser);
*/

// Auth
// router.get("/route", verifyToken, controller);

export default router;
