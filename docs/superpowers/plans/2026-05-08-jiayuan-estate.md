# 嘉原地产网站实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为嘉原地产搭建一个全栈房产信息展示网站，部署到 Cloudflare（Pages + Workers + D1 + R2），零成本。

**Architecture:** 前端 Vue 3 + Vite 部署到 Cloudflare Pages，后端 TypeScript + Hono 部署到 Cloudflare Workers，数据库用 D1 (SQLite)，图片用 R2 对象存储。

**Tech Stack:** Vue 3, Vite, TypeScript, Hono, Cloudflare Workers, D1, R2, JWT, PBKDF2 (Web Crypto API)

---

## 文件结构总览

```
jiayuan-estate/
├── backend/
│   ├── src/
│   │   ├── index.ts              # Hono 入口 + 路由挂载
│   │   ├── types.ts              # 共享类型定义
│   │   ├── routes/
│   │   │   ├── properties.ts     # 公开房源 API
│   │   │   └── admin.ts          # 管理后台 API
│   │   ├── middleware/
│   │   │   └── auth.ts           # JWT 鉴权中间件
│   │   └── utils/
│   │       └── crypto.ts         # 密码哈希工具
│   │   └── db/
│   │       └── schema.sql        # D1 建表语句
│   ├── wrangler.toml             # Workers 配置
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── main.ts
│   │   ├── App.vue
│   │   ├── router/index.ts
│   │   ├── api/index.ts          # axios 封装
│   │   ├── types.ts              # 前端类型
│   │   ├── styles/
│   │   │   └── main.css          # 全局样式 + 配色变量
│   │   ├── views/
│   │   │   ├── Home.vue
│   │   │   ├── List.vue
│   │   │   ├── Detail.vue
│   │   │   ├── About.vue
│   │   │   └── admin/
│   │   │       ├── Login.vue
│   │   │       ├── Dashboard.vue
│   │   │       └── Properties.vue
│   │   └── components/
│   │       ├── PropertyCard.vue
│   │       ├── SearchBar.vue
│   │       ├── FilterPanel.vue
│   │       ├── ImageCarousel.vue
│   │       └── AdminLayout.vue
│   ├── index.html
│   ├── vite.config.ts
│   ├── package.json
│   └── tsconfig.json
└── docs/
    └── superpowers/specs/2026-05-08-jiayuan-estate-design.md
```

---

## Task 1: 后端项目初始化

**Files:**
- Create: `backend/package.json`
- Create: `backend/tsconfig.json`
- Create: `backend/wrangler.toml`
- Create: `backend/src/index.ts`
- Create: `backend/src/types.ts`

- [ ] **Step 1: 创建 backend 目录并初始化 package.json**

```bash
mkdir -p backend/src
```

```json
// backend/package.json
{
  "name": "jiayuan-estate-backend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "wrangler dev",
    "deploy": "wrangler deploy",
    "db:init": "wrangler d1 execute jiayuan-db --file=src/db/schema.sql",
    "db:init:local": "wrangler d1 execute jiayuan-db --local --file=src/db/schema.sql"
  },
  "dependencies": {
    "hono": "^4.4.0",
    "@hono/jwt": "^0.3.0"
  },
  "devDependencies": {
    "@cloudflare/workers-types": "^4.20240620.0",
    "typescript": "^5.5.0",
    "wrangler": "^3.60.0"
  }
}
```

> 注：密码哈希使用 Workers 内置的 Web Crypto API (PBKDF2)，无需 bcrypt 等额外依赖。

- [ ] **Step 2: 创建 tsconfig.json**

```json
// backend/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "bundler",
    "strict": true,
    "lib": ["ES2022"],
    "types": ["@cloudflare/workers-types"],
    "jsx": "react-jsx",
    "jsxImportSource": "hono/jsx",
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src/**/*.ts"]
}
```

- [ ] **Step 3: 创建 wrangler.toml**

```toml
# backend/wrangler.toml
name = "jiayuan-estate-api"
main = "src/index.ts"
compatibility_date = "2024-06-01"

[[d1_databases]]
binding = "DB"
database_name = "jiayuan-db"
database_id = "placeholder-replace-after-creating"

[[r2_buckets]]
binding = "IMAGES"
bucket_name = "jiayuan-images"

[vars]
JWT_SECRET = "change-this-to-a-random-string"
```

- [ ] **Step 4: 创建类型定义**

```typescript
// backend/src/types.ts
export interface Property {
  id: number;
  title: string;
  type: string;
  area: string;
  address: string;
  price: string;
  area_sqm: string | null;
  rooms: string | null;
  floor: string | null;
  image_keys: string | null;
  desc: string | null;
  hot: number;
  status: string;
  created_at: string;
}

export interface Admin {
  id: number;
  username: string;
  password: string;
}

export interface Env {
  DB: D1Database;
  IMAGES: R2Bucket;
  JWT_SECRET: string;
}
```

- [ ] **Step 5: 创建 Hono 入口**

```typescript
// backend/src/index.ts
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { Env } from './types';
import { propertiesRoutes } from './routes/properties';
import { adminRoutes } from './routes/admin';

const app = new Hono<{ Bindings: Env }>();

app.use('/*', cors());

app.route('/api', propertiesRoutes);
app.route('/api/admin', adminRoutes);

export default app;
```

- [ ] **Step 6: 安装依赖并验证**

```bash
cd backend && npm install
npx tsc --noEmit
```

Expected: 无报错（routes 文件还没创建会报错，先忽略）

- [ ] **Step 7: Commit**

```bash
git add backend/
git commit -m "feat: initialize backend project with Hono + Cloudflare Workers"
```

---

## Task 2: 数据库 Schema

**Files:**
- Create: `backend/src/db/schema.sql`

- [ ] **Step 1: 创建 schema.sql**

```sql
-- backend/src/db/schema.sql
CREATE TABLE IF NOT EXISTS properties (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  title      TEXT NOT NULL,
  type       TEXT NOT NULL,
  area       TEXT NOT NULL,
  address    TEXT NOT NULL,
  price      TEXT NOT NULL,
  area_sqm   TEXT,
  rooms      TEXT,
  floor      TEXT,
  image_keys TEXT,
  desc       TEXT,
  hot        INTEGER DEFAULT 0,
  status     TEXT DEFAULT '在售',
  created_at TEXT DEFAULT (datetime('now', 'localtime'))
);

CREATE TABLE IF NOT EXISTS admins (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);

-- 插入默认管理员 (密码: admin123, PBKDF2 hash)
-- hash 会在部署时通过 wrangler 命令生成并插入
```

