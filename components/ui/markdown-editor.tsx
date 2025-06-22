'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import type { Category } from '@/types/category'

// 动态导入编辑器，避免 SSR 问题
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
)

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  category?: string
  onCategoryChange?: (category: string) => void
  categories?: Category[]
  height?: number
  placeholder?: string
}

export const MarkdownEditor = ({
  value,
  onChange,
  category,
  onCategoryChange,
  categories = [],
  height = 400,
  placeholder = '开始编写你的文章...'
}: MarkdownEditorProps) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // 获取分类显示名称
  const getCategoryLabel = (slug: string): string => {
    const cat = categories.find(c => c.slug === slug)
    return cat ? cat.name : slug
  }

  // 获取分类颜色
  const getCategoryColor = (slug: string): string => {
    const cat = categories.find(c => c.slug === slug)
    return cat ? cat.color : '#3b82f6'
  }

  if (!mounted) {
    return (
      <div className="space-y-4">
        {/* 分类选择器占位符 */}
        {onCategoryChange && (
          <div className="space-y-2">
            <label className="text-sm font-medium">文章分类</label>
            <div className="h-10 bg-muted rounded-lg animate-pulse" />
          </div>
        )}
        
        {/* 编辑器占位符 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">文章内容</label>
          <div 
            className="bg-muted rounded-lg animate-pulse"
            style={{ height: `${height}px` }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* 分类选择器 */}
      {onCategoryChange && (
        <div className="space-y-2">
          <label className="text-sm font-medium">文章分类</label>
          <div className="flex items-center gap-3">
            <Select value={category || ''} onValueChange={onCategoryChange}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="选择文章分类" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.slug}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span>{cat.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({cat.description})
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* 显示当前选中的分类 */}
            {category && (
              <Badge 
                variant="secondary" 
                className="border"
                style={{ 
                  borderColor: getCategoryColor(category),
                  color: getCategoryColor(category)
                }}
              >
                <div 
                  className="w-2 h-2 rounded-full mr-2"
                  style={{ backgroundColor: getCategoryColor(category) }}
                />
                {getCategoryLabel(category)}
              </Badge>
            )}
          </div>
          
          {categories.length === 0 && (
            <p className="text-sm text-muted-foreground">
              暂无可用分类，请先创建分类
            </p>
          )}
        </div>
      )}

      {/* Markdown 编辑器 */}
      <div className="space-y-2">
        <label className="text-sm font-medium">文章内容</label>
        <div className="border rounded-lg overflow-hidden">
          <MDEditor
            value={value}
            onChange={(val) => onChange(val || '')}
            height={height}
            preview="edit"
            hideToolbar={false}
            textareaProps={{
              placeholder: placeholder,
              style: {
                fontSize: '14px',
                lineHeight: '1.6',
                fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
              }
            }}
            visibleDragbar={false}
            data-color-mode="light"
          />
        </div>
        
        {/* 编辑器提示 */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>💡 支持标准 Markdown 语法，可以使用工具栏快速插入元素</p>
          <div className="flex flex-wrap gap-4">
            <span><code>**粗体**</code> → <strong>粗体</strong></span>
            <span><code>*斜体*</code> → <em>斜体</em></span>
            <span><code>`代码`</code> → <code>代码</code></span>
            <span><code>![图片](url)</code> → 图片</span>
          </div>
        </div>
      </div>
    </div>
  )
} 