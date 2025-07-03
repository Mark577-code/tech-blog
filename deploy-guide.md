# 🚀 Vercel 部署指南

## 环境变量配置

在 Vercel 项目设置 → Environment Variables 中添加以下变量：

```env
# 应用基础配置
NEXT_PUBLIC_APP_NAME=Mark-李的博客
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NODE_ENV=production

# 社交媒体链接
NEXT_PUBLIC_GITHUB_URL=https://github.com/Mark577-code
NEXT_PUBLIC_LINKEDIN_URL=https://linkedin.com/in/your-username
NEXT_PUBLIC_TWITTER_URL=https://twitter.com/your-username
NEXT_PUBLIC_EMAIL=a3449322892@gmail.com

# Live2D模型配置
NEXT_PUBLIC_LIVE2D_MODEL_URL=https://fastly.jsdelivr.net/gh/fghrsh/live2d_api/model/

# 管理员配置（请修改为安全密码）
ADMIN_PASSWORD=your-secure-admin-password-here
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# 分析工具（可选）
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX

# GitHub API 配置（用于在线文章更新）
GITHUB_OWNER=Mark577-code
GITHUB_REPO=tech-blog
GITHUB_TOKEN=your-github-personal-access-token
GITHUB_BRANCH=main
```

## 部署步骤

### 1. 登录 Vercel
访问 [https://vercel.com/](https://vercel.com/) 并登录

### 2. 创建新项目
- 点击 "New Project"
- 选择 "Import Git Repository"
- 连接 GitHub 并选择 `tech-blog` 仓库

### 3. 配置项目
- **Project Name**: tech-blog 或自定义名称
- **Framework**: Next.js (自动检测)
- **Root Directory**: ./
- **Build Settings**: 保持默认

### 4. 部署
- 点击 "Deploy" 开始部署
- 等待构建完成（通常需要 2-5 分钟）

### 5. 配置自定义域名（可选）
- 在项目设置中点击 "Domains"
- 添加你的自定义域名
- 配置 DNS 记录

## 自动部署

配置完成后，每次向 `main` 分支推送代码都会自动触发重新部署：

```bash
git add .
git commit -m "更新博客内容"
git push origin main
```

## 部署状态检查

可以在以下位置查看部署状态：
- Vercel 控制台的 "Deployments" 页面
- 部署日志和错误信息
- 实时部署进度

## 常见问题

### Q: 部署失败怎么办？
A: 检查 Vercel 控制台的构建日志，常见原因：
- 环境变量配置错误
- 依赖安装失败
- 代码语法错误

### Q: 如何回滚到上一个版本？
A: 在 Vercel 控制台的 "Deployments" 页面，点击之前的部署版本进行回滚

### Q: 如何查看网站访问统计？
A: 在 Vercel 控制台的 "Analytics" 页面查看详细统计信息 