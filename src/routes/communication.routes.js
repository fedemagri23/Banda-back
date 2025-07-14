import { Router } from "express";
import { sendSaleOrderEmail } from "../services/emailservices.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { checkCompanyRole } from "../middleware/companyOwnerMiddleware.js";

const router = Router();

router.post("/send", verifyToken, checkCompanyRole("0000000000"), sendSaleOrderEmail);

export default router;
