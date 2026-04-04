import { Router } from 'express';
import * as bookingController from '../../controllers/booking.controller';

const router = Router();

router.get('/', bookingController.get);
router.get('/:id', bookingController.getById);
router.post('/', bookingController.create);
router.put('/:id/confirm', bookingController.confirm);
router.put('/:id/checkin', bookingController.checkin);
router.put('/:id/checkout', bookingController.checkout);
router.put('/:id/cancel', bookingController.cancel);

export default router;