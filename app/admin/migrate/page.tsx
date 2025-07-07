'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Database, Upload, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

interface MigrationStats {
  categories: number
  tags: number
  articles: number
  projects: number
  gallery: number
}

interface MigrationStatus {
  stats: MigrationStats
  hasData: boolean
  status: 'empty' | 'migrated'
}

export default function MigratePage() {
  const [status, setStatus] = useState<MigrationStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // 获取迁移状态
  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/admin/migrate')
      const result = await response.json()
      
      if (result.success) {
        setStatus(result.data)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('获取迁移状态失败')
    }
  }

  // 执行迁移
  const handleMigrate = async () => {
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const response = await fetch('/api/admin/migrate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'migrate' })
      })

      const result = await response.json()

      if (result.success) {
        setMessage(result.message)
        await fetchStatus() // 刷新状态
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('数据迁移失败')
    } finally {
      setLoading(false)
    }
  }

  // 验证数据
  const handleVerify = async () => {
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const response = await fetch('/api/admin/migrate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'verify' })
      })

      const result = await response.json()

      if (result.success) {
        setMessage(result.message)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('数据验证失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStatus()
  }, [])

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Database className="w-8 h-8" />
          Supabase 数据迁移
        </h1>
        <p className="text-muted-foreground">
          将现有的 JSON 数据迁移到 Supabase 数据库
        </p>
      </div>

      {/* 状态卡片 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {status?.hasData ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-yellow-500" />
            )}
            当前状态
          </CardTitle>
          <CardDescription>
            数据库表数据统计
          </CardDescription>
        </CardHeader>
        <CardContent>
          {status ? (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{status.stats.categories}</div>
                <div className="text-sm text-muted-foreground">分类</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{status.stats.tags}</div>
                <div className="text-sm text-muted-foreground">标签</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{status.stats.articles}</div>
                <div className="text-sm text-muted-foreground">文章</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{status.stats.projects}</div>
                <div className="text-sm text-muted-foreground">项目</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-600">{status.stats.gallery}</div>
                <div className="text-sm text-muted-foreground">图片</div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="ml-2">加载中...</span>
            </div>
          )}
          
          <div className="mt-4 flex justify-center">
            <Badge variant={status?.hasData ? 'default' : 'secondary'}>
              {status?.hasData ? '已迁移数据' : '暂无数据'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* 操作按钮 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>数据迁移操作</CardTitle>
          <CardDescription>
            执行数据迁移或验证数据完整性
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Button 
            onClick={handleMigrate}
            disabled={loading}
            className="flex items-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            {status?.hasData ? '重新迁移数据' : '开始迁移数据'}
          </Button>
          
          <Button 
            onClick={handleVerify}
            disabled={loading || !status?.hasData}
            variant="outline"
            className="flex items-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            验证数据完整性
          </Button>

          <Button 
            onClick={fetchStatus}
            disabled={loading}
            variant="outline"
          >
            刷新状态
          </Button>
        </CardContent>
      </Card>

      {/* 消息提示 */}
      {message && (
        <Alert className="mb-6">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* 说明信息 */}
      <Card>
        <CardHeader>
          <CardTitle>迁移说明</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm space-y-2">
            <p>📋 <strong>迁移内容：</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1 text-muted-foreground">
              <li>分类数据 (categories.json)</li>
              <li>标签数据 (tags.json)</li>
              <li>文章数据 (articles.json)</li>
              <li>项目数据 (projects.json)</li>
              <li>图片库数据 (gallery.json)</li>
            </ul>
          </div>
          
          <div className="text-sm space-y-2">
            <p>⚠️ <strong>注意事项：</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1 text-muted-foreground">
              <li>迁移前请确保 Supabase 数据库表已创建</li>
              <li>重复迁移会覆盖现有数据（基于 slug/url 去重）</li>
              <li>迁移过程可能需要几分钟时间</li>
              <li>建议在迁移前备份现有数据</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 