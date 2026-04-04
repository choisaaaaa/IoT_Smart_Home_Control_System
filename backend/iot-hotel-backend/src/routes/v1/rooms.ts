import { Router } from 'express';
import * as roomController from '../../controllers/room.controller';

const router = Router();

router.get('/', roomController.get);
router.get('/:id', roomController.getById);
router.post('/', roomController.create);
router.put('/:id', roomController.update);
router.delete('/:id', roomController.remove);

export default router;