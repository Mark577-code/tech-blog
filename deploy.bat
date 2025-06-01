@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo 🚀 开始部署技术博客到GitHub...

REM 检查是否提供了提交信息
if "%~1"=="" (
    echo ❌ 请提供提交信息
    echo 使用方法: deploy.bat "你的提交信息"
    pause
    exit /b 1
)

set "COMMIT_MESSAGE=%~1"

REM 检查是否在git仓库中
if not exist ".git" (
    echo 📁 初始化Git仓库...
    git init
    echo ✅ Git仓库初始化完成
)

REM 检查是否有远程仓库
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo 🔗 请先添加远程仓库:
    echo git remote add origin https://github.com/your-username/tech-blog.git
    echo 然后重新运行此脚本
    pause
    exit /b 1
)

REM 创建环境变量示例文件
echo 📝 创建环境变量示例文件...
(
echo # 管理员认证配置
echo ADMIN_PASSWORD=your-secure-password-here
echo JWT_SECRET=your-jwt-secret-key-at-least-32-characters-long
echo.
echo # 网站基本配置
echo NEXT_PUBLIC_SITE_URL=http://localhost:3000
echo NEXT_PUBLIC_SITE_NAME=我的技术博客
echo NEXT_PUBLIC_SITE_DESCRIPTION=一个现代化的技术博客系统
echo.
echo # 可选配置
echo # NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
echo # NEXT_PUBLIC_UMAMI_WEBSITE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
) > .env.example

REM 创建.gitignore文件
echo 📝 创建.gitignore文件...
(
echo # Dependencies
echo node_modules/
echo npm-debug.log*
echo yarn-debug.log*
echo yarn-error.log*
echo.
echo # Next.js
echo .next/
echo out/
echo build/
echo.
echo # Environment variables
echo .env
echo .env.local
echo .env.development.local
echo .env.test.local
echo .env.production.local
echo.
echo # IDE
echo .vscode/
echo .idea/
echo *.swp
echo *.swo
echo.
echo # OS
echo .DS_Store
echo Thumbs.db
echo.
echo # Logs
echo logs/
echo *.log
echo.
echo # Runtime data
echo pids/
echo *.pid
echo *.seed
echo *.pid.lock
echo.
echo # Coverage directory used by tools like istanbul
echo coverage/
echo.
echo # Temporary folders
echo tmp/
echo temp/
echo.
echo # Optional npm cache directory
echo .npm
echo.
echo # Optional REPL history
echo .node_repl_history
echo.
echo # Output of 'npm pack'
echo *.tgz
echo.
echo # Yarn Integrity file
echo .yarn-integrity
echo.
echo # dotenv environment variables file
echo .env.test
echo.
echo # parcel-bundler cache (https://parceljs.org/^)
echo .cache
echo .parcel-cache
echo.
echo # next.js build output
echo .next
echo.
echo # nuxt.js build output
echo .nuxt
echo.
echo # vuepress build output
echo .vuepress/dist
echo.
echo # Serverless directories
echo .serverless
echo.
echo # FuseBox cache
echo .fusebox/
echo.
echo # DynamoDB Local files
echo .dynamodb/
echo.
echo # TernJS port file
echo .tern-port
echo.
echo # Vercel
echo .vercel
echo.
echo # Uploads (optional - remove if you want to track uploads^)
echo public/uploads/*
echo !public/uploads/.gitkeep
) > .gitignore

REM 创建uploads目录的.gitkeep文件
echo 📁 确保uploads目录存在...
if not exist "public\uploads" mkdir "public\uploads"
echo. > "public\uploads\.gitkeep"

REM 创建LICENSE文件
echo 📄 创建MIT许可证文件...
(
echo MIT License
echo.
echo Copyright (c^) 2025 Tech Blog
echo.
echo Permission is hereby granted, free of charge, to any person obtaining a copy
echo of this software and associated documentation files (the "Software"^), to deal
echo in the Software without restriction, including without limitation the rights
echo to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
echo copies of the Software, and to permit persons to whom the Software is
echo furnished to do so, subject to the following conditions:
echo.
echo The above copyright notice and this permission notice shall be included in all
echo copies or substantial portions of the Software.
echo.
echo THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
echo IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
echo FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
echo AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
echo LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
echo OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
echo SOFTWARE.
) > LICENSE

REM 创建GitHub Actions工作流
echo 🔧 创建GitHub Actions工作流...
if not exist ".github\workflows" mkdir ".github\workflows"
(
echo name: Deploy to Vercel
echo.
echo on:
echo   push:
echo     branches: [ main ]
echo   pull_request:
echo     branches: [ main ]
echo.
echo jobs:
echo   deploy:
echo     runs-on: ubuntu-latest
echo.    
echo     steps:
echo     - name: Checkout
echo       uses: actions/checkout@v4
echo.      
echo     - name: Setup Node.js
echo       uses: actions/setup-node@v4
echo       with:
echo         node-version: '18'
echo         cache: 'npm'
echo.        
echo     - name: Install dependencies
echo       run: npm ci
echo.      
echo     - name: Build project
echo       run: npm run build
echo.      
echo     - name: Deploy to Vercel
echo       uses: amondnet/vercel-action@v25
echo       with:
echo         vercel-token: ${{ secrets.VERCEL_TOKEN }}
echo         vercel-org-id: ${{ secrets.ORG_ID }}
echo         vercel-project-id: ${{ secrets.PROJECT_ID }}
echo         vercel-args: '--prod'
) > ".github\workflows\deploy.yml"

REM 检查代码质量
echo 🔍 检查代码质量...
where npm >nul 2>&1
if not errorlevel 1 (
    echo 📦 安装依赖...
    npm install --silent
    
    echo 🧹 运行代码检查...
    npm run lint --silent || echo ⚠️  代码检查发现问题，但继续部署...
    
    echo 🏗️  构建项目...
    npm run build
    if errorlevel 1 (
        echo ❌ 构建失败，请检查代码
        pause
        exit /b 1
    )
    echo ✅ 构建成功
) else (
    echo ⚠️  npm未安装，跳过代码检查
)

REM 添加所有文件到Git
echo 📦 添加文件到Git...
git add .

REM 检查是否有变更
git diff --staged --quiet
if not errorlevel 1 (
    echo ℹ️  没有新的变更需要提交
) else (
    REM 提交变更
    echo 💾 提交变更...
    git commit -m "%COMMIT_MESSAGE%"
    echo ✅ 变更已提交
)

REM 推送到GitHub
echo 🚀 推送到GitHub...
git push origin main || git push origin master

echo.
echo 🎉 部署完成！
echo.
echo 📋 下一步操作:
echo 1. 访问 https://vercel.com 连接你的GitHub仓库
echo 2. 配置环境变量:
echo    - ADMIN_PASSWORD=你的管理员密码
echo    - JWT_SECRET=你的JWT密钥
echo    - NEXT_PUBLIC_SITE_URL=https://你的域名.vercel.app
echo    - NEXT_PUBLIC_SITE_NAME=你的博客名称
echo 3. 部署完成后访问你的博客！
echo.
echo 📚 更多信息请查看 README.md 文件
echo 🐛 如有问题请提交 GitHub Issues
echo.
pause 