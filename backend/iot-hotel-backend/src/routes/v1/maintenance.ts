import { Router } from 'express';
import * as maintenanceController from '../../controllers/maintenance.controller';

const router = Router();

router.get('/', maintenanceController.get);
router.get('/:id', maintenanceController.getById);
router.post('/', maintenanceController.create);
router.put('/:id/assign', maintenanceController.assign);
router.put('/:id/complete', maintenanceController.complete);

export default router;