- [ ] **Step 2: 本地初始化数据库**

```bash
cd backend
npx wrangler d1 create jiayuan-db
# 把输出的 database_id 填入 wrangler.toml
npx wrangler d1 execute jiayuan-db --local --file=src/db/schema.sql
```

- [ ] **Step 3: Commit**

```bash
git add backend/src/db/
git commit -m "feat: add database schema for properties and admins"
```

---

## Task 3: 公开房源 API

**Files:**
- Create: `backend/src/routes/properties.ts`

- [ ] **Step 1: 创建 properties 路由**

```typescript
// backend/src/routes/properties.ts
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
```

- [ ] **Step 2: 本地测试**

```bash
cd backend
npx wrangler dev --local
# 另一个终端
curl http://localhost:8787/api/properties
curl http://localhost:8787/api/properties/hot
curl http://localhost:8787/api/areas
```

Expected: 返回空数据的 JSON

- [ ] **Step 3: Commit**

```bash
git add backend/src/routes/properties.ts
git commit -m "feat: add public property listing API endpoints"
```

---

## Task 4: 管理员认证 API

**Files:**
- Create: `backend/src/middleware/auth.ts`
- Modify: `backend/src/routes/admin.ts` (创建)
- Modify: `backend/src/index.ts` (已有)

- [ ] **Step 1: 创建 JWT 鉴权中间件**

```typescript
// backend/src/middleware/auth.ts
import { Context, Next } from 'hono';
import { verify } from '@hono/jwt';
import { Env } from '../types';

export async function authMiddleware(c: Context<{ Bindings: Env }>, next: Next) {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: '未登录' }, 401);
  }
  const token = authHeader.slice(7);
  try {
    const payload = await verify(token, c.env.JWT_SECRET);
    c.set('adminId', payload.id);
    await next();
  } catch {
    return c.json({ error: 'token 无效或已过期' }, 401);
  }
}
```

- [ ] **Step 2: 创建密码哈希工具函数**

```typescript
// backend/src/utils/crypto.ts
// 使用 Web Crypto API 的 PBKDF2，Workers 内置支持

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' }, key, 256
  );
  const hash = btoa(String.fromCharCode(...new Uint8Array(bits)));
  const saltB64 = btoa(String.fromCharCode(...salt));
  return `pbkdf2:100000:${saltB64}:${hash}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [algo, iterations, saltB64, hashB64] = stored.split(':');
  if (algo !== 'pbkdf2') return false;
  const salt = Uint8Array.from(atob(saltB64), c => c.charCodeAt(0));
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: parseInt(iterations), hash: 'SHA-256' }, key, 256
  );
  const hash = btoa(String.fromCharCode(...new Uint8Array(bits)));
  return hash === hashB64;
}
```

- [ ] **Step 3: 创建 admin 路由（登录）**

```typescript
// backend/src/routes/admin.ts
import { Hono } from 'hono';
import { sign } from '@hono/jwt';
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
```

- [ ] **Step 4: 验证编译**

```bash
cd backend && npx tsc --noEmit
```

Expected: 无报错

- [ ] **Step 5: Commit**

```bash
git add backend/src/middleware/ backend/src/routes/admin.ts backend/src/utils/
git commit -m "feat: add admin auth API with JWT and password hashing"
```

---

## Task 5: 管理员 CRUD API

**Files:**
- Modify: `backend/src/routes/admin.ts`

- [ ] **Step 1: 添加房源 CRUD 到 admin.ts**

在 `adminRoutes.use('/*', authMiddleware)` 之后添加：

```typescript
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
```

- [ ] **Step 2: 验证编译**

```bash
cd backend && npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add backend/src/routes/admin.ts
git commit -m "feat: add admin property CRUD API"
```

---

## Task 6: 图片上传 API

**Files:**
- Modify: `backend/src/routes/admin.ts`

- [ ] **Step 1: 添加上传路由到 admin.ts**

```typescript
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
```

- [ ] **Step 2: Commit**

```bash
git add backend/src/routes/admin.ts
git commit -m "feat: add image upload to R2"
```

---

## Task 7: 前端项目初始化

**Files:**
- Create: `frontend/package.json`
- Create: `frontend/vite.config.ts`
- Create: `frontend/tsconfig.json`
- Create: `frontend/index.html`
- Create: `frontend/src/main.ts`
- Create: `frontend/src/App.vue`
- Create: `frontend/src/router/index.ts`
- Create: `frontend/src/api/index.ts`
- Create: `frontend/src/types.ts`
- Create: `frontend/src/styles/main.css`

- [ ] **Step 1: 创建 package.json**

```json
// frontend/package.json
{
  "name": "jiayuan-estate-frontend",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc --noEmit && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "vue": "^3.4.0",
    "vue-router": "^4.3.0",
    "axios": "^1.7.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",
    "typescript": "^5.5.0",
    "vite": "^5.3.0",
    "vue-tsc": "^2.0.0"
  }
}
```

- [ ] **Step 2: 创建 vite.config.ts**

```typescript
// frontend/vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': 'http://localhost:8787',
    },
  },
});
```

- [ ] **Step 3: 创建 index.html**

```html
<!-- frontend/index.html -->
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>嘉原地产</title>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.ts"></script>
</body>
</html>
```

- [ ] **Step 4: 创建全局样式**

```css
/* frontend/src/styles/main.css */
:root {
  --bg-main: #FAF7F2;
  --color-primary: #C4A882;
  --color-accent: #8B6F47;
  --color-card: #FFFFFF;
  --color-text: #3D3225;
  --color-text-secondary: #8C8279;
  --color-border: #E8E0D6;
  --radius: 12px;
  --shadow: 0 2px 12px rgba(61, 50, 37, 0.08);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  background: var(--bg-main);
  color: var(--color-text);
  line-height: 1.6;
}

a {
  color: var(--color-accent);
  text-decoration: none;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 24px;
  border-radius: 8px;
  border: none;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: var(--color-accent);
  color: #fff;
}

.btn-primary:hover {
  background: #7A6040;
}

.btn-outline {
  background: transparent;
  color: var(--color-accent);
  border: 1px solid var(--color-primary);
}

.btn-outline:hover {
  background: var(--color-primary);
  color: #fff;
}

