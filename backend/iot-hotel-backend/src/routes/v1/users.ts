import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  res.json({ message: '用户管理接口' });
});

export default router;
