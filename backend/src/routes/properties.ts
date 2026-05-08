import { Hono } from 'hono';
import { Env, Property } from '../types';

export const propertiesRoutes = new Hono<{ Bindings: Env }>();

// 房源列表（支持筛选）
propertiesRoutes.get('/properties', async (c) => {
  const { type, area, status, keyword, page = '1', pageSize = '12' } = c.req.query();
  const conditions: string[] = [];
  const params: string[] = [];

  if (type) {
    conditions.push('type = ?');
    params.push(type);
  }
  if (area) {
    conditions.push('area = ?');
    params.push(area);
  }
  if (status) {
    conditions.push('status = ?');
    params.push(status);
  } else {
    conditions.push("status != '已删除'");
  }
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

  return c.json({ data: results, total, page: parseInt(page), pageSize: parseInt(pageSize) });
});

// 推荐房源
propertiesRoutes.get('/properties/hot', async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM properties WHERE hot = 1 AND status = '在售' ORDER BY created_at DESC LIMIT 6"
  ).all();
  return c.json({ data: results });
});

// 单个房源详情
propertiesRoutes.get('/properties/:id', async (c) => {
  const id = c.req.param('id');
  const result = await c.env.DB.prepare(
    'SELECT * FROM properties WHERE id = ?'
  ).bind(id).first();
  if (!result) return c.json({ error: '房源不存在' }, 404);
  return c.json({ data: result });
});

// 区域列表
propertiesRoutes.get('/areas', async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT DISTINCT area FROM properties WHERE status = '在售' ORDER BY area"
  ).all();
  return c.json({ data: results.map((r: any) => r.area) });
});

// 获取图片
propertiesRoutes.get('/images/:key', async (c) => {
  const key = c.req.param('key');
  const object = await c.env.IMAGES.get(key);
  if (!object) return c.notFound();
  const headers = new Headers();
  headers.set('Content-Type', object.httpMetadata?.contentType || 'image/jpeg');
  headers.set('Cache-Control', 'public, max-age=86400');
  return new Response(object.body, { headers });
});
