# Vercel 环境变量配置

将以下环境变量复制到 Vercel 项目设置中：

## 🔑 核心配置（必须设置）

```bash
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-2024
```

## 🗄️ Supabase 数据库配置

```bash
NEXT_PUBLIC_SUPABASE_URL=https://aieatfsfsbhrjhjdnlhb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpZWF0ZnNmc2JocmpoamRubGhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1NTA5MDQsImV4cCI6MjA2NzEyNjkwNH0.pGXO09CnMm5b0-rdZEUVXyER0GcDTovOhFPEh-v65-I
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpZWF0ZnNmc2JocmpoamRubGhiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTU1MDkwNCwiZXhwIjoyMDY3MTI2OTA0fQ.ShTudi_JcKiEYIwTfhRfpuKNbFZTVzMgDYaPUYUx0wc
```

## 🌐 网站配置（可选）

```bash
NEXT_PUBLIC_APP_NAME=Mark-李的博客
NEXT_PUBLIC_APP_URL=https://your-vercel-domain.vercel.app
NODE_ENV=production
```

## 🔗 社交媒体链接（可选）

```bash
NEXT_PUBLIC_GITHUB_URL=https://github.com/Mark577-code
NEXT_PUBLIC_LINKEDIN_URL=https://linkedin.com/in/your-username
NEXT_PUBLIC_TWITTER_URL=https://twitter.com/your-username
NEXT_PUBLIC_EMAIL=your-email@example.com
```

## 📊 分析工具（可选）

```bash
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

## 🎭 Live2D 模型配置（可选）

```bash
NEXT_PUBLIC_LIVE2D_MODEL_URL=https://fastly.jsdelivr.net/gh/fghrsh/live2d_api/model/
```

## 🔧 GitHub API 配置（可选 - 用于在线文章更新）

```bash
GITHUB_OWNER=Mark577-code
GITHUB_REPO=tech-blog
GITHUB_TOKEN=your-github-personal-access-token
GITHUB_BRANCH=main
```

## 🚀 在 Vercel 中设置步骤：

1. 登录 [vercel.com](https://vercel.com)
2. 选择您的 tech-blog 项目
3. 点击 **Settings** → **Environment Variables**
4. 点击 **Add New** 添加每个环境变量
5. 确保每个变量都选择 **Production, Preview, Development**
6. 点击 **Save**
7. 在 **Deployments** 页面点击 **Redeploy**

## ⚠️ 重要提醒：

- **ADMIN_USERNAME** 和 **ADMIN_PASSWORD** 是登录必需的
- **JWT_SECRET** 建议改为更复杂的随机字符串
- **NEXT_PUBLIC_APP_URL** 要改为您的实际 Vercel 域名
- 其他可选变量可以根据需要添加

## 🧪 测试登录：

设置完成后访问：`https://your-vercel-domain.vercel.app/admin/login`

使用以下凭据登录：
- 用户名：`admin`
- 密码：`admin123`