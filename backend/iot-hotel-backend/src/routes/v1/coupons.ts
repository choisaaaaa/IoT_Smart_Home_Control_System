import { Router } from 'express';
import * as couponController from '../../controllers/coupon.controller';

const router = Router();

router.get('/', couponController.get);
router.get('/:id', couponController.getById);
router.post('/', couponController.create);
router.put('/:id', couponController.update);
router.delete('/:id', couponController.remove);
router.post('/:id/receive', couponController.receive);

export default router;