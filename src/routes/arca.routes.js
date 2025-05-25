import { Router } from "express";
import {
  deleteArcaToken,
  getArcaToken,
  upsertArcaToken,
  getCompanyCertificate,
  upsertUserCertificate,
  deleteUserCertificate,
} from "../controllers/arcatoken.controllers.js";

const router = Router();

// Token ARCA
router.get("/token/:user_id/:cuit", getArcaToken);
router.post("/token/:user_id/:cuit", upsertArcaToken);
router.delete("/token/:user_id/:cuit", deleteArcaToken);

// Certificados de usuario para AFIP (WSAA)
router.get("/certificate/:companyId", getCompanyCertificate);
router.post("/certificate/:companyId", upsertUserCertificate);
router.delete("/certificate/:companyId", deleteUserCertificate);

export default router;
