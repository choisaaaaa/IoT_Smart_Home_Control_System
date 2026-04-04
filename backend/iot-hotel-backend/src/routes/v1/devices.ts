import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  res.json({ message: '设备管理接口' });
});

export default router;
