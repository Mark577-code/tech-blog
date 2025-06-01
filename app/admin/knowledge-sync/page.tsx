"use client"

import { useState, useEffect } from 'react'
import { SyncStats, SyncRecord } from '@/lib/services/sync-manager'
import { toast } from 'sonner'

interface SyncData {
  stats: SyncStats
  records: SyncRecord[]
}

export default function KnowledgeSyncPage() {
  const [syncData, setSyncData] = useState<SyncData | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  // 获取同步状态
  const fetchSyncData = async () => {
    try {
      const response = await fetch('/api/knowledge-sync')
      const result = await response.json()
      
      if (result.success) {
        setSyncData(result.data)
      } else {
        toast.error(`获取同步状态失败: ${result.error}`)
      }
    } catch (error) {
      toast.error('获取同步状态失败')
      console.error('Fetch sync data error:', error)
    } finally {
      setLoading(false)
    }
  }

  // 执行同步操作
  const handleSyncAction = async (action: string, articleId?: string) => {
    setActionLoading(action)
    
    try {
      const response = await fetch('/api/knowledge-sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action, articleId })
      })
      
      const result = await response.json()
      
      if (result.success) {
        toast.success(result.message)
        await fetchSyncData() // 刷新数据
      } else {
        toast.error(`操作失败: ${result.error}`)
      }
    } catch (error) {
      toast.error('操作失败')
      console.error('Sync action error:', error)
    } finally {
      setActionLoading(null)
    }
  }

  useEffect(() => {
    fetchSyncData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!syncData) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-red-600">加载同步数据失败</h1>
      </div>
    )
  }

  const { stats, records } = syncData

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          知识库同步管理
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          管理文章与Dify知识库的同步状态
        </p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="总文章数"
          value={stats.totalArticles}
          color="blue"
          icon="📚"
        />
        <StatCard
          title="已同步"
          value={stats.syncedArticles}
          color="green"
          icon="✅"
        />
        <StatCard
          title="待同步"
          value={stats.pendingSync}
          color="yellow"
          icon="⏳"
        />
        <StatCard
          title="同步失败"
          value={stats.failedSync}
          color="red"
          icon="❌"
        />
      </div>

      {/* 最近同步时间 */}
      {stats.lastSyncTime && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            最近同步时间: {new Date(stats.lastSyncTime).toLocaleString('zh-CN')}
          </p>
        </div>
      )}

      {/* 操作按钮 */}
      <div className="flex flex-wrap gap-4 mb-8">
        <ActionButton
          onClick={() => handleSyncAction('sync-all')}
          loading={actionLoading === 'sync-all'}
          variant="primary"
        >
          🔄 批量同步所有文章
        </ActionButton>
        
        <ActionButton
          onClick={() => handleSyncAction('retry-failed')}
          loading={actionLoading === 'retry-failed'}
          variant="secondary"
          disabled={stats.failedSync === 0}
        >
          🔄 重试失败项目
        </ActionButton>
        
        <ActionButton
          onClick={() => {
            if (confirm('确定要清空所有知识库数据吗？此操作不可逆！')) {
              handleSyncAction('clear-all')
            }
          }}
          loading={actionLoading === 'clear-all'}
          variant="danger"
        >
          🗑️ 清空知识库
        </ActionButton>

        <button
          onClick={fetchSyncData}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          🔄 刷新状态
        </button>
      </div>

      {/* 同步记录列表 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            同步记录 ({records.length})
          </h2>
        </div>
        
        {records.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            暂无同步记录
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    文章ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    最近同步
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    错误信息
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {records.map((record) => (
                  <tr key={record.articleId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {record.articleId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={record.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {record.lastSynced 
                        ? new Date(record.lastSynced).toLocaleString('zh-CN')
                        : '-'
                      }
                    </td>
                    <td className="px-6 py-4 text-sm text-red-600 dark:text-red-400 max-w-xs truncate">
                      {record.errorMessage || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleSyncAction('sync-single', record.articleId)}
                        disabled={actionLoading === `sync-single-${record.articleId}`}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50"
                      >
                        {actionLoading === `sync-single-${record.articleId}` ? '同步中...' : '重新同步'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

// 统计卡片组件
function StatCard({ 
  title, 
  value, 
  color, 
  icon 
}: { 
  title: string
  value: number
  color: 'blue' | 'green' | 'yellow' | 'red'
  icon: string
}) {
  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    yellow: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
    red: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
  }

  return (
    <div className={`p-6 rounded-lg border ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  )
}

// 操作按钮组件
function ActionButton({ 
  children, 
  onClick, 
  loading, 
  variant = 'primary', 
  disabled = false 
}: {
  children: React.ReactNode
  onClick: () => void
  loading: boolean
  variant?: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
}) {
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white'
  }

  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className={`px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]}`}
    >
      {loading ? '处理中...' : children}
    </button>
  )
}

// 状态徽章组件
function StatusBadge({ status }: { status: 'pending' | 'synced' | 'failed' }) {
  const statusConfig = {
    pending: { text: '待同步', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' },
    synced: { text: '已同步', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' },
    failed: { text: '失败', color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' }
  }

  const config = statusConfig[status]

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
      {config.text}
    </span>
  )
} 