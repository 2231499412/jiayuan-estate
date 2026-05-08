import { Context, Next } from 'hono';
import { verify } from 'hono/jwt';
import { Env } from '../types';

export async function authMiddleware(c: Context<{ Bindings: Env }>, next: Next) {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: '未登录' }, 401);
  }
  const token = authHeader.slice(7);
  try {
    const payload = await verify(token, c.env.JWT_SECRET, 'HS256');
    c.set('adminId', payload.id);
    await next();
  } catch {
    return c.json({ error: 'token 无效或已过期' }, 401);
  }
}
