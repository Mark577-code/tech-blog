# 🚀 项目设置指南

## 📋 快速开始

### 1. 创建环境变量文件

在项目根目录创建 `.env.local` 文件：

```bash
# 复制环境变量模板
cp env.example .env.local
```

**最小必需配置**：
```env
# .env.local
NEXT_PUBLIC_APP_NAME="现代化技术博客"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_EMAIL="admin@example.com"

# 文章管理系统 - 重要！
ADMIN_PASSWORD="admin123"
JWT_SECRET="your-secret-key-change-this"
```

### 2. 安装依赖

```bash
npm install --legacy-peer-deps
# 或
pnpm install
```

### 3. 启动开发服务器

```bash
npm run dev
# 或
pnpm dev
```

## 🔐 文章管理系统使用

### 管理员登录

1. 访问：`http://localhost:3000/admin/login`
2. 输入密码：`admin123`（或您在环境变量中设置的密码）
3. 登录成功后进入管理仪表板

### API接口使用

#### 认证接口
```bash
# 管理员登录
POST /api/auth/login
{
  "password": "admin123"
}

# 获取当前用户
GET /api/auth/me

# 退出登录
POST /api/auth/logout
```

#### 文章管理接口
```bash
# 获取文章列表
GET /api/articles?status=published&page=1&limit=10

# 创建新文章（需要管理员权限）
POST /api/articles
{
  "title": "文章标题",
  "content": "# 文章内容\n\n这是一篇示例文章。",
  "category": "tech",
  "tags": ["前端", "React"],
  "status": "published"
}

# 更新文章（需要管理员权限）
PUT /api/articles/[id]

# 删除文章（需要管理员权限）
DELETE /api/articles/[id]
```

## 🔧 常见问题解决

### 1. 端口占用
如果3000端口被占用，Next.js会自动尝试3001、3002等端口。

### 2. 图片资源404
确保 `next.config.js` 中的 `remotePatterns` 包含您的图片域名。

### 3. Live2D模型加载失败
检查网络连接和 `NEXT_PUBLIC_LIVE2D_MODEL_URL` 配置。

### 4. 控制台警告
- **X-Frame-Options**: 已通过 `next.config.js` 的 headers 配置修复
- **图片LCP警告**: 已为关键图片添加 `priority` 属性
- **manifest.json 404**: 已创建PWA清单文件

## 📁 项目结构

```
tech-blog/
├── app/                    # Next.js App Router
│   ├── admin/             # 管理后台页面
│   │   └── login/         # 登录页面
│   ├── api/               # API路由
│   │   ├── auth/          # 认证相关API
│   │   └── articles/      # 文章管理API
│   └── components/        # 页面组件
├── lib/                   # 工具库
│   ├── auth.ts           # 认证工具
│   └── articles.ts       # 文章数据操作
├── types/                 # TypeScript类型定义
├── data/                  # 数据存储（自动创建）
│   ├── articles.json     # 文章数据
│   ├── categories.json   # 分类数据
│   └── tags.json         # 标签数据
└── public/               # 静态资源
```

## 🔒 安全配置

### 生产环境安全
1. **修改默认密码**：
   ```env
   ADMIN_PASSWORD="your-secure-password-here"
   ```

2. **设置强密钥**：
   ```env
   JWT_SECRET="your-super-secure-secret-key"
   ```

3. **启用HTTPS**：
   ```env
   NEXT_PUBLIC_APP_URL="https://yourdomain.com"
   ```

### 密码哈希
生产环境建议使用哈希密码：

```bash
# 使用Node.js生成哈希密码
node -e "const bcrypt=require('bcryptjs'); console.log(bcrypt.hashSync('your-password', 12))"
```

然后将生成的哈希值设置为 `ADMIN_PASSWORD`。

## 🚀 部署指南

### Vercel部署
1. 推送代码到GitHub
2. 在Vercel中导入项目
3. 设置环境变量
4. 部署完成

### 其他平台
- **Netlify**: 支持静态导出
- **Railway**: 支持全栈应用
- **Docker**: 可容器化部署

## 📞 获取帮助

- **GitHub Issues**: 报告问题和建议
- **文档**: 查看完整的API文档
- **社区**: 加入讨论群

---

🎉 **恭喜！** 您已成功设置了现代化技术博客系统！ 