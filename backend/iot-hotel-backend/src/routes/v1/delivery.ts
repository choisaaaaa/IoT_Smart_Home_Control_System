import { Router } from 'express';
import * as deliveryController from '../../controllers/delivery.controller';

const router = Router();

router.get('/', deliveryController.get);
router.get('/:id', deliveryController.getById);
router.post('/', deliveryController.create);
router.put('/:id/complete', deliveryController.complete);

export default router;