.card {
  background: var(--color-card);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  overflow: hidden;
}
```

- [ ] **Step 5: 创建类型定义**

```typescript
// frontend/src/types.ts
export interface Property {
  id: number;
  title: string;
  type: string;
  area: string;
  address: string;
  price: string;
  area_sqm: string | null;
  rooms: string | null;
  floor: string | null;
  image_keys: string | null;
  desc: string | null;
  hot: number;
  status: string;
  created_at: string;
}

export interface ApiResponse<T> {
  data: T;
  total?: number;
  page?: number;
  pageSize?: number;
}
```

- [ ] **Step 6: 创建 API 封装**

```typescript
// frontend/src/api/index.ts
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(err);
  }
);

export default api;
```

- [ ] **Step 7: 创建路由**

```typescript
// frontend/src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: '/', component: () => import('../views/Home.vue') },
  { path: '/list', component: () => import('../views/List.vue') },
  { path: '/detail/:id', component: () => import('../views/Detail.vue') },
  { path: '/about', component: () => import('../views/About.vue') },
  { path: '/admin/login', component: () => import('../views/admin/Login.vue') },
  {
    path: '/admin',
    component: () => import('../views/admin/Dashboard.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/properties',
    component: () => import('../views/admin/Properties.vue'),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !localStorage.getItem('token')) {
    return '/admin/login';
  }
});

export default router;
```

- [ ] **Step 8: 创建 main.ts 和 App.vue**

```typescript
// frontend/src/main.ts
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './styles/main.css';

createApp(App).use(router).mount('#app');
```

```vue
<!-- frontend/src/App.vue -->
<template>
  <router-view />
</template>
```

- [ ] **Step 9: 安装依赖并验证**

```bash
cd frontend && npm install && npm run dev
```

Expected: 开发服务器启动在 http://localhost:5173

- [ ] **Step 10: Commit**

```bash
git add frontend/
git commit -m "feat: initialize frontend project with Vue 3 + Vite + Router"
```

---

## Task 8: 前端公共组件

**Files:**
- Create: `frontend/src/components/PropertyCard.vue`
- Create: `frontend/src/components/SearchBar.vue`
- Create: `frontend/src/components/FilterPanel.vue`
- Create: `frontend/src/components/ImageCarousel.vue`

- [ ] **Step 1: PropertyCard.vue**

```vue
<!-- frontend/src/components/PropertyCard.vue -->
<template>
  <router-link :to="`/detail/${property.id}`" class="property-card card">
    <div class="card-image">
      <img v-if="imageUrl" :src="imageUrl" :alt="property.title" />
      <div v-else class="placeholder">暂无图片</div>
      <span class="badge" :class="property.type">{{ property.type }}</span>
    </div>
    <div class="card-body">
      <h3 class="title">{{ property.title }}</h3>
      <p class="info">
        <span v-if="property.rooms">{{ property.rooms }}</span>
        <span v-if="property.area_sqm"> | {{ property.area_sqm }}</span>
        <span v-if="property.floor"> | {{ property.floor }}</span>
      </p>
      <p class="location">{{ property.area }} {{ property.address }}</p>
      <p class="price">{{ property.price }}</p>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Property } from '../types';

const props = defineProps<{ property: Property }>();

const imageUrl = computed(() => {
  const keys = props.property.image_keys?.split(',').filter(Boolean);
  return keys?.length ? `/api/images/${keys[0]}` : null;
});
</script>

<style scoped>
.property-card {
  display: block;
  transition: transform 0.2s;
}
.property-card:hover {
  transform: translateY(-4px);
}
.card-image {
  position: relative;
  height: 180px;
  background: var(--color-border);
}
.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--color-text-secondary);
}
.badge {
  position: absolute;
  top: 8px;
  left: 8px;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: #fff;
}
.badge.新房 { background: #4CAF50; }
.badge.二手房 { background: var(--color-accent); }
.badge.租房 { background: #2196F3; }
.card-body {
  padding: 12px;
}
.title {
  font-size: 16px;
  margin-bottom: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.info {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-bottom: 4px;
}
.location {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-bottom: 8px;
}
.price {
  font-size: 18px;
  font-weight: 600;
  color: #E64A19;
}
</style>
```

- [ ] **Step 2: SearchBar.vue**

```vue
<!-- frontend/src/components/SearchBar.vue -->
<template>
  <div class="search-bar">
    <input
      v-model="keyword"
      type="text"
      placeholder="搜索小区名、地址..."
      @keyup.enter="onSearch"
    />
    <button class="btn btn-primary" @click="onSearch">搜索</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{ search: [keyword: string] }>();
const keyword = ref('');

function onSearch() {
  emit('search', keyword.value.trim());
}
</script>

<style scoped>
.search-bar {
  display: flex;
  gap: 8px;
  padding: 12px;
  background: var(--color-card);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}
.search-bar input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 15px;
  outline: none;
}
.search-bar input:focus {
  border-color: var(--color-primary);
}
</style>
```

- [ ] **Step 3: FilterPanel.vue**

```vue
<!-- frontend/src/components/FilterPanel.vue -->
<template>
  <div class="filter-panel">
    <div class="filter-group">
      <label>类型</label>
      <div class="options">
        <button v-for="t in types" :key="t" :class="{ active: filters.type === t }" @click="toggle('type', t)">{{ t }}</button>
      </div>
    </div>
    <div class="filter-group">
      <label>区域</label>
      <div class="options">
        <button v-for="a in areas" :key="a" :class="{ active: filters.area === a }" @click="toggle('area', a)">{{ a }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

defineProps<{ areas: string[] }>();
const emit = defineEmits<{ change: [filters: { type: string; area: string }] }>();

const types = ['不限', '新房', '二手房', '租房'];
const filters = reactive({ type: '不限', area: '不限' });

function toggle(field: 'type' | 'area', value: string) {
  filters[field] = value;
  emit('change', { ...filters });
}
</script>

<style scoped>
.filter-panel {
  padding: 12px;
  background: var(--color-card);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}
.filter-group {
  margin-bottom: 12px;
}
.filter-group:last-child {
  margin-bottom: 0;
}
.filter-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
}
.options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.options button {
  padding: 6px 14px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: transparent;
  font-size: 13px;
  cursor: pointer;
}
.options button.active {
  background: var(--color-accent);
  color: #fff;
  border-color: var(--color-accent);
}
</style>
```

- [ ] **Step 4: ImageCarousel.vue**

```vue
<!-- frontend/src/components/ImageCarousel.vue -->
<template>
  <div class="carousel" v-if="images.length">
    <div class="carousel-track" :style="{ transform: `translateX(-${current * 100}%)` }">
      <div v-for="(img, i) in images" :key="i" class="slide">
        <img :src="img" :alt="`图片 ${i + 1}`" />
      </div>
    </div>
    <div class="dots" v-if="images.length > 1">
      <span v-for="(_, i) in images" :key="i" :class="{ active: i === current }" @click="current = i"></span>
    </div>
  </div>
  <div v-else class="no-images">暂无图片</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps<{ images: string[] }>();
const current = ref(0);
</script>

<style scoped>
.carousel {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius);
}
.carousel-track {
  display: flex;
  transition: transform 0.3s ease;
}
.slide {
  min-width: 100%;
}
.slide img {
  width: 100%;
  height: 280px;
  object-fit: cover;
}
.dots {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
}
.dots span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255,255,255,0.5);
  cursor: pointer;
}
.dots span.active {
  background: #fff;
}
.no-images {
  height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-border);
  border-radius: var(--radius);
  color: var(--color-text-secondary);
}
</style>
```

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/
git commit -m "feat: add shared components (PropertyCard, SearchBar, FilterPanel, ImageCarousel)"
```

