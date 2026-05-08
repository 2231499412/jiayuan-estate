# 嘉原地产网站

全栈房产信息展示网站，部署在 Cloudflare 生态（Pages + Workers + D1 + R2），零成本。

## 本地开发

### 后端

```bash
cd backend
npm install
npx wrangler d1 create jiayuan-db  # 首次需要，记下输出的 database_id
# 把 database_id 填入 wrangler.toml
npm run db:init:local
npm run dev
```

后端运行在 http://localhost:8787

### 前端

```bash
cd frontend
npm install
npm run dev
```

前端运行在 http://localhost:5173，API 请求自动代理到后端。

## 部署到 Cloudflare

### 1. 创建 D1 数据库

```bash
cd backend
npx wrangler d1 create jiayuan-db
# 把输出的 database_id 填入 wrangler.toml
```

### 2. 创建 R2 存储桶

```bash
npx wrangler r2 bucket create jiayuan-images
```

### 3. 初始化远程数据库

```bash
npx wrangler d1 execute jiayuan-db --remote --file=src/db/schema.sql
```

### 4. 设置默认管理员密码

```bash
# 生成 PBKDF2 hash
node -e "
const salt = require('crypto').randomBytes(16);
require('crypto').pbkdf2('admin123', salt, 100000, 32, 'sha256', (err, key) => {
  const hash = 'pbkdf2:100000:' + salt.toString('base64') + ':' + key.toString('base64');
  console.log(hash);
});
"

# 插入默认管理员（替换 hash）
npx wrangler d1 execute jiayuan-db --remote --command="INSERT OR IGNORE INTO admins (username, password) VALUES ('admin', '替换为生成的hash')"
```

### 5. 部署后端

```bash
npx wrangler deploy
```

记下输出的 Workers URL。

### 6. 部署前端

在 Cloudflare Dashboard 中：
1. 创建 Pages 项目，连接 Git 仓库
2. 构建命令：`npm run build`
3. 输出目录：`dist`
4. 添加重写规则：`/api/*` → Workers URL

或手动上传：
```bash
cd frontend
npm run build
# 在 Cloudflare Dashboard 上传 dist 目录
```

## 默认管理员

- 用户名：admin
- 密码：admin123（请登录后修改）

## 技术栈

- 前端：Vue 3 + Vite + Vue Router + Axios
- 后端：TypeScript + Hono (Cloudflare Workers)
- 数据库：Cloudflare D1 (SQLite)
- 图片存储：Cloudflare R2
- 认证：JWT + PBKDF2
