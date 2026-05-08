import { Hono } from 'hono';
import { Env, Property } from '../types';

export const propertiesRoutes = new Hono<{ Bindings: Env }>();

// 房源列表（支持筛选）
propertiesRoutes.get('/properties', async (c) => {
  const { type, area, status, keyword, priceRange, rooms, page = '1', pageSize = '12' } = c.req.query();
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
  if (priceRange && priceRange !== '不限') {
    // price field stores values like "120万" or "8500元/月"
    // Extract numeric value for comparison: CAST(REPLACE(REPLACE(price, '万', ''), '元/月', '') AS INTEGER)
    const priceExpr = "CAST(REPLACE(REPLACE(price, '万', ''), '元/月', '') AS INTEGER)";
    if (priceRange === '50万以下') {
      conditions.push(`${priceExpr} < 50`);
    } else if (priceRange === '50-100万') {
      conditions.push(`${priceExpr} >= 50 AND ${priceExpr} < 100`);
    } else if (priceRange === '100-200万') {
      conditions.push(`${priceExpr} >= 100 AND ${priceExpr} < 200`);
    } else if (priceRange === '200-300万') {
      conditions.push(`${priceExpr} >= 200 AND ${priceExpr} < 300`);
    } else if (priceRange === '300万以上') {
      conditions.push(`${priceExpr} >= 300`);
    }
  }
  if (rooms && rooms !== '不限') {
    // rooms field stores values like "3室2厅"
    // Match by first digit
    if (rooms === '一居') {
      conditions.push("rooms LIKE '1室%'");
    } else if (rooms === '两居') {
      conditions.push("rooms LIKE '2室%'");
    } else if (rooms === '三居') {
      conditions.push("rooms LIKE '3室%'");
    } else if (rooms === '四居及以上') {
      conditions.push("CAST(SUBSTR(rooms, 1, 1) AS INTEGER) >= 4");
    }
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
