# 🚀 GitHub部署指南

本指南将帮助您将技术博客项目快速部署到GitHub并通过Vercel发布到互联网。

## 📋 部署前准备

### 1. 环境要求
- ✅ Node.js 18.17+
- ✅ Git 已安装
- ✅ GitHub账号
- ✅ Vercel账号 (免费)

### 2. 项目检查
确保项目可以正常运行：
```bash
npm install
npm run build
npm run dev
```

## 🎯 一键部署方案

我们提供了自动化部署脚本，选择适合您操作系统的版本：

### Windows用户
```cmd
deploy.bat "初始版本发布"
```

### Linux/Mac用户
```bash
chmod +x deploy.sh
./deploy.sh "初始版本发布"
```

## 📝 手动部署步骤

如果您希望手动控制每个步骤：

### 1. 初始化Git仓库
```bash
# 如果还没有Git仓库
git init

# 添加远程仓库
git remote add origin https://github.com/your-username/tech-blog.git
```

### 2. 创建必要文件

#### .gitignore
```gitignore
# Dependencies
node_modules/
npm-debug.log*

# Next.js
.next/
out/
build/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Uploads (可选)
public/uploads/*
!public/uploads/.gitkeep
```

#### .env.example
```env
# 管理员认证配置
ADMIN_PASSWORD=your-secure-password-here
JWT_SECRET=your-jwt-secret-key-at-least-32-characters-long

# 网站基本配置
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=我的技术博客
NEXT_PUBLIC_SITE_DESCRIPTION=一个现代化的技术博客系统
```

### 3. 提交并推送代码
```bash
git add .
git commit -m "初始版本发布"
git push origin main
```

## 🌐 Vercel部署配置

### 1. 连接GitHub仓库
1. 访问 [vercel.com](https://vercel.com)
2. 使用GitHub账号登录
3. 点击 "New Project"
4. 选择您的tech-blog仓库
5. 点击 "Import"

### 2. 配置环境变量
在Vercel项目设置中添加以下环境变量：

| 变量名 | 值 | 说明 |
|--------|----|----|
| `ADMIN_PASSWORD` | `your-secure-password` | 管理员登录密码 |
| `JWT_SECRET` | `your-jwt-secret-32-chars-min` | JWT加密密钥 |
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain.vercel.app` | 网站URL |
| `NEXT_PUBLIC_SITE_NAME` | `我的技术博客` | 网站名称 |

### 3. 部署设置
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### 4. 自定义域名 (可选)
1. 在Vercel项目设置中点击 "Domains"
2. 添加您的自定义域名
3. 按照提示配置DNS记录

## 🔧 GitHub Actions自动部署

项目已包含GitHub Actions配置，每次推送到main分支时自动部署：

### 配置Secrets
在GitHub仓库设置中添加以下Secrets：

1. 进入仓库 → Settings → Secrets and variables → Actions
2. 添加以下secrets：
   - `VERCEL_TOKEN`: Vercel API Token
   - `ORG_ID`: Vercel组织ID
   - `PROJECT_ID`: Vercel项目ID

### 获取Vercel配置信息
```bash
# 安装Vercel CLI
npm i -g vercel

# 登录并获取配置
vercel login
vercel link

# 查看项目信息
cat .vercel/project.json
```

## 📊 部署后检查清单

### ✅ 功能测试
- [ ] 网站首页正常加载
- [ ] 文章列表页面正常
- [ ] 分类页面正常
- [ ] 管理后台可以登录
- [ ] 文章发布功能正常
- [ ] 图片上传功能正常

### ✅ 性能检查
- [ ] 页面加载速度 < 3秒
- [ ] 移动端适配正常
- [ ] SEO元数据正确
- [ ] 图片优化生效

### ✅ 安全检查
- [ ] 管理员密码足够复杂
- [ ] JWT密钥安全
- [ ] 环境变量未泄露
- [ ] HTTPS正常工作

## 🛠️ 常见问题解决

### 构建失败
```bash
# 检查依赖
npm install

# 清理缓存
rm -rf .next node_modules
npm install
npm run build
```

### 环境变量问题
1. 确保所有必需的环境变量都已设置
2. 检查变量名拼写是否正确
3. 重新部署项目

### 图片上传问题
1. 确保 `public/uploads` 目录存在
2. 检查文件权限设置
3. 验证上传API是否正常

### 管理后台无法访问
1. 检查 `ADMIN_PASSWORD` 环境变量
2. 确认 `JWT_SECRET` 已设置
3. 清除浏览器缓存和Cookie

## 📈 性能优化建议

### 1. 图片优化
- 使用WebP格式
- 启用图片懒加载
- 配置CDN加速

### 2. 缓存策略
```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/uploads/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}
```

### 3. 数据库升级
考虑从JSON文件升级到数据库：
- PostgreSQL (推荐)
- MongoDB
- SQLite

## 🔄 更新部署

### 日常更新
```bash
git add .
git commit -m "更新内容描述"
git push origin main
```

### 版本发布
```bash
# 创建版本标签
git tag -a v1.0.0 -m "版本 1.0.0"
git push origin v1.0.0
```

## 📞 技术支持

如果遇到部署问题：

1. **查看日志**: Vercel部署日志
2. **检查文档**: README.md
3. **提交Issue**: GitHub Issues
4. **社区支持**: 相关技术社区

## 🎉 部署成功！

恭喜您成功部署了技术博客！现在您可以：

- 📝 开始写作您的第一篇文章
- 🎨 自定义网站主题和样式
- 📊 查看网站访问统计
- 🔧 继续优化和扩展功能

---

**下一步**: 查看 [README.md](README.md) 了解更多功能和自定义选项。 