import {Router} from 'express';


import { getPlanInfo } from '../controllers/plans.controllers.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/get-plan-info',  getPlanInfo);

export default router;