---

## Task 9: 前台首页

**Files:**
- Create: `frontend/src/views/Home.vue`

- [ ] **Step 1: 创建 Home.vue**

```vue
<!-- frontend/src/views/Home.vue -->
<template>
  <div class="home">
    <!-- 顶部导航 -->
    <header class="header">
      <div class="container header-inner">
        <h1 class="logo">嘉原地产</h1>
        <nav>
          <router-link to="/">首页</router-link>
          <router-link to="/list">房源</router-link>
          <router-link to="/about">关于我们</router-link>
        </nav>
      </div>
    </header>

    <!-- Banner -->
    <section class="banner">
      <div class="container">
        <h2>找到理想的家</h2>
        <p>嘉原地产，为您精选优质房源</p>
        <SearchBar @search="goSearch" />
      </div>
    </section>

    <!-- 推荐房源 -->
    <section class="section container">
      <h2 class="section-title">推荐房源</h2>
      <div class="grid">
        <PropertyCard v-for="p in hotList" :key="p.id" :property="p" />
      </div>
    </section>

    <!-- 区域入口 -->
    <section class="section container">
      <h2 class="section-title">按区域找房</h2>
      <div class="area-grid">
        <router-link v-for="a in areas" :key="a" :to="`/list?area=${a}`" class="area-item card">
          {{ a }}
        </router-link>
      </div>
    </section>

    <!-- 底部 -->
    <footer class="footer">
      <div class="container">
        <p>© 2026 嘉原地产 版权所有</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api';
import type { Property } from '../types';
import SearchBar from '../components/SearchBar.vue';
import PropertyCard from '../components/PropertyCard.vue';

const router = useRouter();
const hotList = ref<Property[]>([]);
const areas = ref<string[]>([]);

onMounted(async () => {
  const [hotRes, areasRes] = await Promise.all([
    api.get('/properties/hot'),
    api.get('/areas'),
  ]);
  hotList.value = hotRes.data.data;
  areas.value = areasRes.data.data;
});

function goSearch(keyword: string) {
  router.push({ path: '/list', query: keyword ? { keyword } : {} });
}
</script>

<style scoped>
.header {
  background: var(--color-card);
  box-shadow: var(--shadow);
  position: sticky;
  top: 0;
  z-index: 100;
}
.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
}
.logo {
  font-size: 20px;
  color: var(--color-accent);
}
nav {
  display: flex;
  gap: 20px;
}
nav a {
  font-size: 15px;
  color: var(--color-text);
}
nav a.router-link-exact-active {
  color: var(--color-accent);
  font-weight: 600;
}
.banner {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
  padding: 48px 0;
  text-align: center;
  color: #fff;
}
.banner h2 {
  font-size: 28px;
  margin-bottom: 8px;
}
.banner p {
  font-size: 16px;
  margin-bottom: 20px;
  opacity: 0.9;
}
.section {
  padding: 32px 16px;
}
.section-title {
  font-size: 20px;
  margin-bottom: 16px;
  padding-left: 12px;
  border-left: 3px solid var(--color-accent);
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}
.area-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
}
.area-item {
  padding: 16px;
  text-align: center;
  font-size: 15px;
  color: var(--color-accent);
  font-weight: 500;
}
.footer {
  background: var(--color-text);
  color: var(--color-text-secondary);
  text-align: center;
  padding: 20px 0;
  margin-top: 32px;
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/views/Home.vue
git commit -m "feat: add homepage with hero, hot listings, and area navigation"
```

---

## Task 10: 前台列表页

**Files:**
- Create: `frontend/src/views/List.vue`

- [ ] **Step 1: 创建 List.vue**

