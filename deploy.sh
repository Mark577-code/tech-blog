#!/bin/bash

# 技术博客 GitHub 部署脚本
# 使用方法: ./deploy.sh "提交信息"

echo "🚀 开始部署技术博客到GitHub..."

# 检查是否提供了提交信息
if [ -z "$1" ]; then
    echo "❌ 请提供提交信息"
    echo "使用方法: ./deploy.sh \"你的提交信息\""
    exit 1
fi

COMMIT_MESSAGE="$1"

# 检查是否在git仓库中
if [ ! -d ".git" ]; then
    echo "📁 初始化Git仓库..."
    git init
    echo "✅ Git仓库初始化完成"
fi

# 检查是否有远程仓库
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "🔗 请先添加远程仓库:"
    echo "git remote add origin https://github.com/your-username/tech-blog.git"
    echo "然后重新运行此脚本"
    exit 1
fi

# 创建环境变量示例文件
echo "📝 创建环境变量示例文件..."
cat > .env.example << 'EOF'
# 管理员认证配置
ADMIN_PASSWORD=your-secure-password-here
JWT_SECRET=your-jwt-secret-key-at-least-32-characters-long

# 网站基本配置
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=我的技术博客
NEXT_PUBLIC_SITE_DESCRIPTION=一个现代化的技术博客系统

# 可选配置
# NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
# NEXT_PUBLIC_UMAMI_WEBSITE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
EOF

# 创建.gitignore文件
echo "📝 创建.gitignore文件..."
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

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
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# Temporary folders
tmp/
temp/

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env.test

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# next.js build output
.next

# nuxt.js build output
.nuxt

# vuepress build output
.vuepress/dist

# Serverless directories
.serverless

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# Vercel
.vercel

# Uploads (optional - remove if you want to track uploads)
public/uploads/*
!public/uploads/.gitkeep
EOF

# 创建uploads目录的.gitkeep文件
echo "📁 确保uploads目录存在..."
mkdir -p public/uploads
touch public/uploads/.gitkeep

# 创建LICENSE文件
echo "📄 创建MIT许可证文件..."
cat > LICENSE << 'EOF'
MIT License

Copyright (c) 2025 Tech Blog

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
EOF

# 创建GitHub Actions工作流
echo "🔧 创建GitHub Actions工作流..."
mkdir -p .github/workflows
cat > .github/workflows/deploy.yml << 'EOF'
name: Deploy to Vercel

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build project
      run: npm run build
      
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
EOF

# 检查代码质量
echo "🔍 检查代码质量..."
if command -v npm &> /dev/null; then
    echo "📦 安装依赖..."
    npm install --silent
    
    echo "🧹 运行代码检查..."
    npm run lint --silent || echo "⚠️  代码检查发现问题，但继续部署..."
    
    echo "🏗️  构建项目..."
    npm run build || {
        echo "❌ 构建失败，请检查代码"
        exit 1
    }
    echo "✅ 构建成功"
else
    echo "⚠️  npm未安装，跳过代码检查"
fi

# 添加所有文件到Git
echo "📦 添加文件到Git..."
git add .

# 检查是否有变更
if git diff --staged --quiet; then
    echo "ℹ️  没有新的变更需要提交"
else
    # 提交变更
    echo "💾 提交变更..."
    git commit -m "$COMMIT_MESSAGE"
    echo "✅ 变更已提交"
fi

# 推送到GitHub
echo "🚀 推送到GitHub..."
git push origin main || git push origin master

echo ""
echo "🎉 部署完成！"
echo ""
echo "📋 下一步操作:"
echo "1. 访问 https://vercel.com 连接你的GitHub仓库"
echo "2. 配置环境变量:"
echo "   - ADMIN_PASSWORD=你的管理员密码"
echo "   - JWT_SECRET=你的JWT密钥"
echo "   - NEXT_PUBLIC_SITE_URL=https://你的域名.vercel.app"
echo "   - NEXT_PUBLIC_SITE_NAME=你的博客名称"
echo "3. 部署完成后访问你的博客！"
echo ""
echo "📚 更多信息请查看 README.md 文件"
echo "🐛 如有问题请提交 GitHub Issues"
echo "" 