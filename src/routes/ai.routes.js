import { Router } from "express";
import { askWithIaDatabase } from "../controllers/ai/ai.ask-database.js";
import { getAiInterests } from "../controllers/ai/ai.interests.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { checkCompanyRole } from "../middleware/companyOwnerMiddleware.js";

const router = Router();

router.get(
  "/interests/:companyId",
  verifyToken,
  checkCompanyRole("000000000"),
  getAiInterests
);
router.post(
  "/ask-database/:companyId",
  verifyToken,
  checkCompanyRole("101010101"),
  askWithIaDatabase
);

export default router;
