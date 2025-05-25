import { Router } from "express";
import {
  createSession,
  getSession,
  invalidateSession,
  invalidateUserSessions,
} from "../controllers/session.controllers.js";

const router = Router();

router.post("/create", createSession);
router.get("/:id", getSession);
router.delete("/user/sessions/:user_id", invalidateUserSessions);
router.delete("/:id", invalidateSession);

export default router;
