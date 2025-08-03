'use client'

import React, { useState, useEffect } from 'react'
import MDEditor from '@uiw/react-md-editor'
import { Button } from '@/components/ui/button'
import { Eye, Edit, Maximize2, Minimize2, Copy, Check } from 'lucide-react'
import { toast } from 'sonner'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  height?: number
  disabled?: boolean
}

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = "请输入文章内容，支持 Markdown 语法...",
  height = 500,
  disabled = false
}: MarkdownEditorProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [previewMode, setPreviewMode] = useState<'edit' | 'live' | 'preview'>('live')

  // 添加代码块复制功能
  useEffect(() => {
    const addCopyButtons = () => {
      const codeBlocks = document.querySelectorAll('pre code')
      codeBlocks.forEach((block, index) => {
        const pre = block.parentNode as HTMLElement
        if (!pre || pre.querySelector('.copy-code-button')) return

        const copyButton = document.createElement('button')
        copyButton.className = 'copy-code-button'
        copyButton.innerHTML = `
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
            <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
          </svg>
        `
        copyButton.title = '复制代码'
        
        copyButton.addEventListener('click', async () => {
          try {
            await navigator.clipboard.writeText(block.textContent || '')
            copyButton.innerHTML = `
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style="color: #10b981;">
                <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
              </svg>
            `
            copyButton.title = '已复制!'
            toast.success('代码已复制到剪贴板')
            
            setTimeout(() => {
              copyButton.innerHTML = `
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
                  <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
                </svg>
              `
              copyButton.title = '复制代码'
            }, 2000)
          } catch (err) {
            toast.error('复制失败')
          }
        })

        pre.style.position = 'relative'
        pre.appendChild(copyButton)
      })
    }

    // 延迟添加复制按钮，确保DOM渲染完成
    const timer = setTimeout(addCopyButtons, 500)
    
    // 监听内容变化
    const observer = new MutationObserver(addCopyButtons)
    const target = document.querySelector('.wmde-markdown')
    if (target) {
      observer.observe(target, { childList: true, subtree: true })
    }

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [value, previewMode])

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-white dark:bg-gray-900' : ''}`}>
      {/* 工具栏 */}
      <div className="flex items-center justify-between p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-t-lg">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Markdown 编辑器
          </span>
          <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md">
            <Button
              variant={previewMode === 'edit' ? 'default' : 'ghost'}
              size="sm"
              className="rounded-r-none border-r"
              onClick={() => setPreviewMode('edit')}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant={previewMode === 'live' ? 'default' : 'ghost'}
              size="sm"
              className="rounded-none border-r"
              onClick={() => setPreviewMode('live')}
            >
              编辑 & 预览
            </Button>
            <Button
              variant={previewMode === 'preview' ? 'default' : 'ghost'}
              size="sm"
              className="rounded-l-none"
              onClick={() => setPreviewMode('preview')}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">
            {value.length} 字符
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* 编辑器 */}
      <div className="relative">
        <MDEditor
          value={value}
          onChange={(val) => onChange(val || '')}
          preview={previewMode}
          hideToolbar
          visibleDragbar={false}
          textareaProps={{
            placeholder,
            disabled,
            style: {
              fontSize: 14,
              lineHeight: 1.6,
              fontFamily: '"JetBrains Mono", "Fira Code", Consolas, "Courier New", monospace',
            }
          }}
          height={isFullscreen ? window.innerHeight - 120 : height}
        />
        
        {/* 增强的自定义样式 */}
        <style jsx global>{`
          .w-md-editor {
            background-color: transparent !important;
          }
          
          .w-md-editor.w-md-editor-focus {
            border-color: rgb(59, 130, 246) !important;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
          }
          
          .w-md-editor-text-container > .w-md-editor-text {
            font-family: "JetBrains Mono", "Fira Code", Consolas, "Courier New", monospace !important;
            font-size: 14px !important;
            line-height: 1.6 !important;
          }
          
          .w-md-editor-text-container .token.title {
            color: rgb(59, 130, 246) !important;
          }
          
          .w-md-editor-text-container .token.bold {
            color: rgb(168, 85, 247) !important;
          }
          
          .w-md-editor-text-container .token.code {
            color: rgb(239, 68, 68) !important;
            background-color: rgba(239, 68, 68, 0.1) !important;
            padding: 2px 4px !important;
            border-radius: 3px !important;
          }
          
          .w-md-editor-text-container .token.url {
            color: rgb(34, 197, 94) !important;
          }
          
          .wmde-markdown {
            background-color: white !important;
            color: rgb(55, 65, 81) !important;
            padding: 16px !important;
            line-height: 1.7 !important;
          }
          
          .dark .wmde-markdown {
            background-color: rgb(31, 41, 55) !important;
            color: rgb(229, 231, 235) !important;
          }
          
          /* 标题样式增强 */
          .wmde-markdown h1, .wmde-markdown h2, .wmde-markdown h3,
          .wmde-markdown h4, .wmde-markdown h5, .wmde-markdown h6 {
            color: rgb(59, 130, 246) !important;
            margin-top: 2em !important;
            margin-bottom: 0.8em !important;
            font-weight: 700 !important;
            line-height: 1.25 !important;
          }
          
          .wmde-markdown h1 {
            font-size: 2.25em !important;
            border-bottom: 3px solid rgb(59, 130, 246) !important;
            padding-bottom: 0.5em !important;
          }
          
          .wmde-markdown h2 {
            font-size: 1.875em !important;
            border-bottom: 2px solid rgb(148, 163, 184) !important;
            padding-bottom: 0.3em !important;
          }
          
          .wmde-markdown h3 {
            font-size: 1.5em !important;
          }
          
          /* 代码块样式增强 */
          .wmde-markdown code {
            background-color: rgba(239, 68, 68, 0.1) !important;
            color: rgb(239, 68, 68) !important;
            padding: 2px 6px !important;
            border-radius: 4px !important;
            font-family: "JetBrains Mono", "Fira Code", Consolas, monospace !important;
            font-size: 0.9em !important;
          }
          
          .wmde-markdown pre {
            background-color: rgb(15, 23, 42) !important;
            border-radius: 12px !important;
            padding: 20px !important;
            overflow-x: auto !important;
            margin: 20px 0 !important;
            border: 1px solid rgb(51, 65, 85) !important;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
            position: relative !important;
          }
          
          .wmde-markdown pre code {
            background-color: transparent !important;
            color: rgb(226, 232, 240) !important;
            padding: 0 !important;
            font-size: 14px !important;
            line-height: 1.6 !important;
          }
          
          /* 代码块复制按钮 */
          .copy-code-button {
            position: absolute !important;
            top: 12px !important;
            right: 12px !important;
            background: rgba(255, 255, 255, 0.1) !important;
            color: rgba(255, 255, 255, 0.8) !important;
            border: 1px solid rgba(255, 255, 255, 0.2) !important;
            border-radius: 6px !important;
            padding: 6px 8px !important;
            cursor: pointer !important;
            font-size: 12px !important;
            transition: all 0.2s ease !important;
            backdrop-filter: blur(4px) !important;
            display: flex !important;
            align-items: center !important;
            gap: 4px !important;
            z-index: 10 !important;
          }
          
          .copy-code-button:hover {
            background: rgba(255, 255, 255, 0.2) !important;
            color: white !important;
            transform: translateY(-1px) !important;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2) !important;
          }
          
          /* 引用块样式增强 */
          .wmde-markdown blockquote {
            border-left: 4px solid rgb(59, 130, 246) !important;
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(147, 51, 234, 0.05)) !important;
            padding: 16px 20px !important;
            margin: 20px 0 !important;
            border-radius: 0 8px 8px 0 !important;
            position: relative !important;
          }
          
          .wmde-markdown blockquote::before {
            content: '"' !important;
            font-size: 4em !important;
            color: rgba(59, 130, 246, 0.2) !important;
            position: absolute !important;
            top: -10px !important;
            left: 15px !important;
            font-family: serif !important;
          }
          
          /* 表格样式增强 */
          .wmde-markdown table {
            border-collapse: collapse !important;
            width: 100% !important;
            margin: 20px 0 !important;
            border-radius: 8px !important;
            overflow: hidden !important;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
          }
          
          .wmde-markdown table th {
            background: linear-gradient(135deg, rgb(59, 130, 246), rgb(147, 51, 234)) !important;
            color: white !important;
            padding: 12px 16px !important;
            text-align: left !important;
            font-weight: 600 !important;
            border: none !important;
          }
          
          .wmde-markdown table td {
            padding: 12px 16px !important;
            border-bottom: 1px solid rgb(229, 231, 235) !important;
            border-left: none !important;
            border-right: none !important;
            transition: background-color 0.2s ease !important;
          }
          
          .wmde-markdown table tr:hover td {
            background-color: rgba(59, 130, 246, 0.05) !important;
          }
          
          .wmde-markdown table tr:nth-child(even) td {
            background-color: rgba(248, 250, 252, 0.5) !important;
          }
          
          .dark .wmde-markdown table td {
            border-color: rgb(75, 85, 99) !important;
          }
          
          .dark .wmde-markdown table tr:nth-child(even) td {
            background-color: rgba(55, 65, 81, 0.3) !important;
          }
          
          .dark .wmde-markdown table tr:hover td {
            background-color: rgba(59, 130, 246, 0.1) !important;
          }
          
          /* 图片样式增强 */
          .wmde-markdown img {
            max-width: 100% !important;
            height: auto !important;
            border-radius: 12px !important;
            margin: 20px 0 !important;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1) !important;
            transition: transform 0.3s ease, box-shadow 0.3s ease !important;
          }
          
          .wmde-markdown img:hover {
            transform: scale(1.02) !important;
            box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.15) !important;
          }
          
          /* SVG 支持 */
          .wmde-markdown svg {
            max-width: 100% !important;
            height: auto !important;
            border-radius: 8px !important;
            margin: 16px 0 !important;
          }
          
          /* 列表样式增强 */
          .wmde-markdown ul, .wmde-markdown ol {
            padding-left: 1.5em !important;
            margin: 16px 0 !important;
          }
          
          .wmde-markdown li {
            margin: 8px 0 !important;
            line-height: 1.6 !important;
          }
          
          .wmde-markdown ul > li {
            position: relative !important;
          }
          
          .wmde-markdown ul > li::before {
            content: '▸' !important;
            color: rgb(59, 130, 246) !important;
            position: absolute !important;
            left: -1.2em !important;
            font-weight: bold !important;
          }
          
          /* 链接样式增强 */
          .wmde-markdown a {
            color: rgb(59, 130, 246) !important;
            text-decoration: none !important;
            border-bottom: 1px solid transparent !important;
            transition: all 0.2s ease !important;
            padding: 1px 2px !important;
            border-radius: 3px !important;
          }
          
          .wmde-markdown a:hover {
            background-color: rgba(59, 130, 246, 0.1) !important;
            border-bottom-color: rgb(59, 130, 246) !important;
            transform: translateY(-1px) !important;
          }
          
          /* 分割线样式增强 */
          .wmde-markdown hr {
            border: none !important;
            height: 3px !important;
            background: linear-gradient(135deg, rgb(59, 130, 246), rgb(147, 51, 234)) !important;
            margin: 32px 0 !important;
            border-radius: 2px !important;
          }
          
          /* 全屏模式样式 */
          ${isFullscreen ? `
            .w-md-editor {
              position: relative !important;
              z-index: 60 !important;
            }
          ` : ''}
        `}</style>
      </div>
      
      {/* 使用提示 */}
      <div className="p-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 rounded-b-lg">
        <div className="flex flex-wrap gap-4 text-xs text-gray-600 dark:text-gray-400">
          <span>💡 支持完整的 Markdown 语法</span>
          <span>🖼️ 图片自动优化显示</span>
          <span>📋 代码块一键复制</span>
          <span>📊 表格美化渲染</span>
          <span>🎨 SVG 完美支持</span>
        </div>
      </div>
    </div>
  )
} 