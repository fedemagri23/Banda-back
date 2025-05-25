import { Router } from "express";
import { sendSaleOrderEmail } from "../services/emailservices.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/send", verifyToken, sendSaleOrderEmail);

export default router;
