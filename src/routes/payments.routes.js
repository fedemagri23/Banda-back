import {Router} from 'express';

import { processPaymentController, webhookController, getPublicKey } from '../controllers/payments.controllers.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/process-payment', verifyToken, processPaymentController);
router.post('/webhook', verifyToken, webhookController);
router.get('/public-key', verifyToken, getPublicKey);

export default router;