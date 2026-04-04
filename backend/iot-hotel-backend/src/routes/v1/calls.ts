import { Router } from 'express';
import * as callController from '../../controllers/call.controller';

const router = Router();

router.post('/initiate', callController.initiateCall);
router.post('/outbound', callController.outboundCall);
router.post('/:call_id/answer', callController.answerCall);
router.post('/:call_id/reject', callController.rejectCall);
router.post('/:call_id/hangup', callController.hangupCall);
router.get('/:call_id/status', callController.getCallStatus);
router.get('/active', callController.getActiveCalls);
router.get('/history', callController.getCallHistory);
router.get('/stats', callController.getCallStats);

export default router;
