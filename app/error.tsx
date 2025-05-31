'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // 记录错误到监控服务
    console.error('应用错误:', error)
    
    // 这里可以添加错误报告服务，如 Sentry
    // captureException(error)
  }, [error])

  const getErrorMessage = (error: Error) => {
    if (error.message.includes('ChunkLoadError')) {
      return '资源加载失败，这通常是由于网络问题或新版本更新引起的。'
    }
    if (error.message.includes('fetch')) {
      return '网络请求失败，请检查您的网络连接。'
    }
    if (error.message.includes('hydration')) {
      return '页面渲染出现问题，请尝试刷新页面。'
    }
    return '应用运行时出现了意外错误。'
  }

  const getSuggestion = (error: Error) => {
    if (error.message.includes('ChunkLoadError')) {
      return '请尝试刷新页面或清除浏览器缓存。'
    }
    if (error.message.includes('fetch')) {
      return '请检查网络连接后重试。'
    }
    if (error.message.includes('hydration')) {
      return '请刷新页面，如果问题持续存在，请联系开发者。'
    }
    return '请尝试刷新页面，如果问题持续存在，请联系开发者。'
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-xl font-bold text-red-800 dark:text-red-200">
            出现错误
          </CardTitle>
          <CardDescription className="text-red-600 dark:text-red-400">
            {getErrorMessage(error)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
            <p className="font-medium mb-1">建议操作：</p>
            <p>{getSuggestion(error)}</p>
          </div>
          
          {process.env.NODE_ENV === 'development' && (
            <details className="text-xs">
              <summary className="cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                开发者信息 (点击展开)
              </summary>
              <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-red-600 dark:text-red-400 overflow-auto">
                {error.stack}
              </pre>
              {error.digest && (
                <p className="mt-1 text-gray-500">错误ID: {error.digest}</p>
              )}
            </details>
          )}
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={reset}
              variant="default"
              className="flex-1 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              重试
            </Button>
            <Button
              asChild
              variant="outline"
              className="flex-1 flex items-center justify-center gap-2"
            >
              <Link href="/">
                <Home className="w-4 h-4" />
                返回首页
              </Link>
            </Button>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              如果问题持续存在，请联系{' '}
              <a 
                href={`mailto:${process.env.NEXT_PUBLIC_EMAIL || 'admin@example.com'}`}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
              >
                技术支持
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 