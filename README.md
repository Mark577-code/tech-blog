# 🚀 现代化技术博客系统

一个基于 Next.js 15 + TypeScript 构建的现代化博客系统，具备完整的内容管理功能、AI助手集成、Live2D虚拟角色等特色功能。

![Tech Blog](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ 核心特性

### 🎯 内容管理
- **文章系统**: 完整的CRUD操作，支持Markdown编辑
- **分类管理**: 动态分类系统，支持颜色标识和图标
- **标签系统**: 灵活的标签管理和筛选
- **图片上传**: 本地文件上传，支持拖拽和URL输入
- **草稿发布**: 支持草稿保存和定时发布

### 🎨 用户体验
- **响应式设计**: 完美适配桌面、平板、手机
- **暗黑模式**: 自动切换和手动控制
- **动画效果**: 流畅的页面过渡和交互动画
- **搜索功能**: 全文搜索和分类筛选
- **分页导航**: 智能分页和无限滚动

### 🤖 AI功能
- **智能助手**: 集成AI对话功能
- **Live2D角色**: 虚拟助手角色交互
- **内容推荐**: 基于用户行为的智能推荐

### 🛡️ 安全特性
- **管理员认证**: JWT令牌认证
- **权限控制**: 细粒度权限管理
- **输入验证**: 全面的数据验证和过滤
- **文件安全**: 安全的文件上传和存储

## 🛠️ 技术栈

### 前端技术
- **框架**: Next.js 15 (App Router)
- **语言**: TypeScript 5
- **样式**: Tailwind CSS 3
- **组件**: Radix UI + Shadcn/ui
- **状态管理**: React Context + Hooks
- **动画**: CSS Animations + Framer Motion

### 后端技术
- **API**: Next.js API Routes
- **数据存储**: JSON文件 (可扩展为数据库)
- **认证**: JWT + bcryptjs
- **文件处理**: Node.js fs/promises
- **图片处理**: Next.js Image优化

### 开发工具
- **包管理**: npm
- **代码规范**: ESLint + Prettier
- **类型检查**: TypeScript
- **构建工具**: Next.js内置
- **部署**: Vercel (推荐)

## 🚀 快速开始

### 环境要求
- Node.js 18.17+ 
- npm 9+
- Git

### 本地开发

1. **克隆项目**
```bash
git clone https://github.com/your-username/tech-blog.git
cd tech-blog
```

2. **安装依赖**
```bash
npm install
```

3. **环境配置**
```bash
cp .env.example .env.local
```

编辑 `.env.local` 文件：
```env
# 管理员认证
ADMIN_PASSWORD=your-secure-password
JWT_SECRET=your-jwt-secret-key

# 网站配置
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=我的技术博客
```

4. **启动开发服务器**
```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看网站

5. **管理后台**
访问 [http://localhost:3000/admin/login](http://localhost:3000/admin/login) 进入管理后台

默认管理员账号：
- 用户名: `admin`
- 密码: 在 `.env.local` 中设置的 `ADMIN_PASSWORD`

## 📁 项目结构

```
tech-blog/
├── app/                    # Next.js App Router
│   ├── admin/             # 管理后台页面
│   ├── api/               # API路由
│   ├── articles/          # 文章页面
│   ├── category/          # 分类页面
│   ├── components/        # 页面组件
│   └── globals.css        # 全局样式
├── components/            # 通用组件
│   └── ui/               # UI组件库
├── contexts/             # React Context
├── data/                 # 数据文件
│   ├── articles.json     # 文章数据
│   ├── categories.json   # 分类数据
│   └── projects.json     # 项目数据
├── lib/                  # 工具库
├── public/               # 静态资源
│   └── uploads/          # 上传文件
├── types/                # TypeScript类型定义
└── README.md
```

## 🎯 功能使用

### 文章管理
1. 登录管理后台
2. 进入"文章管理"
3. 点击"新建文章"
4. 填写标题、内容、选择分类
5. 上传特色图片
6. 发布或保存为草稿

### 分类管理
1. 进入"分类管理"
2. 创建新分类，设置名称、颜色、图标
3. 调整分类排序和可见性
4. 分类会自动同步到所有页面

### 图片上传
- 支持拖拽上传
- 支持点击选择文件
- 支持URL输入
- 自动生成缩略图
- 文件类型和大小验证

## 🌐 部署指南

### Vercel部署 (推荐)

1. **推送到GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **连接Vercel**
- 访问 [vercel.com](https://vercel.com)
- 导入GitHub仓库
- 配置环境变量
- 自动部署

3. **环境变量配置**
在Vercel项目设置中添加：
```
ADMIN_PASSWORD=your-secure-password
JWT_SECRET=your-jwt-secret-key
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
NEXT_PUBLIC_SITE_NAME=我的技术博客
```

### 其他平台部署

#### Netlify
```bash
npm run build
npm run export
```

#### 自托管
```bash
npm run build
npm start
```

## 🔧 自定义配置

### 主题配置
编辑 `tailwind.config.js` 自定义颜色和样式：
```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#your-color',
        // 更多自定义颜色
      }
    }
  }
}
```

### 网站信息
编辑 `app/layout.tsx` 修改网站元数据：
```tsx
export const metadata = {
  title: '你的博客名称',
  description: '你的博客描述',
  // 更多元数据
}
```

### AI助手配置
编辑相关组件文件自定义AI助手功能和Live2D角色。

## 📊 性能优化

### 已实现的优化
- ✅ Next.js Image组件优化
- ✅ 代码分割和懒加载
- ✅ CSS优化和压缩
- ✅ 静态资源缓存
- ✅ 响应式图片

### 建议的优化
- 🔄 集成CDN服务
- 🔄 数据库优化
- 🔄 服务端缓存
- 🔄 图片压缩服务

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建Pull Request

### 开发规范
- 使用TypeScript进行类型检查
- 遵循ESLint规则
- 编写清晰的提交信息
- 添加必要的注释和文档

## 📝 更新日志

### v1.0.0 (2025-06-01)
- ✨ 初始版本发布
- ✨ 完整的文章管理系统
- ✨ 动态分类管理
- ✨ 图片上传功能
- ✨ 管理员认证
- ✨ 响应式设计
- ✨ AI助手集成

## 🐛 问题反馈

如果遇到问题，请通过以下方式反馈：

1. [GitHub Issues](https://github.com/your-username/tech-blog/issues)
2. 邮箱: 3449322892@qq.com

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

感谢以下开源项目：
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Lucide Icons](https://lucide.dev/)

---

⭐ 如果这个项目对你有帮助，请给个Star支持一下！

📧 联系方式: [3449322892@qq.com]