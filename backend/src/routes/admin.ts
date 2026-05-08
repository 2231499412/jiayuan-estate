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

// 管理端房源列表（含已售/已租）
adminRoutes.get('/properties', async (c) => {
  const { keyword, page = '1', pageSize = '20' } = c.req.query();
  const conditions: string[] = [];
  const params: string[] = [];
  if (keyword) {
    conditions.push('(title LIKE ? OR address LIKE ?)');
    params.push(`%${keyword}%`, `%${keyword}%`);
  }
  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const offset = (parseInt(page) - 1) * parseInt(pageSize);

  const countResult = await c.env.DB.prepare(
    `SELECT COUNT(*) as total FROM properties ${where}`
  ).bind(...params).first();
  const total = (countResult as any)?.total || 0;

  const { results } = await c.env.DB.prepare(
    `SELECT * FROM properties ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`
  ).bind(...params, parseInt(pageSize), offset).all();

  return c.json({ data: results, total });
});

// 新增房源
adminRoutes.post('/properties', async (c) => {
  const body = await c.req.json();
  const { title, type, area, address, price, area_sqm, rooms, floor, image_keys, desc, hot, status } = body;
  if (!title || !type || !area || !address || !price) {
    return c.json({ error: '缺少必填字段' }, 400);
  }
  const result = await c.env.DB.prepare(
    `INSERT INTO properties (title, type, area, address, price, area_sqm, rooms, floor, image_keys, desc, hot, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(title, type, area, address, price, area_sqm || null, rooms || null, floor || null, image_keys || null, desc || null, hot || 0, status || '在售').run();
  return c.json({ id: result.meta.last_row_id }, 201);
});

// 编辑房源
adminRoutes.put('/properties/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const fields = ['title', 'type', 'area', 'address', 'price', 'area_sqm', 'rooms', 'floor', 'image_keys', 'desc', 'hot', 'status'];
  const updates: string[] = [];
  const params: any[] = [];
  for (const field of fields) {
    if (body[field] !== undefined) {
      updates.push(`${field} = ?`);
      params.push(body[field]);
    }
  }
  if (updates.length === 0) return c.json({ error: '无更新内容' }, 400);
  params.push(id);
  await c.env.DB.prepare(
    `UPDATE properties SET ${updates.join(', ')} WHERE id = ?`
  ).bind(...params).run();
  return c.json({ message: '更新成功' });
});

// 删除房源
adminRoutes.delete('/properties/:id', async (c) => {
  const id = c.req.param('id');
  const property = await c.env.DB.prepare('SELECT image_keys FROM properties WHERE id = ?').bind(id).first();
  if (property && (property as any).image_keys) {
    const keys = (property as any).image_keys.split(',').filter(Boolean);
    for (const key of keys) {
      await c.env.IMAGES.delete(key);
    }
  }
  await c.env.DB.prepare('DELETE FROM properties WHERE id = ?').bind(id).run();
  return c.json({ message: '删除成功' });
});

// 上传图片到 R2
adminRoutes.post('/upload', async (c) => {
  const formData = await c.req.formData();
  const file = formData.get('file') as File;
  if (!file) return c.json({ error: '请选择文件' }, 400);

  const ext = file.name.split('.').pop() || 'jpg';
  const key = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  await c.env.IMAGES.put(key, file.stream(), {
    httpMetadata: { contentType: file.type },
  });

  return c.json({ key, url: `/api/images/${key}` });
});
