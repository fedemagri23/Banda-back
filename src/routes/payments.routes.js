import {Router} from 'express';

import { processPaymentController, webhookController, getPublicKey } from '../controllers/payments.controllers.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/process-payment', processPaymentController);
router.post('/webhook', webhookController);
router.get('/public-key', getPublicKey);

export default router;