"use client"

import { memo } from 'react'
import { cn } from '@/lib/utils'

interface MarkdownRendererProps {
  content: string
  className?: string
}

// 简单的Markdown解析器
const parseMarkdown = (content: string): string => {
  let html = content

  // 代码块处理 (```)
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, language, code) => {
    const lang = language || 'text'
    return `<div class="code-block-wrapper"><div class="code-header"><span class="language-badge">${lang}</span><button class="copy-btn" onclick="navigator.clipboard.writeText(\`${code.trim()}\`)">复制</button></div><pre class="code-block"><code class="language-${lang}">${escapeHtml(code.trim())}</code></pre></div>`
  })

  // 行内代码
  html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')

  // 标题
  html = html.replace(/^### (.*$)/gm, '<h3 class="markdown-h3">$1</h3>')
  html = html.replace(/^## (.*$)/gm, '<h2 class="markdown-h2">$1</h2>')
  html = html.replace(/^# (.*$)/gm, '<h1 class="markdown-h1">$1</h1>')

  // 粗体和斜体
  html = html.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>')
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>')
  html = html.replace(/~~([^~]+)~~/g, '<del>$1</del>')

  // 链接
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="markdown-link" target="_blank" rel="noopener noreferrer">$1</a>')

  // 无序列表
  html = html.replace(/^- (.*$)/gm, '<li class="markdown-li">$1</li>')
  html = html.replace(/(<li class="markdown-li">.*<\/li>)/s, '<ul class="markdown-ul">$1</ul>')

  // 有序列表
  html = html.replace(/^\d+\. (.*$)/gm, '<li class="markdown-li-ordered">$1</li>')
  html = html.replace(/(<li class="markdown-li-ordered">.*<\/li>)/s, '<ol class="markdown-ol">$1</ol>')

  // 引用
  html = html.replace(/^> (.*$)/gm, '<blockquote class="markdown-blockquote">$1</blockquote>')

  // 分割线
  html = html.replace(/^---$/gm, '<hr class="markdown-hr" />')

  // 段落（最后处理）
  const lines = html.split('\n')
  const processedLines = lines.map(line => {
    const trimmed = line.trim()
    if (!trimmed) return '<br />'
    if (trimmed.startsWith('<h') || 
        trimmed.startsWith('<ul') || 
        trimmed.startsWith('<ol') || 
        trimmed.startsWith('<li') || 
        trimmed.startsWith('<blockquote') || 
        trimmed.startsWith('<hr') ||
        trimmed.startsWith('<div class="code-block-wrapper">')) {
      return trimmed
    }
    if (trimmed.startsWith('<') && trimmed.endsWith('>')) {
      return trimmed
    }
    return `<p class="markdown-p">${trimmed}</p>`
  })

  return processedLines.join('\n')
}

// HTML转义函数
const escapeHtml = (text: string): string => {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

const MarkdownRenderer = memo(({ content, className }: MarkdownRendererProps) => {
  const htmlContent = parseMarkdown(content)

  return (
    <div 
      className={cn("markdown-content", className)}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  )
})

MarkdownRenderer.displayName = 'MarkdownRenderer'

export default MarkdownRenderer 