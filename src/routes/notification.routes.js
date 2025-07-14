import { Router } from "express";
import {
  acceptInvitation,
  getNotifications,
  rejectInvitation,
} from "../controllers/notification.controllers.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { checkCompanyRole } from "../middleware/companyOwnerMiddleware.js";

const router = Router();

router.get("/get-all", verifyToken, getNotifications);
router.post("/accept/:companyId", verifyToken, acceptInvitation);
router.delete("/reject/:companyId", verifyToken, rejectInvitation);

export default router;