```vue
<!-- frontend/src/views/List.vue -->
<template>
  <div class="list-page">
    <header class="header">
      <div class="container header-inner">
        <router-link to="/" class="logo">嘉原地产</router-link>
        <nav>
          <router-link to="/">首页</router-link>
          <router-link to="/list">房源</router-link>
          <router-link to="/about">关于我们</router-link>
        </nav>
      </div>
    </header>

    <div class="container content">
      <div class="sidebar">
        <SearchBar @search="onSearch" />
        <FilterPanel :areas="areas" @change="onFilter" />
      </div>
      <div class="main">
        <div class="result-info">
          共 <strong>{{ total }}</strong> 套房源
        </div>
        <div class="grid">
          <PropertyCard v-for="p in list" :key="p.id" :property="p" />
        </div>
        <div v-if="!list.length" class="empty">暂无符合条件的房源</div>
        <div class="pagination" v-if="total > pageSize">
          <button class="btn btn-outline" :disabled="page <= 1" @click="changePage(page - 1)">上一页</button>
          <span>{{ page }} / {{ Math.ceil(total / pageSize) }}</span>
          <button class="btn btn-outline" :disabled="page >= Math.ceil(total / pageSize)" @click="changePage(page + 1)">下一页</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../api';
import type { Property } from '../types';
import SearchBar from '../components/SearchBar.vue';
import FilterPanel from '../components/FilterPanel.vue';
import PropertyCard from '../components/PropertyCard.vue';

const route = useRoute();
const router = useRouter();
const list = ref<Property[]>([]);
const areas = ref<string[]>([]);
const total = ref(0);
const page = ref(1);
const pageSize = 12;
const filters = ref({ type: '', area: '', keyword: '' });

async function fetchList() {
  const params: any = { page: page.value, pageSize };
  if (filters.value.type && filters.value.type !== '不限') params.type = filters.value.type;
  if (filters.value.area && filters.value.area !== '不限') params.area = filters.value.area;
  if (filters.value.keyword) params.keyword = filters.value.keyword;
  const res = await api.get('/properties', { params });
  list.value = res.data.data;
  total.value = res.data.total;
}

async function fetchAreas() {
  const res = await api.get('/areas');
  areas.value = res.data.data;
}

function onSearch(keyword: string) {
  filters.value.keyword = keyword;
  page.value = 1;
  fetchList();
}

function onFilter(f: { type: string; area: string }) {
  filters.value.type = f.type;
  filters.value.area = f.area;
  page.value = 1;
  fetchList();
}

function changePage(p: number) {
  page.value = p;
  fetchList();
  window.scrollTo(0, 0);
}

onMounted(() => {
  if (route.query.area) filters.value.area = route.query.area as string;
  if (route.query.keyword) filters.value.keyword = route.query.keyword as string;
  fetchAreas();
  fetchList();
});
</script>

<style scoped>
.header {
  background: var(--color-card);
  box-shadow: var(--shadow);
  position: sticky;
  top: 0;
  z-index: 100;
}
.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
}
.logo {
  font-size: 20px;
  color: var(--color-accent);
  font-weight: 700;
}
nav {
  display: flex;
  gap: 20px;
}
nav a {
  font-size: 15px;
  color: var(--color-text);
}
nav a.router-link-exact-active {
  color: var(--color-accent);
}
.content {
  display: flex;
  gap: 20px;
  padding: 20px 16px;
}
.sidebar {
  width: 280px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.main {
  flex: 1;
  min-width: 0;
}
.result-info {
  margin-bottom: 12px;
  font-size: 14px;
  color: var(--color-text-secondary);
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}
.empty {
  text-align: center;
  padding: 48px;
  color: var(--color-text-secondary);
}
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
}

@media (max-width: 768px) {
  .content {
    flex-direction: column;
  }
  .sidebar {
    width: 100%;
  }
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/views/List.vue
git commit -m "feat: add property listing page with filters and pagination"
```

---

## Task 11: 前台详情页

**Files:**
- Create: `frontend/src/views/Detail.vue`

- [ ] **Step 1: 创建 Detail.vue**

```vue
<!-- frontend/src/views/Detail.vue -->
<template>
  <div class="detail-page">
    <header class="header">
      <div class="container header-inner">
        <router-link to="/" class="logo">嘉原地产</router-link>
        <nav>
          <router-link to="/">首页</router-link>
          <router-link to="/list">房源</router-link>
          <router-link to="/about">关于我们</router-link>
        </nav>
      </div>
    </header>

    <div class="container content" v-if="property">
      <ImageCarousel :images="imageUrls" />

      <div class="info-card card">
        <div class="price-row">
          <span class="price">{{ property.price }}</span>
          <span class="status-tag" :class="property.status">{{ property.status }}</span>
        </div>
        <h1 class="title">{{ property.title }}</h1>

        <div class="meta-grid">
          <div class="meta-item">
            <span class="label">户型</span>
            <span class="value">{{ property.rooms || '-' }}</span>
          </div>
          <div class="meta-item">
            <span class="label">面积</span>
            <span class="value">{{ property.area_sqm || '-' }}</span>
          </div>
          <div class="meta-item">
            <span class="label">楼层</span>
            <span class="value">{{ property.floor || '-' }}</span>
          </div>
          <div class="meta-item">
            <span class="label">类型</span>
            <span class="value">{{ property.type }}</span>
          </div>
        </div>

        <div class="address">
          <span class="label">地址</span>
          <span>{{ property.area }} {{ property.address }}</span>
        </div>
      </div>

      <div class="desc-card card" v-if="property.desc">
        <h3>房源描述</h3>
        <p>{{ property.desc }}</p>
      </div>

      <div class="contact-card card">
        <h3>咨询房源</h3>
        <p>对这套房源感兴趣？联系我们了解更多详情。</p>
        <p class="phone">电话：400-XXX-XXXX</p>
      </div>
    </div>

    <div v-else class="container loading">加载中...</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '../api';
import type { Property } from '../types';
import ImageCarousel from '../components/ImageCarousel.vue';

const route = useRoute();
const property = ref<Property | null>(null);

const imageUrls = computed(() => {
  if (!property.value?.image_keys) return [];
  return property.value.image_keys.split(',').filter(Boolean).map(k => `/api/images/${k}`);
});

onMounted(async () => {
  const res = await api.get(`/properties/${route.params.id}`);
  property.value = res.data.data;
});
</script>

<style scoped>
.header {
  background: var(--color-card);
  box-shadow: var(--shadow);
  position: sticky;
  top: 0;
  z-index: 100;
}
.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
}
.logo {
  font-size: 20px;
  color: var(--color-accent);
  font-weight: 700;
}
nav {
  display: flex;
  gap: 20px;
}
nav a {
  font-size: 15px;
  color: var(--color-text);
}
.content {
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.info-card {
  padding: 20px;
}
.price-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}
.price {
  font-size: 24px;
  font-weight: 700;
  color: #E64A19;
}
.status-tag {
  padding: 2px 10px;
  border-radius: 4px;
  font-size: 13px;
  color: #fff;
}
.status-tag.在售 { background: #4CAF50; }
.status-tag.已售 { background: #9E9E9E; }
.status-tag.已租 { background: #2196F3; }
.title {
  font-size: 20px;
  margin-bottom: 16px;
}
.meta-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 12px;
}
.meta-item {
  display: flex;
  flex-direction: column;
}
.meta-item .label {
  font-size: 13px;
  color: var(--color-text-secondary);
}
.meta-item .value {
  font-size: 15px;
  font-weight: 500;
}
.address {
  font-size: 14px;
}
.address .label {
  color: var(--color-text-secondary);
  margin-right: 8px;
}
.desc-card, .contact-card {
  padding: 20px;
}
.desc-card h3, .contact-card h3 {
  font-size: 16px;
  margin-bottom: 12px;
  padding-left: 10px;
  border-left: 3px solid var(--color-accent);
}
.desc-card p {
  font-size: 14px;
  line-height: 1.8;
  color: var(--color-text-secondary);
}
.contact-card p {
  font-size: 14px;
  color: var(--color-text-secondary);
}
.phone {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-accent);
  margin-top: 8px;
}
.loading {
  text-align: center;
  padding: 48px;
  color: var(--color-text-secondary);
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/views/Detail.vue
git commit -m "feat: add property detail page with image carousel"
```

