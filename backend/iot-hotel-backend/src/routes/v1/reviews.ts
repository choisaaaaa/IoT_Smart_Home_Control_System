import { Router } from 'express';
import * as reviewController from '../../controllers/review.controller';

const router = Router();

router.get('/', reviewController.get);
router.get('/:id', reviewController.getById);
router.post('/', reviewController.create);

export default router;