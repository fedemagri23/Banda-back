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
import { addSupplier } from "../controllers/supplier.controllers.js";
import { addProduct, getProductsByCompany } from "../controllers/product.controllers.js";
import { checkCompanyOwner } from "../middleware/companyOwnerMiddleware.js";

const router = Router();

router.post("/user/register", register);
router.post("/user/login", login);
router.post("/user/request-password-change", requestPasswordChange);
router.post("/user/change-password", changePassword);
router.get("/user/get-all", getUsers);

router.get("/company/get-all", verifyToken, getCompaniesFromUser);
router.post("/company/post", verifyToken, addCompany);

router.post("/supplier/post", verifyToken, addSupplier);

router.get("/product/get-all/:companyId", verifyToken, checkCompanyOwner, getProductsByCompany);
router.post("/product/post/:companyId", verifyToken, checkCompanyOwner, addProduct);

// TODO: Al final BORRAR estos controllers
router.get("/token", getToken);

/*
router.post("/login", loginUser);
router.post("/users", createUser);
*/

// Auth
// router.get("/route", verifyToken, controller);

export default router;