---

## Task 12: 关于我们页面

**Files:**
- Create: `frontend/src/views/About.vue`

- [ ] **Step 1: 创建 About.vue**

```vue
<!-- frontend/src/views/About.vue -->
<template>
  <div class="about-page">
    <header class="header">
      <div class="container header-inner">
        <router-link to="/" class="logo">嘉原地产</router-link>
        <nav>
          <router-link to="/">首页</router-link>
          <router-link to="/list">房源</router-link>
          <router-link to="/about">关于我们</router-link>
        </nav>
      </div>
    </header>

    <div class="container content">
      <div class="hero-card card">
        <h1>嘉原地产</h1>
        <p class="slogan">专业、诚信、温暖，为您找到理想的家</p>
      </div>

      <div class="info-grid">
        <div class="info-card card">
          <h3>公司简介</h3>
          <p>嘉原地产是一家专注于本地房产服务的中介机构，致力于为客户提供专业、透明、高效的二手房买卖、新房代理和房屋租赁服务。我们深耕本地市场，了解每一个小区的特点和价值。</p>
        </div>

        <div class="info-card card">
          <h3>服务范围</h3>
          <ul>
            <li>二手房买卖</li>
            <li>新房代理</li>
            <li>房屋租赁</li>
            <li>房产咨询</li>
          </ul>
        </div>

        <div class="info-card card">
          <h3>联系我们</h3>
          <p><strong>电话：</strong>400-XXX-XXXX</p>
          <p><strong>地址：</strong>XX市XX区XX路XX号</p>
          <p><strong>工作时间：</strong>周一至周日 9:00-18:00</p>
        </div>
      </div>
    </div>

    <footer class="footer">
      <div class="container">
        <p>© 2026 嘉原地产 版权所有</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.header {
  background: var(--color-card);
  box-shadow: var(--shadow);
  position: sticky;
  top: 0;
  z-index: 100;
}
.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
}
.logo {
  font-size: 20px;
  color: var(--color-accent);
  font-weight: 700;
}
nav {
  display: flex;
  gap: 20px;
}
nav a {
  font-size: 15px;
  color: var(--color-text);
}
nav a.router-link-exact-active {
  color: var(--color-accent);
}
.content {
  padding: 20px 16px;
}
.hero-card {
  text-align: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
  color: #fff;
  margin-bottom: 20px;
}
.hero-card h1 {
  font-size: 28px;
  margin-bottom: 8px;
}
.slogan {
  font-size: 16px;
  opacity: 0.9;
}
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}
.info-card {
  padding: 20px;
}
.info-card h3 {
  font-size: 16px;
  margin-bottom: 12px;
  padding-left: 10px;
  border-left: 3px solid var(--color-accent);
}
.info-card p, .info-card li {
  font-size: 14px;
  line-height: 1.8;
  color: var(--color-text-secondary);
}
.info-card ul {
  padding-left: 20px;
}
.footer {
  background: var(--color-text);
  color: var(--color-text-secondary);
  text-align: center;
  padding: 20px 0;
  margin-top: 32px;
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/views/About.vue
git commit -m "feat: add about us page"
```

---

## Task 13: 后台管理页面

**Files:**
- Create: `frontend/src/views/admin/Login.vue`
- Create: `frontend/src/views/admin/Dashboard.vue`
- Create: `frontend/src/views/admin/Properties.vue`
- Create: `frontend/src/components/AdminLayout.vue`

- [ ] **Step 1: AdminLayout.vue**

```vue
<!-- frontend/src/components/AdminLayout.vue -->
<template>
  <div class="admin-layout">
    <aside class="sidebar">
      <h2 class="logo">嘉原管理</h2>
      <nav>
        <router-link to="/admin">仪表盘</router-link>
        <router-link to="/admin/properties">房源管理</router-link>
        <router-link to="/">返回前台</router-link>
      </nav>
      <button class="logout" @click="logout">退出登录</button>
    </aside>
    <main class="main">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();
function logout() {
  localStorage.removeItem('token');
  router.push('/admin/login');
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
}
.sidebar {
  width: 200px;
  background: var(--color-text);
  color: #fff;
  padding: 20px;
  display: flex;
  flex-direction: column;
}
.logo {
  font-size: 18px;
  margin-bottom: 24px;
  color: var(--color-primary);
}
nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}
nav a {
  padding: 10px 12px;
  border-radius: 6px;
  color: rgba(255,255,255,0.7);
  font-size: 14px;
}
nav a.router-link-exact-active {
  background: var(--color-accent);
  color: #fff;
}
.logout {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.3);
  color: rgba(255,255,255,0.7);
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
}
.main {
  flex: 1;
  padding: 24px;
  background: var(--bg-main);
  overflow-y: auto;
}

@media (max-width: 768px) {
  .admin-layout {
    flex-direction: column;
  }
  .sidebar {
    width: 100%;
    flex-direction: row;
    align-items: center;
    padding: 12px;
    gap: 12px;
  }
  .logo {
    margin-bottom: 0;
    font-size: 16px;
  }
  nav {
    flex-direction: row;
    flex: 1;
  }
  .logout {
    margin-left: auto;
  }
}
</style>
```

- [ ] **Step 2: Login.vue**

```vue
<!-- frontend/src/views/admin/Login.vue -->
<template>
  <div class="login-page">
    <div class="login-card card">
      <h2>嘉原地产管理后台</h2>
      <form @submit.prevent="onLogin">
        <div class="field">
          <label>用户名</label>
          <input v-model="username" type="text" placeholder="请输入用户名" required />
        </div>
        <div class="field">
          <label>密码</label>
          <input v-model="password" type="password" placeholder="请输入密码" required />
        </div>
        <p v-if="error" class="error">{{ error }}</p>
        <button class="btn btn-primary full" type="submit">登录</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../api';

const router = useRouter();
const username = ref('');
const password = ref('');
const error = ref('');

async function onLogin() {
  error.value = '';
  try {
    const res = await api.post('/admin/login', {
      username: username.value,
      password: password.value,
    });
    localStorage.setItem('token', res.data.token);
    router.push('/admin');
  } catch (e: any) {
    error.value = e.response?.data?.error || '登录失败';
  }
}
</script>

<style scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: var(--bg-main);
}
.login-card {
  width: 100%;
  max-width: 380px;
  padding: 32px;
}
.login-card h2 {
  text-align: center;
  margin-bottom: 24px;
  color: var(--color-accent);
}
.field {
  margin-bottom: 16px;
}
.field label {
  display: block;
  font-size: 14px;
  margin-bottom: 6px;
}
.field input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 15px;
  outline: none;
}
.field input:focus {
  border-color: var(--color-primary);
}
.error {
  color: #E64A19;
  font-size: 13px;
  margin-bottom: 12px;
}
.full {
  width: 100%;
}
</style>
```

