// 编辑器配置常量

export const EDITOR_TYPES = {
  VDITOR: 'vditor',
  MARKDOWN: 'markdown'
} as const

export type EditorType = typeof EDITOR_TYPES[keyof typeof EDITOR_TYPES]

// Vditor 编辑器配置
export const VDITOR_CONFIG = {
  // 版本信息
  VERSION: '3.11.1',
  
  // CDN 地址 - 使用最新版本
  CDN: 'https://cdn.jsdelivr.net/npm/vditor@3.11.1',
  
  // 备用 CDN 地址
  BACKUP_CDNS: [
    'https://unpkg.com/vditor@3.11.1',
    'https://fastly.jsdelivr.net/npm/vditor@3.11.1'
  ],
  
  // 默认配置
  DEFAULT_OPTIONS: {
    mode: 'wysiwyg', // 默认为所见即所得模式
    toolbar: [
      'emoji',
      'headings',
      'bold',
      'italic',
      'strike',
      'link',
      '|',
      'list',
      'ordered-list',
      'check',
      'outdent',
      'indent',
      '|',
      'quote',
      'line',
      'code',
      'inline-code',
      'insert-before',
      'insert-after',
      '|',
      'table',
      '|',
      'undo',
      'redo',
      '|',
      'fullscreen',
      'edit-mode',
      'code-theme',
      'content-theme',
      'export',
      {
        name: 'more',
        toolbar: [
          'both',
          'preview',
          'format',
          'outline',
          'devtools',
          'info',
          'help',
        ],
      }
    ],
    cache: {
      enable: false, // 禁用缓存，避免冲突
    },
    preview: {
      markdown: {
        toc: true, // 启用目录
        codeBlockPreview: true, // 代码块预览
        mathBlockPreview: true, // 数学公式预览
        paragraphBeginningSpace: true, // 段落开头空格
        linkBase: '', // 链接基础路径
      },
      math: {
        inlineDigit: true, // 内联数学公式
        engine: 'KaTeX', // 数学公式引擎
      },
      hljs: {
        style: 'github', // 代码高亮主题
        lineNumber: true, // 显示行号
        enable: true, // 启用代码高亮
      },
      theme: {
        current: 'light', // 当前主题
        path: `https://cdn.jsdelivr.net/npm/vditor@3.11.1/dist/css/content-theme`, // 主题路径
        list: {
          'ant-design': 'Ant Design',
          'github': 'GitHub',
          'light': 'Light',
          'dark': 'Dark',
          'wechat': 'WeChat'
        }
      }
    },
    // 编辑器主题
    theme: 'classic', // classic | dark
    // 图标
    icon: 'ant', // ant | material
    // 多语言
    lang: 'zh_CN', // zh_CN | en_US | ko_KR
    // 上传配置
    upload: {
      accept: 'image/*,.mp3,.wav,.ogg,.flac,.aac',
      multiple: false,
      fieldName: 'file[]',
      filename: (name: string) => name.replace(/\W/g, ''),
      format: (files: File[], responseText: string) => {
        try {
          const response = JSON.parse(responseText)
          if (response.success) {
            return JSON.stringify({
              msg: '',
              code: 0,
              data: {
                errFiles: [],
                succMap: response.data
              }
            })
          }
        } catch (e) {
          // 忽略解析错误
        }
        return responseText
      }
    }
  },
  
  // 快捷键说明
  SHORTCUTS: [
    { key: 'Ctrl + B', action: '粗体' },
    { key: 'Ctrl + I', action: '斜体' },
    { key: 'Ctrl + K', action: '链接' },
    { key: 'Ctrl + Shift + M', action: '切换模式' },
    { key: 'Ctrl + S', action: '保存' },
    { key: 'F11', action: '全屏' },
    { key: 'Ctrl + Z', action: '撤销' },
    { key: 'Ctrl + Y', action: '重做' },
  ],
  
  // 支持的编辑模式
  MODES: {
    WYSIWYG: { key: 'wysiwyg', name: '所见即所得', description: '类似富文本编辑器的体验' },
    IR: { key: 'ir', name: '即时渲染', description: '类似 Typora 的编辑体验' },
    SV: { key: 'sv', name: '分屏预览', description: '传统的 Markdown 编辑模式' }
  }
}

// Markdown 编辑器配置
export const MARKDOWN_CONFIG = {
  // 默认配置
  DEFAULT_OPTIONS: {
    preview: 'edit',
    hideToolbar: false,
    visibleDragbar: false,
  },
  
  // 快捷键说明
  SHORTCUTS: [
    { key: '**text**', action: '粗体' },
    { key: '*text*', action: '斜体' },
    { key: '`code`', action: '行内代码' },
    { key: '![alt](url)', action: '图片' },
    { key: '[text](url)', action: '链接' },
  ]
}

// 编辑器功能对比
export const EDITOR_FEATURES = {
  [EDITOR_TYPES.VDITOR]: {
    name: 'Vditor',
    version: '3.11.1',
    description: '强大的所见即所得 Markdown 编辑器',
    features: [
      '所见即所得编辑',
      '即时渲染预览',
      '分屏模式',
      '数学公式支持 (KaTeX/MathJax)',
      '流程图支持 (Mermaid)',
      '表格可视化编辑',
      '多种主题切换',
      '图片拖拽上传',
      '代码高亮 (36+ 主题)',
      '导出功能',
      '语音录制',
      '多语言支持',
    ],
    pros: ['功能丰富', '用户友好', '实时预览', '扩展性强'],
    cons: ['体积较大', '加载时间稍长'],
    author: 'B3log 开源社区',
    homepage: 'https://b3log.org/vditor',
    github: 'https://github.com/Vanessa219/vditor'
  },
  [EDITOR_TYPES.MARKDOWN]: {
    name: 'MD Editor',
    description: '简洁的 Markdown 编辑器',
    features: [
      'Markdown 语法',
      '实时预览',
      '语法高亮',
      '工具栏辅助',
      '快速响应',
    ],
    pros: ['轻量级', '加载快速', '简洁易用'],
    cons: ['功能相对简单', '需要熟悉 Markdown'],
  },
} as const

// 编辑器推荐配置
export const EDITOR_RECOMMENDATIONS = {
  // 根据用户类型推荐编辑器
  byUserType: {
    beginner: EDITOR_TYPES.VDITOR, // 新手推荐 Vditor
    intermediate: EDITOR_TYPES.VDITOR, // 中级用户推荐 Vditor
    expert: EDITOR_TYPES.MARKDOWN, // 专家用户可选择 Markdown
  },
  
  // 根据内容类型推荐编辑器
  byContentType: {
    'rich-content': EDITOR_TYPES.VDITOR, // 富内容推荐 Vditor
    'simple-text': EDITOR_TYPES.MARKDOWN, // 简单文本推荐 Markdown
    'math-heavy': EDITOR_TYPES.VDITOR, // 数学公式多推荐 Vditor
    'code-heavy': EDITOR_TYPES.VDITOR, // 代码多推荐 Vditor
  }
} as const 