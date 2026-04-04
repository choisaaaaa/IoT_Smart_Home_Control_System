import { Router } from 'express';

const router = Router();

router.post('/login', (_req, res) => {
  res.json({ message: '用户登录' });
});

router.post('/logout', (_req, res) => {
  res.json({ message: '用户登出' });
});

export default router;