- [ ] **Step 3: Dashboard.vue**

```vue
<!-- frontend/src/views/admin/Dashboard.vue -->
<template>
  <AdminLayout>
    <h1>仪表盘</h1>
    <div class="stats">
      <div class="stat-card card">
        <span class="stat-value">{{ stats.total }}</span>
        <span class="stat-label">房源总数</span>
      </div>
      <div class="stat-card card">
        <span class="stat-value">{{ stats.selling }}</span>
        <span class="stat-label">在售</span>
      </div>
      <div class="stat-card card">
        <span class="stat-value">{{ stats.sold }}</span>
        <span class="stat-label">已售</span>
      </div>
      <div class="stat-card card">
        <span class="stat-value">{{ stats.rented }}</span>
        <span class="stat-label">已租</span>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../../api';
import AdminLayout from '../../components/AdminLayout.vue';

const stats = ref({ total: 0, selling: 0, sold: 0, rented: 0 });

onMounted(async () => {
  const res = await api.get('/admin/properties', { params: { pageSize: 1000 } });
  const all = res.data.data;
  stats.value = {
    total: all.length,
    selling: all.filter((p: any) => p.status === '在售').length,
    sold: all.filter((p: any) => p.status === '已售').length,
    rented: all.filter((p: any) => p.status === '已租').length,
  };
});
</script>

<style scoped>
h1 {
  margin-bottom: 20px;
}
.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
}
.stat-card {
  padding: 20px;
  text-align: center;
}
.stat-value {
  display: block;
  font-size: 32px;
  font-weight: 700;
  color: var(--color-accent);
}
.stat-label {
  font-size: 14px;
  color: var(--color-text-secondary);
}
</style>
```

- [ ] **Step 4: Properties.vue**

```vue
<!-- frontend/src/views/admin/Properties.vue -->
<template>
  <AdminLayout>
    <div class="properties-page">
      <div class="toolbar">
        <input v-model="keyword" placeholder="搜索房源..." @keyup.enter="fetchList" />
        <button class="btn btn-primary" @click="showForm = true">新增房源</button>
      </div>

      <table class="property-table card">
        <thead>
          <tr>
            <th>标题</th>
            <th>类型</th>
            <th>区域</th>
            <th>价格</th>
            <th>状态</th>
            <th>推荐</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in list" :key="p.id">
            <td>{{ p.title }}</td>
            <td>{{ p.type }}</td>
            <td>{{ p.area }}</td>
            <td>{{ p.price }}</td>
            <td>
              <select :value="p.status" @change="updateStatus(p, ($event.target as HTMLSelectElement).value)">
                <option>在售</option>
                <option>已售</option>
                <option>已租</option>
              </select>
            </td>
            <td>
              <input type="checkbox" :checked="p.hot === 1" @change="toggleHot(p)" />
            </td>
            <td>
              <button class="btn-small" @click="editProperty(p)">编辑</button>
              <button class="btn-small danger" @click="deleteProperty(p)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 新增/编辑弹窗 -->
      <div v-if="showForm" class="modal-overlay" @click.self="closeForm">
        <div class="modal card">
          <h3>{{ editing ? '编辑房源' : '新增房源' }}</h3>
          <form @submit.prevent="submitForm">
            <div class="form-grid">
              <div class="field">
                <label>标题 *</label>
                <input v-model="form.title" required />
              </div>
              <div class="field">
                <label>类型 *</label>
                <select v-model="form.type" required>
                  <option>新房</option>
                  <option>二手房</option>
                  <option>租房</option>
                </select>
              </div>
              <div class="field">
                <label>区域 *</label>
                <input v-model="form.area" required />
              </div>
              <div class="field">
                <label>地址 *</label>
                <input v-model="form.address" required />
              </div>
              <div class="field">
                <label>价格 *</label>
                <input v-model="form.price" placeholder="350万 或 5000/月" required />
              </div>
              <div class="field">
                <label>面积</label>
                <input v-model="form.area_sqm" placeholder="120㎡" />
              </div>
              <div class="field">
                <label>户型</label>
                <input v-model="form.rooms" placeholder="3室2厅1卫" />
              </div>
              <div class="field">
                <label>楼层</label>
                <input v-model="form.floor" placeholder="中层/18层" />
              </div>
            </div>
            <div class="field">
              <label>描述</label>
              <textarea v-model="form.desc" rows="3"></textarea>
            </div>
            <div class="field">
              <label>图片</label>
              <input type="file" accept="image/*" multiple @change="onFileChange" />
              <div class="image-preview" v-if="imagePreviews.length">
                <div v-for="(img, i) in imagePreviews" :key="i" class="preview-item">
                  <img :src="img" />
                  <button type="button" @click="removeImage(i)">×</button>
                </div>
              </div>
            </div>
            <div class="form-actions">
              <button type="button" class="btn btn-outline" @click="closeForm">取消</button>
              <button type="submit" class="btn btn-primary">{{ editing ? '保存' : '新增' }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../../api';
import type { Property } from '../../types';
import AdminLayout from '../../components/AdminLayout.vue';

const list = ref<Property[]>([]);
const keyword = ref('');
const showForm = ref(false);
const editing = ref<Property | null>(null);
const imageFiles = ref<File[]>([]);
const imagePreviews = ref<string[]>([]);
const existingKeys = ref('');

const defaultForm = {
  title: '', type: '二手房', area: '', address: '', price: '',
  area_sqm: '', rooms: '', floor: '', desc: '', hot: 0, status: '在售',
};
const form = ref({ ...defaultForm });

async function fetchList() {
  const params: any = { pageSize: 100 };
  if (keyword.value) params.keyword = keyword.value;
  const res = await api.get('/admin/properties', { params });
  list.value = res.data.data;
}

function editProperty(p: Property) {
  editing.value = p;
  form.value = {
    title: p.title, type: p.type, area: p.area, address: p.address,
    price: p.price, area_sqm: p.area_sqm || '', rooms: p.rooms || '',
    floor: p.floor || '', desc: p.desc || '', hot: p.hot, status: p.status,
  };
  existingKeys.value = p.image_keys || '';
  imageFiles.value = [];
  imagePreviews.value = [];
  showForm.value = true;
}

function closeForm() {
  showForm.value = false;
  editing.value = null;
  form.value = { ...defaultForm };
  imageFiles.value = [];
  imagePreviews.value = [];
  existingKeys.value = '';
}

function onFileChange(e: Event) {
  const files = (e.target as HTMLInputElement).files;
  if (!files) return;
  for (const file of Array.from(files)) {
    imageFiles.value.push(file);
    const reader = new FileReader();
    reader.onload = (ev) => imagePreviews.value.push(ev.target?.result as string);
    reader.readAsDataURL(file);
  }
}

function removeImage(i: number) {
  imageFiles.value.splice(i, 1);
  imagePreviews.value.splice(i, 1);
}

async function submitForm() {
  // 上传新图片
  const newKeys: string[] = [];
  for (const file of imageFiles.value) {
    const fd = new FormData();
    fd.append('file', file);
    const res = await api.post('/admin/upload', fd);
    newKeys.push(res.data.key);
  }
  const allKeys = [existingKeys.value, ...newKeys].filter(Boolean).join(',');

  const payload = { ...form.value, image_keys: allKeys };
  if (editing.value) {
    await api.put(`/admin/properties/${editing.value.id}`, payload);
  } else {
    await api.post('/admin/properties', payload);
  }
  closeForm();
  fetchList();
}

async function updateStatus(p: Property, status: string) {
  await api.put(`/admin/properties/${p.id}`, { status });
  p.status = status;
}

async function toggleHot(p: Property) {
  await api.put(`/admin/properties/${p.id}`, { hot: p.hot === 1 ? 0 : 1 });
  p.hot = p.hot === 1 ? 0 : 1;
}

async function deleteProperty(p: Property) {
  if (!confirm(`确认删除「${p.title}」？`)) return;
  await api.delete(`/admin/properties/${p.id}`);
  fetchList();
}

onMounted(fetchList);
</script>

<style scoped>
.toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}
.toolbar input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 14px;
}
.property-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}
.property-table th, .property-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid var(--color-border);
}
.property-table th {
  background: var(--color-primary);
  color: #fff;
}
.btn-small {
  padding: 4px 10px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
  font-size: 12px;
  margin-right: 4px;
}
.btn-small.danger {
  color: #E64A19;
  border-color: #E64A19;
}
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal {
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 24px;
}
.modal h3 {
  margin-bottom: 16px;
}
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
.field {
  margin-bottom: 12px;
}
.field label {
  display: block;
  font-size: 13px;
  margin-bottom: 4px;
}
.field input, .field select, .field textarea {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 14px;
}
.image-preview {
  display: flex;
  gap: 8px;
  margin-top: 8px;
  flex-wrap: wrap;
}
.preview-item {
  position: relative;
  width: 80px;
  height: 80px;
}
.preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
}
.preview-item button {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #E64A19;
  color: #fff;
  border: none;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  .property-table {
    font-size: 12px;
  }
  .property-table th, .property-table td {
    padding: 8px 4px;
  }
}
</style>
```

