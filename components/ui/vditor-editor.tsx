'use client'

import { useState, useEffect, useRef } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { VDITOR_CONFIG } from '@/constants/editor'
import type { Category } from '@/types/category'

// 动态导入 vditor，避免 SSR 问题
declare global {
  interface Window {
    Vditor: any;
  }
}

interface VditorEditorProps {
  value: string
  onChange: (value: string) => void
  category?: string
  onCategoryChange?: (category: string) => void
  categories?: Category[]
  height?: number
  placeholder?: string
}

export const VditorEditor = ({
  value,
  onChange,
  category,
  onCategoryChange,
  categories = [],
  height = 400,
  placeholder = '开始编写你的文章...'
}: VditorEditorProps) => {
  const [mounted, setMounted] = useState(false)
  const [vditorLoaded, setVditorLoaded] = useState(false)
  const [loadError, setLoadError] = useState(false)
  const [vditor, setVditor] = useState<any>(null)
  const [vditorReady, setVditorReady] = useState(false)
  const vditorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // 检查 vditor 实例是否有效
  const isVditorValid = (instance: any): boolean => {
    try {
      return instance && 
             typeof instance.getValue === 'function' && 
             typeof instance.setValue === 'function' &&
             instance.vditor && 
             instance.vditor.currentMode !== undefined &&
             instance.vditor.wysiwyg !== undefined
    } catch {
      return false
    }
  }

  // 安全的 vditor 操作方法
  const safeVditorOperation = (operation: () => void, fallback?: () => void) => {
    try {
      if (vditor && vditorReady && isVditorValid(vditor)) {
        operation()
      } else if (fallback) {
        fallback()
      }
    } catch (error) {
      console.error('Vditor 操作失败:', error)
      if (fallback) {
        fallback()
      }
    }
  }

  // 安全获取 vditor 值
  const safeGetVditorValue = (): string => {
    try {
      if (vditor && vditorReady && isVditorValid(vditor)) {
        return vditor.getValue() || ''
      }
    } catch (error) {
      console.error('获取 vditor 值失败:', error)
    }
    return ''
  }

  // 安全设置 vditor 值
  const safeSetVditorValue = (newValue: string) => {
    safeVditorOperation(() => {
      vditor.setValue(newValue)
    })
  }

  // 动态加载 vditor
  useEffect(() => {
    if (!mounted) return

    const loadVditor = async () => {
      try {
        setLoadError(false)
        
        // 检查是否已经加载
        if (window.Vditor) {
          setVditorLoaded(true)
          return
        }

        // 加载 vditor CSS
        if (!document.querySelector('link[href*="vditor"]')) {
          const link = document.createElement('link')
          link.rel = 'stylesheet'
          link.href = `${VDITOR_CONFIG.CDN}/dist/index.css`
          link.onerror = () => {
            console.error('Vditor CSS 加载失败')
            setLoadError(true)
          }
          document.head.appendChild(link)
        }

        // 加载 vditor JS
        const script = document.createElement('script')
        script.src = `${VDITOR_CONFIG.CDN}/dist/index.min.js`
        script.onload = () => {
          if (window.Vditor) {
            setVditorLoaded(true)
          } else {
            setLoadError(true)
          }
        }
        script.onerror = () => {
          console.error('Vditor JS 加载失败，请检查网络连接')
          setLoadError(true)
        }
        document.head.appendChild(script)
      } catch (error) {
        console.error('加载 vditor 失败:', error)
        setLoadError(true)
      }
    }

    loadVditor()
  }, [mounted])

  // 初始化 vditor 编辑器
  useEffect(() => {
    if (!vditorLoaded || !vditorRef.current || vditor || loadError) return

    const initVditor = async () => {
      try {
        const vditorInstance = new window.Vditor(vditorRef.current, {
          ...VDITOR_CONFIG.DEFAULT_OPTIONS,
          height: height,
          placeholder: placeholder,
          value: value,
          input: (value: string) => {
            onChange(value)
          },
          focus: (value: string) => {
            // 编辑器获得焦点时的回调
          },
          blur: (value: string) => {
            // 编辑器失去焦点时的回调
          },
          after: () => {
            // 编辑器初始化完成的回调
            console.log('Vditor 编辑器初始化完成')
            
            // 额外验证确保编辑器真正可用
            setTimeout(() => {
              if (vditorInstance && isVditorValid(vditorInstance)) {
                setVditorReady(true)
                console.log('Vditor 编辑器验证通过，可以安全使用')
              } else {
                console.error('Vditor 编辑器初始化验证失败')
                setLoadError(true)
              }
            }, 50)
          },
        })

        setVditor(vditorInstance)
      } catch (error) {
        console.error('初始化 vditor 失败:', error)
        setLoadError(true)
      }
    }

    initVditor()

    // 清理函数
    return () => {
      if (vditor) {
        try {
          vditor.destroy?.()
        } catch (error) {
          console.error('销毁 vditor 失败:', error)
        }
        setVditorReady(false)
      }
    }
  }, [vditorLoaded, vditorRef, height, placeholder, onChange, loadError])

  // 更新编辑器内容
  useEffect(() => {
    if (!vditor || !vditorReady) return
    
    // 双重验证 vditor 实例有效性
    if (!isVditorValid(vditor)) {
      console.log('Vditor 实例无效，等待初始化完成')
      return
    }
    
    // 使用安全方法获取和设置值
    const currentValue = safeGetVditorValue()
    if (value !== currentValue) {
      safeSetVditorValue(value)
    }
  }, [value, vditor, vditorReady])

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

      {/* Vditor 编辑器 */}
      <div className="space-y-2">
        <label className="text-sm font-medium">文章内容</label>
        <div className="border rounded-lg overflow-hidden">
          {loadError ? (
            <div 
              className="flex items-center justify-center bg-red-50 border-red-200"
              style={{ height: `${height}px` }}
            >
              <div className="text-center">
                <div className="text-red-500 mb-2">
                  <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.966-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <p className="text-sm text-red-600 mb-2">Vditor 编辑器加载失败</p>
                <p className="text-xs text-red-500">请检查网络连接，或尝试刷新页面</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-2 px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                >
                  刷新页面
                </button>
              </div>
            </div>
          ) : !vditorLoaded || !vditorReady ? (
            <div 
              className="flex items-center justify-center bg-muted animate-pulse"
              style={{ height: `${height}px` }}
            >
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">
                  {!vditorLoaded ? '加载 Vditor 编辑器中...' : '初始化编辑器中...'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {!vditorLoaded ? '首次加载可能需要几秒钟' : '正在配置编辑器设置'}
                </p>
              </div>
            </div>
          ) : (
            <div ref={vditorRef} />
          )}
        </div>
        
        {/* 编辑器提示 */}
        {vditorLoaded && vditorReady && !loadError && (
          <div className="text-xs text-muted-foreground space-y-1">
            <p className="flex items-center gap-1">
              <span>💡</span>
              <span>Vditor v3.11.1 强大的 Markdown 编辑器，支持所见即所得、即时渲染和分屏预览模式</span>
            </p>
            <div className="flex flex-wrap gap-4">
              {VDITOR_CONFIG.SHORTCUTS.map((shortcut) => (
                <span key={shortcut.key}>
                  <kbd className="px-1 py-0.5 text-xs bg-muted rounded">{shortcut.key}</kbd> → {shortcut.action}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 