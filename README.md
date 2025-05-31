# 🌟 现代化技术博客

一个基于 Next.js 15 + TypeScript 构建的现代化个人技术博客，集成了AI助手、Live2D虚拟角色、粒子背景等特色功能。

![技术博客预览](https://img.shields.io/badge/Status-Active-green)
![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.17-38bdf8)

## ✨ 主要功能

### 🎯 核心特性
- **📝 文章管理系统** - 支持分类浏览、搜索、标签筛选
- **💼 作品集展示** - 项目展示和技能介绍
- **📸 摄影作品画廊** - 图片展示和分类管理
- **🌐 多语言支持** - 中英文无缝切换

### 🤖 交互特性
- **AI智能助手** - 基于预设问答的聊天机器人
- **Live2D虚拟角色** - 可交互的动画角色
- **粒子背景动画** - 动态星空效果
- **暗色/亮色主题** - 自适应主题切换

### 📱 用户体验
- **响应式设计** - 完美适配桌面端和移动端
- **快速加载** - Next.js 15优化和图片懒加载
- **现代UI** - 基于Radix UI + Tailwind CSS
- **平滑动画** - Framer Motion和CSS动画

## 🛠️ 技术栈

### 前端框架
- **Next.js 15** - React全栈框架（App Router）
- **TypeScript** - 类型安全的JavaScript超集
- **React 19** - 最新的React版本

### 样式和UI
- **Tailwind CSS** - 原子化CSS框架
- **Radix UI** - 无样式可访问组件库
- **shadcn/ui** - 基于Radix的设计系统
- **Lucide React** - 现代图标库

### 状态管理和表单
- **React Context** - 全局状态管理
- **React Hook Form** - 高性能表单库
- **Zod** - 类型安全的数据验证

### 开发工具
- **ESLint** - 代码质量检查
- **PostCSS** - CSS后处理器
- **pnpm** - 快速包管理器

## 🚀 快速开始

### 环境要求
- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0 (推荐) 或 npm/yarn

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/你的用户名/tech-blog.git
cd tech-blog
```

2. **安装依赖**
```bash
# 使用 pnpm (推荐)
pnpm install

# 或使用 npm
npm install --legacy-peer-deps
```

3. **环境配置**
```bash
# 复制环境变量模板
cp .env.example .env.local

# 编辑环境变量
# 根据需要配置API密钥等
```

4. **启动开发服务器**
```bash
pnpm dev
# 或
npm run dev
```

5. **访问应用**
打开浏览器访问 [http://localhost:3000](http://localhost:3000)

### 生产部署

```bash
# 构建项目
pnpm build

# 启动生产服务器
pnpm start
```

## 📁 项目结构

```
tech-blog/
├── app/                     # Next.js App Router
│   ├── components/         # 页面级组件
│   ├── articles/          # 文章页面
│   ├── portfolio/         # 作品集页面
│   ├── photography/       # 摄影页面
│   ├── globals.css        # 全局样式
│   └── layout.tsx         # 根布局
├── components/             # 通用UI组件
│   └── ui/                # shadcn/ui组件
├── contexts/              # React Context
│   ├── theme-context.tsx  # 主题管理
│   └── language-context.tsx # 语言管理
├── hooks/                 # 自定义Hooks
├── lib/                   # 工具函数
├── public/                # 静态资源
├── styles/                # 样式文件
└── types/                 # TypeScript类型定义
```

## 🎨 自定义和配置

### 主题配置
编辑 `tailwind.config.ts` 来自定义颜色、字体等设计标记：

```typescript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          // 自定义主色彩
        }
      }
    }
  }
}
```

### 内容管理
- **文章内容** - 编辑 `app/articles/` 目录下的页面
- **作品集** - 修改 `app/portfolio/page.tsx`
- **个人信息** - 更新 `app/page.tsx` 中的个人介绍

### AI助手配置
编辑 `app/components/AIAssistant.tsx` 来自定义对话逻辑：

```typescript
// 添加自定义回复逻辑
if (input.includes("你的问题")) {
  response = "你的回答"
}
```

## 🧪 开发指南

### 代码规范
```bash
# 代码检查
pnpm lint

# 自动修复
pnpm lint --fix
```

### 组件开发
使用shadcn/ui添加新组件：

```bash
npx shadcn-ui@latest add button
```

### 性能优化
- 使用 `next/image` 进行图片优化
- 利用 `dynamic` 进行代码分割
- 实施适当的缓存策略

## 🚀 部署选项

### Vercel (推荐)
```bash
npm i -g vercel
vercel
```

### 其他平台
- **Netlify** - 适合静态部署
- **GitHub Pages** - 免费托管
- **Railway** - 支持全栈应用

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证。详情请查看 [LICENSE](LICENSE) 文件。

## 🙋 常见问题

### Q: 如何添加新的文章？
A: 在 `app/articles/` 目录下创建新的页面文件，按照现有格式编写。

### Q: 如何自定义Live2D模型？
A: 修改 `app/components/Live2D.tsx` 中的模型路径和配置。

### Q: 如何配置AI助手的回复？
A: 编辑 `app/components/AIAssistant.tsx` 中的对话逻辑。

### Q: 部署后图片不显示？
A: 检查 `next.config.js` 中的图片域名配置。

## 📞 联系方式

- **邮箱**: your-email@example.com
- **GitHub**: [@your-username](https://github.com/your-username)
- **网站**: https://your-website.com

---

⭐ 如果这个项目对你有帮助，请给个星标支持一下！ 