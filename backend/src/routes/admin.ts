import { Hono } from 'hono';
import { sign } from 'hono/jwt';
import { Env } from '../types';
import { authMiddleware } from '../middleware/auth';
import { verifyPassword } from '../utils/crypto';

export const adminRoutes = new Hono<{ Bindings: Env }>();

adminRoutes.post('/login', async (c) => {
  const { username, password } = await c.req.json();
  if (!username || !password) {
    return c.json({ error: '请输入用户名和密码' }, 400);
  }
  const admin = await c.env.DB.prepare(
    'SELECT * FROM admins WHERE username = ?'
  ).bind(username).first();
  if (!admin) {
    return c.json({ error: '用户名或密码错误' }, 401);
  }
  const valid = await verifyPassword(password, (admin as any).password);
  if (!valid) {
    return c.json({ error: '用户名或密码错误' }, 401);
  }
  const token = await sign(
    { id: (admin as any).id, exp: Math.floor(Date.now() / 1000) + 86400 },
    c.env.JWT_SECRET
  );
  return c.json({ token });
});

// 需要鉴权的路由
adminRoutes.use('/*', authMiddleware);

adminRoutes.get('/me', async (c) => {
  return c.json({ message: '已登录' });
});
