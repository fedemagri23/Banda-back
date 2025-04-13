import { Router } from "express";
import {
  register,
  getUsers,
  login,
  requestPasswordChange,
  changePassword,
} from "../controllers/user.controllers.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { addCompany, getCompaniesFromUser } from "../controllers/company.controllers.js";
import { getToken } from "../controllers/test.controllers.js";
import { addSupplier, getSuppliersByCompany } from "../controllers/supplier.controllers.js";
import { addProduct, getProductsByCompany } from "../controllers/product.controllers.js";
import { checkCompanyOwner } from "../middleware/companyOwnerMiddleware.js";
import { addPurchaseOrder, getPurchaseOrders } from "../controllers/purchase.controllers.js";
import { addClient, getClientsByCompany } from "../controllers/client.controllers.js";
import { addSaleOrder, getSaleOrders } from "../controllers/sale.controllers.js";

const router = Router();

router.post("/user/register", register);
router.post("/user/login", login);
router.post("/user/request-password-change", requestPasswordChange);
router.post("/user/change-password", changePassword);
router.get("/user/get-all", getUsers);

router.post("/company/post", verifyToken, addCompany);
router.get("/company/get-all", verifyToken, getCompaniesFromUser);

router.post("/supplier/post/:companyId", verifyToken, checkCompanyOwner, addSupplier);
router.get("/supplier/get-all/:companyId", verifyToken, checkCompanyOwner, getSuppliersByCompany);

router.post("/product/post/:companyId", verifyToken, checkCompanyOwner, addProduct);
router.get("/product/get-all/:companyId", verifyToken, checkCompanyOwner, getProductsByCompany);

router.post("/purchase/post/:companyId", verifyToken, checkCompanyOwner, addPurchaseOrder);
router.get("/purchase/get-all/:companyId", verifyToken, checkCompanyOwner, getPurchaseOrders);

router.post("/client/post/:companyId", verifyToken, checkCompanyOwner, addClient);
router.get("/client/get-all/:companyId", verifyToken, checkCompanyOwner, getClientsByCompany);

router.post("/sale/post/:companyId", verifyToken, checkCompanyOwner, addSaleOrder);
router.get("/sale/get-all/:companyId", verifyToken, checkCompanyOwner, getSaleOrders);


// TODO: Al final BORRAR estos controllers
router.get("/token", getToken);

/*
router.post("/login", loginUser);
router.post("/users", createUser);
*/

// Auth
// router.get("/route", verifyToken, controller);

export default router;
