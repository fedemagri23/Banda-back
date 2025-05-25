import { Router } from "express";
import {
  addClient,
  getClientsByCompany,
  deleteClient,
} from "../controllers/client.controllers.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { checkCompanyRole } from "../middleware/companyOwnerMiddleware.js";

const router = Router();

router.post(
  "/post/:companyId",
  verifyToken,
  checkCompanyRole("000011000"),
  addClient
);
router.get(
  "/get-all/:companyId",
  verifyToken,
  checkCompanyRole("000010000"),
  getClientsByCompany
);
router.delete(
  "/delete/:companyId/:clientId",
  verifyToken,
  checkCompanyRole("000011000"),
  deleteClient
);

export default router;