- [ ] **Step 5: Commit**

```bash
git add frontend/src/views/admin/ frontend/src/components/AdminLayout.vue
git commit -m "feat: add admin pages (login, dashboard, property management)"
```

---

## Task 14: 部署配置

**Files:**
- Create: `README.md`

- [ ] **Step 1: 创建 Cloudflare D1 数据库**

```bash
cd backend
npx wrangler d1 create jiayuan-db
# 输出类似: database_id = "xxxx-xxxx-xxxx"
# 把这个 ID 填入 wrangler.toml 的 database_id
```

- [ ] **Step 2: 创建 R2 存储桶**

```bash
npx wrangler r2 bucket create jiayuan-images
```

- [ ] **Step 3: 初始化远程数据库**

```bash
npx wrangler d1 execute jiayuan-db --remote --file=src/db/schema.sql
```

- [ ] **Step 4: 部署后端**

```bash
npx wrangler deploy
```

记下输出的 Workers URL，如 `https://jiayuan-estate-api.xxx.workers.dev`

- [ ] **Step 5: 配置前端 API 地址**

生产环境需要把 `/api` 代理到 Workers URL。在 Cloudflare Pages 的项目设置中添加重写规则：
- 源路径: `/api/*`
- 目标: `https://jiayuan-estate-api.xxx.workers.dev/api/*`

或者在 `frontend/vite.config.ts` 中添加 production 代理。

- [ ] **Step 6: 部署前端到 Cloudflare Pages**

```bash
cd frontend
npm run build
# 在 Cloudflare Dashboard 中连接 Git 仓库，或手动上传 dist 目录
```

- [ ] **Step 7: 设置默认管理员密码**

```bash
# 生成 PBKDF2 hash（用 Node.js）
node -e "
const salt = require('crypto').randomBytes(16);
require('crypto').pbkdf2('admin123', salt, 100000, 32, 'sha256', (err, key) => {
  const hash = 'pbkdf2:100000:' + salt.toString('base64') + ':' + key.toString('base64');
  console.log(hash);
});
"

# 插入默认管理员（把上面输出的 hash 替换进去）
npx wrangler d1 execute jiayuan-db --remote --command="INSERT OR IGNORE INTO admins (username, password) VALUES ('admin', '替换为生成的hash')"
```

- [ ] **Step 8: 创建 README.md**

```markdown
# 嘉原地产网站

## 本地开发

### 后端
```bash
cd backend
npm install
npx wrangler d1 create jiayuan-db  # 首次需要
# 把 database_id 填入 wrangler.toml
npm run db:init:local
npm run dev
```

### 前端
```bash
cd frontend
npm install
npm run dev
```

访问 http://localhost:5173

## 部署

1. 后端: `cd backend && npx wrangler deploy`
2. 前端: 推送到 Git 仓库，Cloudflare Pages 自动构建部署
3. 数据库: `npx wrangler d1 execute jiayuan-db --remote --file=src/db/schema.sql`

## 默认管理员

- 用户名: admin
- 密码: admin123 (请登录后修改)
```

- [ ] **Step 9: Final Commit**

```bash
git add README.md
git commit -m "docs: add README with setup and deployment instructions"
```
