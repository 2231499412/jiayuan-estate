# 嘉原地产网站设计文档

## 概述

为嘉原地产搭建一个房产信息展示网站，支持二手房/租房/新房的房源管理与展示。全栈部署在 Cloudflare 生态，零成本。

## 技术栈

| 层 | 技术 | Cloudflare 产品 |
|---|------|----------------|
| 前端 | Vue 3 + Vite | Pages |
| 后端 | TypeScript + Hono | Workers |
| 数据库 | D1 (SQLite) | D1 |
| 图片存储 | Cloudflare R2 | R2 |

## 数据库设计

### properties 表

```sql
CREATE TABLE properties (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  title      TEXT NOT NULL,
  type       TEXT NOT NULL,          -- 二手房/租房/新房
  area       TEXT NOT NULL,          -- 区域
  address    TEXT NOT NULL,
  price      TEXT NOT NULL,          -- "350万" 或 "5000/月"
  area_sqm   TEXT,
  rooms      TEXT,                   -- "3室2厅1卫"
  floor      TEXT,
  image_keys TEXT,                   -- R2 图片 key，逗号分隔
  desc       TEXT,
  hot        INTEGER DEFAULT 0,     -- 0=普通 1=推荐
  status     TEXT DEFAULT '在售',    -- 在售/已售/已租
  created_at TEXT DEFAULT (datetime('now', 'localtime'))
);
```

### admins 表

```sql
CREATE TABLE admins (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL             -- bcrypt 哈希
);
```

## API 设计

### 公开接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/properties` | 房源列表，支持 `?type=&area=&status=` 筛选 |
| GET | `/api/properties/:id` | 单个房源详情 |
| GET | `/api/properties/hot` | 推荐房源 |
| GET | `/api/areas` | 所有区域列表 |
| GET | `/api/images/:key` | 获取图片 |

### 管理接口（JWT 鉴权）

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/admin/login` | 登录 |
| GET | `/api/admin/properties` | 管理列表（含已售/已租） |
| POST | `/api/admin/properties` | 新增房源 |
| PUT | `/api/admin/properties/:id` | 编辑房源 |
| DELETE | `/api/admin/properties/:id` | 删除房源 |
| POST | `/api/admin/upload` | 上传图片到 R2 |

鉴权：管理接口需 `Authorization: Bearer <token>`，JWT 密钥存在 Workers 环境变量。

## 前端页面

### 前台（移动端优先）

| 页面 | 路由 | 内容 |
|------|------|------|
| 首页 | `/` | 轮播 banner、推荐房源卡片、区域入口、搜索框 |
| 列表页 | `/list` | 筛选栏（类型/区域/价格/户型）、房源卡片列表、分页 |
| 详情页 | `/detail/:id` | 图片轮播、价格/面积/户型/楼层、描述、联系方式 |
| 关于我们 | `/about` | 公司介绍、电话、地址 |

### 后台

| 页面 | 路由 | 内容 |
|------|------|------|
| 登录 | `/admin/login` | 用户名/密码 |
| 仪表盘 | `/admin` | 房源统计 |
| 房源管理 | `/admin/properties` | 表格、搜索、新增/编辑弹窗、图片上传、状态切换 |

## 设计风格

移动端优先，温馨居家风。配色：

| 元素 | 颜色 |
|------|------|
| 主背景 | 暖米白 `#FAF7F2` |
| 主色调 | 浅卡其 `#C4A882` |
| 强调色 | 原木棕 `#8B6F47` |
| 卡片背景 | 纯白 `#FFFFFF` |
| 文字主色 | 深棕灰 `#3D3225` |
| 文字副色 | 暖灰 `#8C8279` |

卡片圆角阴影，响应式适配手机端。

## 项目结构

```
jiayuan-estate/
├── frontend/                # Vue 3 + Vite
│   ├── src/
│   │   ├── views/           # 页面
│   │   ├── components/      # 复用组件
│   │   ├── router/
│   │   ├── api/             # 请求封装
│   │   └── styles/          # 全局样式
│   └── vite.config.ts
├── backend/                 # Workers + Hono
│   ├── src/
│   │   ├── index.ts         # 入口 + 路由
│   │   ├── routes/
│   │   ├── middleware/auth.ts
│   │   └── db/schema.sql
│   ├── wrangler.toml
│   └── package.json
└── README.md
```

## 部署

- 前端：git push → Cloudflare Pages 自动构建
- 后端：`npx wrangler deploy`
- 数据库：`npx wrangler d1 execute` 初始化
- 图片：管理后台上传 → R2
