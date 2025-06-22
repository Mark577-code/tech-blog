# Vditor 集成指南

本文档详细介绍了如何在技术博客项目中集成和使用 Vditor 编辑器。

## 📖 概述

Vditor 是一款功能强大的浏览器端 Markdown 编辑器，支持所见即所得、即时渲染和分屏预览模式。我们项目目前集成了 Vditor v3.11.1。

## 🎯 集成方式

### 1. CDN 集成（当前方案）

我们采用动态 CDN 加载的方式集成 Vditor，具有以下优势：
- ✅ 无需增加构建包大小
- ✅ 利用 CDN 缓存和加速
- ✅ 按需加载，提升首屏速度
- ✅ 自动版本管理

**实现细节：**
```typescript
// 配置文件：constants/editor.ts
export const VDITOR_CONFIG = {
  VERSION: '3.11.1',
  CDN: 'https://cdn.jsdelivr.net/npm/vditor@3.11.1',
  BACKUP_CDNS: [
    'https://unpkg.com/vditor@3.11.1',
    'https://fastly.jsdelivr.net/npm/vditor@3.11.1'
  ]
}

// 组件中的动态加载
const loadVditor = async () => {
  // 动态加载 CSS
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = `${VDITOR_CONFIG.CDN}/dist/index.css`
  
  // 动态加载 JS
  const script = document.createElement('script')
  script.src = `${VDITOR_CONFIG.CDN}/dist/index.min.js`
}
```

### 2. 本地集成（备选方案）

如果需要使用本地构建的 vditor，可以按照以下步骤：

#### 步骤 1：构建 Vditor
```bash
# 进入 vditor 源码目录
cd vditor-master

# 安装依赖
npm install

# 构建项目
npm run build
```

#### 步骤 2：复制构建产物
```bash
# 创建本地 vditor 目录
mkdir -p public/lib/vditor

# 复制构建文件
cp -r vditor-master/dist/* public/lib/vditor/
```

#### 步骤 3：更新配置
```typescript
// constants/editor.ts
export const VDITOR_CONFIG = {
  CDN: '/lib/vditor', // 使用本地路径
  // ... 其他配置保持不变
}
```

## 🔧 配置详解

### 编辑器配置

```typescript
const vditorOptions = {
  // 编辑模式
  mode: 'wysiwyg', // wysiwyg | ir | sv
  
  // 工具栏配置
  toolbar: [
    'emoji', 'headings', 'bold', 'italic', 'strike',
    'link', 'list', 'ordered-list', 'check',
    'quote', 'line', 'code', 'inline-code',
    'table', 'undo', 'redo', 'fullscreen'
  ],
  
  // 预览配置
  preview: {
    markdown: {
      toc: true, // 目录
      codeBlockPreview: true, // 代码块预览
      mathBlockPreview: true, // 数学公式预览
    },
    math: {
      inlineDigit: true,
      engine: 'KaTeX' // KaTeX | MathJax
    },
    hljs: {
      style: 'github',
      lineNumber: true,
      enable: true
    }
  },
  
  // 主题配置
  theme: 'classic', // classic | dark
  
  // 上传配置
  upload: {
    accept: 'image/*,.mp3,.wav,.ogg',
    multiple: false,
    fieldName: 'file[]'
  }
}
```

### 主题配置

#### 编辑器主题
- `classic` - 经典白色主题
- `dark` - 暗黑主题

#### 内容主题
- `ant-design` - Ant Design 风格
- `github` - GitHub 风格
- `light` - 浅色主题
- `dark` - 深色主题
- `wechat` - 微信公众号风格

#### 代码高亮主题
支持 36+ 种代码高亮主题，包括：
- `github` - GitHub 风格
- `atom-one-dark` - Atom 暗色
- `vs2015` - Visual Studio 2015
- `rainbow` - 彩虹主题

## 🚀 最佳实践

### 1. 性能优化

```typescript
// 懒加载编辑器
const VditorEditor = lazy(() => import('@/components/ui/vditor-editor'))

// 使用 Suspense 包装
<Suspense fallback={<EditorSkeleton />}>
  <VditorEditor {...props} />
</Suspense>
```

### 2. 错误处理

```typescript
// 加载失败时的降级方案
const [loadError, setLoadError] = useState(false)

useEffect(() => {
  loadVditor().catch(() => {
    setLoadError(true)
    // 降级到简单编辑器
    loadFallbackEditor()
  })
}, [])
```

### 3. 内容管理

```typescript
// 自动保存
const [content, setContent] = useState('')
const [lastSaved, setLastSaved] = useState(Date.now())

useEffect(() => {
  const timer = setTimeout(() => {
    if (content && Date.now() - lastSaved > 30000) {
      autoSave(content)
      setLastSaved(Date.now())
    }
  }, 30000)
  
  return () => clearTimeout(timer)
}, [content, lastSaved])
```

### 4. 移动端适配

```typescript
// 移动端检测
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
}

// 移动端优化配置
const mobileOptions = {
  ...defaultOptions,
  toolbar: isMobile() ? mobileToolbar : desktopToolbar,
  height: isMobile() ? 300 : 500
}
```

## 🔍 故障排除

### 常见问题

1. **编辑器加载失败**
   - 检查网络连接
   - 尝试备用 CDN
   - 清除浏览器缓存

2. **样式显示异常**
   - 确认 CSS 文件正确加载
   - 检查样式冲突
   - 验证主题配置

3. **功能异常**
   - 检查 JavaScript 控制台错误
   - 确认配置参数正确
   - 验证回调函数

### 调试技巧

```typescript
// 开启调试模式
const vditorOptions = {
  ...defaultOptions,
  after: () => {
    console.log('Vditor 初始化完成')
    console.log('当前模式:', vditor.getCurrentMode())
    console.log('工具栏配置:', vditor.getToolbar())
  }
}

// 监听内容变化
vditor.on('input', (value) => {
  console.log('内容变化:', value.length, '字符')
})
```

## 📚 参考资源

- [Vditor 官方文档](https://ld246.com/tag/vditor)
- [GitHub 仓库](https://github.com/Vanessa219/vditor)
- [在线演示](https://b3log.org/vditor/demo/index.html)
- [API 文档](https://ld246.com/article/1590137474504)
- [主题开发](https://ld246.com/article/1590226431060)

## 🆙 版本升级

### 升级步骤

1. **检查更新日志**
   ```bash
   # 查看最新版本
   npm view vditor version
   ```

2. **更新 CDN 链接**
   ```typescript
   // constants/editor.ts
   export const VDITOR_CONFIG = {
     VERSION: 'new-version',
     CDN: 'https://cdn.jsdelivr.net/npm/vditor@new-version'
   }
   ```

3. **测试功能**
   - 编辑器加载
   - 基本编辑功能
   - 预览和导出
   - 主题切换

4. **更新文档**
   - README.md
   - 版本说明
   - 配置文件

### 兼容性检查

- ✅ 浏览器兼容性
- ✅ 移动端适配
- ✅ 功能完整性
- ✅ 性能表现

---

*最后更新：2024年1月* 