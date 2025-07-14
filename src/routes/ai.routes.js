import { Router } from "express";
import { askWithIaDatabase } from "../controllers/ai/ai.ask-database.js";
import { getAiInterests } from "../controllers/ai/ai.interests.js";

import { verifyToken } from "../middleware/authMiddleware.js";
import { checkCompanyRole } from "../middleware/companyOwnerMiddleware.js";

const router = Router();

router.get(
  "/interests/:companyId",
  verifyToken,
  checkCompanyRole("0000000001"),
  getAiInterests
);

router.post(
  "/ask-database/:companyId",
  verifyToken,
  checkCompanyRole("1010101011"),
  askWithIaDatabase
);

export default router;
