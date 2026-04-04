import { Router } from 'express';
import * as memberController from '../../controllers/member.controller';

const router = Router();

router.get('/', memberController.get);
router.get('/:id', memberController.getById);
router.post('/', memberController.create);
router.put('/:id', memberController.update);
router.post('/login', memberController.login);

export default router;