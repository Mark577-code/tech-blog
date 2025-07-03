# 🚀 Tech Blog - 现代化技术博客网站

> **🎯 部署状态**: 已优化部署流程，移除 GitHub Actions，使用 Vercel 原生 Git 集成  
> **📅 更新时间**: 2025-01-17  
> **🔧 部署方式**: Vercel 自动部署（每次推送到 main 分支自动触发）

一个基于 Next.js 15 构建的现代化技术博客网站，支持 Markdown 编辑、AI 助手、响应式设计和实时内容管理。

## ✨ 主要特性

### 📝 内容管理
- **双编辑器支持**: 
  - **Vditor**: 强大的所见即所得 Markdown 编辑器，支持实时预览、多种编辑模式
  - **MDEditor**: 简洁的 Markdown 编辑器，适合熟悉语法的用户
- **分类管理**: 文章自动分类，支持颜色标记和描述
- **标签系统**: 灵活的标签管理，便于内容组织
- **草稿系统**: 支持草稿保存和发布管理

### 🎨 用户体验
- **响应式设计**: 完美适配桌面、平板和移动设备
- **暗黑模式**: 支持明暗主题切换，保护用户视力
- **动画效果**: 流畅的页面动画和交互反馈
- **图片轮播**: 首页精美的图片轮播展示

### 🤖 AI 集成
- **智能助手**: 内置 AI 助手，回答技术问题和网站导航
- **对话记忆**: 支持上下文对话，提供个性化服务
- **知识库**: 基于网站内容的智能问答

### 📊 项目展示
- **作品集**: 展示个人项目和技术作品
- **技术栈**: 详细的技术栈介绍和演示链接
- **摄影作品**: 个人摄影作品展示

## 🛠️ 技术栈

### 前端
- **框架**: Next.js 15 (React 19)
- **语言**: TypeScript
- **样式**: Tailwind CSS + Shadcn/ui
- **编辑器**: 
  - **Vditor**: 功能强大的 Markdown 所见即所得编辑器
  - **@uiw/react-md-editor**: 轻量级 Markdown 编辑器
- **图标**: Lucide React

### 后端
- **API**: Next.js API Routes
- **存储**: 文件系统 (JSON)
- **认证**: JWT + Cookie

### 部署
- **平台**: Vercel / Netlify
- **域名**: 支持自定义域名
- **SSL**: 自动 HTTPS 证书

## 📦 快速开始

### 环境要求
- Node.js 18+
- npm / yarn / pnpm

### 安装和运行

1. **克隆项目**
```bash
git clone https://github.com/your-username/tech-blog.git
cd tech-blog
```

2. **安装依赖**
```bash
npm install
# 或
yarn install
# 或  
pnpm install
```

3. **启动开发服务器**
```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

4. **访问网站**
打开浏览器访问 `http://localhost:3000`

### 管理员登录
- 访问 `/admin/login` 进入管理后台
- 默认账号密码在首次运行时会提示设置

## 🚀 部署指南

### Vercel 部署 (推荐)

