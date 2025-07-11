import { Router } from "express";
import { getCpiData, getInflationData } from "../controllers/inflation.controllers.js";

const router = Router();

router.get('/', getInflationData);
router.get('/cpi', getCpiData); 

export default router;
