import { Router } from 'express';
import * as paymentController from '../../controllers/payment.controller';

const router = Router();

router.get('/', paymentController.get);
router.get('/:id', paymentController.getById);
router.post('/', paymentController.create);
router.put('/:id/pay', paymentController.pay);

export default router;