1. **连接 GitHub**
   - 在 [Vercel](https://vercel.com) 上连接你的 GitHub 仓库
   - 选择项目进行导入

2. **配置环境变量**
```env
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=https://your-domain.com
   ```

3. **自动部署**
   - 推送代码到 main 分支即可自动部署
   - 每次更新代码都会自动重新部署

### Netlify 部署

1. **连接仓库**
   - 在 [Netlify](https://netlify.com) 导入 GitHub 仓库

2. **构建配置**
   ```toml
   [build]
   command = "npm run build"
   publish = ".next"
   ```

3. **环境变量**
   在 Netlify 控制台设置相同的环境变量

### 自主服务器部署

1. **构建项目**
```bash
npm run build
```

2. **启动服务**
```bash
npm start
```

3. **使用 PM2 (推荐)**
```bash
npm install -g pm2
pm2 start npm --name "tech-blog" -- start
```

## 📝 内容管理

### 文章管理
1. 登录管理后台 (`/admin/login`)
2. 点击"文章管理"进入编辑界面
3. 使用可视化 Markdown 编辑器创建内容
4. 选择分类、添加标签、设置特色图片
5. 预览并发布文章

### 分类设置
- 在数据文件中配置文章分类
- 支持颜色标记和描述
- 自动生成分类页面

### 文件上传
- 支持图片上传和管理
- 自动压缩和优化
- CDN 加速支持

## 🔧 自定义配置

### 主题定制
```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: "hsl(var(--primary))",
        secondary: "hsl(var(--secondary))",
        // 自定义颜色
      }
    }
  }
}
```

## 📊 性能优化

### 自动优化
- **图片优化**: Next.js 自动图片压缩和格式转换
- **代码分割**: 自动代码分割和懒加载
- **缓存策略**: 静态资源和 API 响应缓存
- **SEO 优化**: 自动生成 sitemap 和 meta 标签

### 建议优化
- 使用 CDN 加速静态资源
- 配置 Redis 缓存（可选）
- 图片使用 WebP 格式
- 启用 Gzip 压缩

## 🔐 安全考虑

- JWT Token 认证
- CSRF 保护
- XSS 防护
- 输入验证和过滤
- 安全的文件上传

## 📈 SEO 优化

- 自动生成 meta 标签
- 结构化数据标记
- XML Sitemap
- robots.txt
- Open Graph 支持

## 🎯 动态更新方案

### 实时内容更新
- 管理后台发布内容后，前端立即更新
- 无需重新部署即可更新文章和项目
- 支持草稿预览和定时发布

### 版本控制
- 内容版本历史记录
- 一键回滚到历史版本
- 内容备份和恢复

## 🤝 贡献指南

1. Fork 这个仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启 Pull Request

## 📄 开源协议

这个项目基于 [MIT](LICENSE) 协议开源。

## 📞 联系方式

- 作者: [你的名字]
- 邮箱: your-email@example.com
- 网站: https://your-website.com
- GitHub: [@your-username](https://github.com/your-username)

## 🙏 致谢

感谢以下开源项目：
- [Next.js](https://nextjs.org/) - React 框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [Shadcn/ui](https://ui.shadcn.com/) - 组件库
- [Vditor](https://b3log.org/vditor/) - 强大的 Markdown 编辑器
- [@uiw/react-md-editor](https://github.com/uiwjs/react-md-editor) - React Markdown 编辑器
- [Lucide](https://lucide.dev/) - 图标库

### 特别鸣谢

#### 🎖️ Vditor v3.11.1 - 卓越的 Markdown 编辑器

感谢 [B3log 开源社区](https://b3log.org/) 和 [Vanessa](https://github.com/vanessa219) 开发团队创造了这款出色的编辑器：

**核心特性：**
- 🎯 **三种编辑模式**：所见即所得 (WYSIWYG)、即时渲染 (IR)、分屏预览 (SV)
- 📊 **丰富的扩展**：数学公式 (KaTeX)、流程图 (Mermaid)、图表 (ECharts)、五线谱
- 🎨 **主题系统**：内置多套编辑器主题和内容主题，支持暗黑模式
- 🌍 **国际化**：支持中文、英文、韩文界面
- 📱 **移动友好**：完美适配移动端设备
- ⚡ **性能优化**：实时保存、懒加载、防抖处理

**技术亮点：**
- TypeScript 编写，类型安全
- 支持 CommonMark 和 GFM 规范
- 36+ 项可自定义工具栏操作
- CORS 跨域上传支持
- HTML 粘贴自动转换
- 录音功能集成

**开源信息：**
- 📄 许可证：MIT License
- 🏠 官方网站：https://b3log.org/vditor
- 💻 GitHub：https://github.com/Vanessa219/vditor
- 📖 文档：https://ld246.com/tag/vditor
- 🎮 在线演示：https://b3log.org/vditor/demo/index.html

**社区支持：**
- 💬 官方讨论区：https://ld246.com/tag/vditor
- 📱 微信公众号：B3log开源
- 💰 赞助支持：https://ld246.com/sponsor

Vditor 不仅是一个编辑器，更是现代化 Markdown 编辑理念的代表作品。它将复杂的功能以优雅的方式呈现，为用户提供了从新手到专家都能满意的编辑体验。

---

⭐ 如果这个项目对你有帮助，请给它一个星标！

## 📁 项目结构

```
tech-blog/
├── app/                    # Next.js 应用目录
│   ├── components/         # 可复用组件
│   ├── contexts/           # React Context
│   ├── api/               # API 路由
│   ├── articles/          # 文章页面
│   ├── about/             # 关于页面
│   └── globals.css        # 全局样式
├── data/                  # 数据存储
│   ├── articles.json      # 文章数据
│   ├── categories.json    # 分类数据
│   └── projects.json      # 项目数据
├── lib/                   # 工具函数
├── types/                 # TypeScript 类型定义
└── public/               # 静态资源
```

## 📝 如何添加文章

### 方法一：通过 API 添加（推荐）

1. 向 `/api/articles` 发送 POST 请求：

```javascript
const articleData = {
  title: "你的文章标题",
  content: "文章内容（支持 Markdown）",
  category: "technology", // 分类 slug
  tags: ["JavaScript", "React", "Next.js"],
  excerpt: "文章摘要",
  featuredImage: "/images/article-cover.jpg", // 可选
  status: "published" // 或 "draft"
}

fetch('/api/articles', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(articleData)
})
```

### 方法二：直接编辑数据文件

1. 打开 `data/articles.json` 文件
2. 按照以下格式添加新文章：

```json
{
  "id": "unique-article-id",
  "title": "文章标题",
  "slug": "article-slug",
  "content": "文章内容",
  "excerpt": "文章摘要",
  "category": "technology",
  "tags": ["tag1", "tag2"],
  "author": "Mark-李",
  "featuredImage": "/images/cover.jpg",
  "status": "published",
  "viewCount": 0,
  "likes": 0,
  "readingTime": 5,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## 🏷️ 分类管理

### 添加新分类

1. 编辑 `data/categories.json` 文件：

```json
{
  "id": "new-category-id",
  "name": "分类名称",
  "slug": "category-slug",
  "description": "分类描述",
  "color": "#3b82f6",
  "isVisible": true,
  "order": 1,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### 现有分类

- `technology` - 技术分享 (蓝色 #3b82f6)
- `ai` - 人工智能 (紫色 #8b5cf6)
- `frontend` - 前端开发 (绿色 #10b981)
- `backend` - 后端开发 (橙色 #f59e0b)
- `mobile` - 移动开发 (红色 #ef4444)
- `lifestyle` - 生活随想 (粉色 #ec4899)

### 为文章分配正确分类

1. **技术文章** - 使用 `technology` 分类
2. **AI 相关** - 使用 `ai` 分类
3. **前端技术** - 使用 `frontend` 分类
4. **后端技术** - 使用 `backend` 分类
5. **移动开发** - 使用 `mobile` 分类
6. **生活感悟** - 使用 `lifestyle` 分类

## 📸 图片管理

### 上传图片

1. 将图片放在 `public/images/` 目录下
2. 在文章中引用：`/images/your-image.jpg`
3. 设置为特色图片：在文章数据中设置 `featuredImage` 字段

### 图片优化建议

- 使用 WebP 格式以获得更好的压缩率
- 特色图片推荐尺寸：1200x630 像素
- 文章内图片建议宽度不超过 800 像素

## 🚀 本地开发

### 环境要求

- Node.js 18+
- npm 或 yarn

### 安装依赖

```bash
npm install
# 或
yarn install
```

### 启动开发服务器

```bash
npm run dev
# 或
yarn dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看效果。

## 📦 部署

### Vercel 部署（推荐）

1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 自动部署完成

### Netlify 部署

1. 将代码推送到 GitHub
2. 在 [Netlify](https://netlify.com) 连接仓库
3. 设置构建命令：`npm run build`
4. 设置发布目录：`.next`

### 自托管部署

```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

## 🎨 自定义配置

### 修改主题色

编辑 `tailwind.config.js` 文件中的颜色配置：

```javascript
  theme: {
    extend: {
      colors: {
      primary: "your-primary-color",
      secondary: "your-secondary-color"
    }
  }
}
```

### 修改网站信息

编辑以下文件：
- `app/layout.tsx` - 网站标题和描述
- `app/components/Navbar.tsx` - 导航栏品牌名称
- `app/about/page.tsx` - 关于页面内容

## 📖 使用教程

### 1. 创建技术文章

```bash
# 示例：创建一个 React 技术文章
POST /api/articles
{
  "title": "React 18 新特性深度解析",
  "content": "## 并发特性\n\nReact 18 引入了...",
  "category": "frontend",
  "tags": ["React", "JavaScript", "前端"],
  "excerpt": "深入了解 React 18 的并发特性和性能优化",
  "status": "published"
}
```

### 2. 管理文章分类

在导航栏中，分类会自动显示，点击即可查看对应分类的文章。

### 3. 搜索功能

用户可以通过顶部搜索框搜索文章标题、内容和标签。

### 4. 社交链接

在左侧固定位置显示：
- 网易云音乐：[https://music.163.com/#/user/home?id=1857158786](https://music.163.com/#/user/home?id=1857158786)
- GitHub：[https://github.com/Mark577-code](https://github.com/Mark577-code)
- 邮箱：[a3449322892@gmail.com](mailto:a3449322892@gmail.com)

## 🔧 常见问题

### Q: 如何修改网站标题？
A: 编辑 `app/layout.tsx` 中的 metadata 配置。

### Q: 如何添加新的社交链接？
A: 编辑 `app/components/Navbar.tsx` 中的左侧社交链接部分。

### Q: 文章不显示怎么办？
A: 检查文章的 `status` 字段是否设置为 `"published"`。

### Q: 如何修改分类颜色？
A: 编辑 `data/categories.json` 中对应分类的 `color` 字段。

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**博客地址**: [https://nhblog.xyz/](https://nhblog.xyz/)

**联系作者**: a3449322892@gmail.com