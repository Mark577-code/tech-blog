'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileQuestion, Home, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <FileQuestion className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-blue-800 dark:text-blue-200">
            页面未找到
          </CardTitle>
          <CardDescription className="text-blue-600 dark:text-blue-400">
            抱歉，您访问的页面不存在或已被移动。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-6xl font-bold text-blue-300 dark:text-blue-700 mb-4">
            404
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
            <p className="font-medium mb-1">可能的原因：</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>您输入的网址有误</li>
              <li>页面已被删除或移动</li>
              <li>链接已过期</li>
            </ul>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              asChild
              variant="default"
              className="flex-1 flex items-center justify-center gap-2"
            >
              <Link href="/">
                <Home className="w-4 h-4" />
                返回首页
              </Link>
            </Button>
            <Button
              onClick={() => window.history.back()}
              variant="outline"
              className="flex-1 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              返回上页
            </Button>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              或者您可以浏览以下内容：
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              <Link 
                href="/articles" 
                className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 hover:underline"
              >
                技术文章
              </Link>
              <span className="text-gray-300">|</span>
              <Link 
                href="/portfolio" 
                className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 hover:underline"
              >
                项目作品
              </Link>
              <span className="text-gray-300">|</span>
              <Link 
                href="/photography" 
                className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 hover:underline"
              >
                摄影作品
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 