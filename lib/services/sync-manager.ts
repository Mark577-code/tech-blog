import { promises as fs } from 'fs'
import path from 'path'

interface SyncRecord {
  articleId: string
  datasetId: string
  documentId: string
  contentHash: string
  status: 'pending' | 'synced' | 'failed'
  lastSynced?: string
  lastAttempt?: string
  errorMessage?: string
  createdAt: string
  updatedAt: string
}

interface SyncStats {
  totalArticles: number
  syncedArticles: number
  pendingSync: number
  failedSync: number
  lastSyncTime?: string
}

class SyncManager {
  private syncFilePath: string

  constructor() {
    this.syncFilePath = path.join(process.cwd(), 'data', 'sync-records.json')
  }

  // 确保同步记录文件存在
  private async ensureSyncFile(): Promise<void> {
    try {
      const dir = path.dirname(this.syncFilePath)
      await fs.mkdir(dir, { recursive: true })
      
      // 检查文件是否存在
      try {
        await fs.access(this.syncFilePath)
      } catch {
        // 文件不存在，创建空文件
        await fs.writeFile(this.syncFilePath, JSON.stringify({}), 'utf8')
      }
    } catch (error) {
      console.error('Failed to ensure sync file:', error)
    }
  }

  // 读取所有同步记录
  private async readSyncRecords(): Promise<Record<string, SyncRecord>> {
    try {
      await this.ensureSyncFile()
      const data = await fs.readFile(this.syncFilePath, 'utf8')
      return JSON.parse(data)
    } catch (error) {
      console.error('Failed to read sync records:', error)
      return {}
    }
  }

  // 写入同步记录
  private async writeSyncRecords(records: Record<string, SyncRecord>): Promise<void> {
    try {
      await this.ensureSyncFile()
      await fs.writeFile(this.syncFilePath, JSON.stringify(records, null, 2), 'utf8')
    } catch (error) {
      console.error('Failed to write sync records:', error)
    }
  }

  // 获取单个文章的同步记录
  async getSyncRecord(articleId: string): Promise<SyncRecord | null> {
    const records = await this.readSyncRecords()
    return records[articleId] || null
  }

  // 更新同步记录
  async updateSyncRecord(articleId: string, updates: Partial<SyncRecord>): Promise<void> {
    const records = await this.readSyncRecords()
    const existing = records[articleId]
    
    const record: SyncRecord = {
      articleId,
      datasetId: '',
      documentId: '',
      contentHash: '',
      status: 'pending',
      createdAt: new Date().toISOString(),
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    }

    records[articleId] = record
    await this.writeSyncRecords(records)
  }

  // 删除同步记录
  async deleteSyncRecord(articleId: string): Promise<void> {
    const records = await this.readSyncRecords()
    delete records[articleId]
    await this.writeSyncRecords(records)
  }

  // 获取所有同步记录
  async getAllSyncRecords(): Promise<SyncRecord[]> {
    const records = await this.readSyncRecords()
    return Object.values(records)
  }

  // 获取同步统计信息
  async getSyncStats(): Promise<SyncStats> {
    const records = await this.getAllSyncRecords()
    
    const stats: SyncStats = {
      totalArticles: records.length,
      syncedArticles: records.filter(r => r.status === 'synced').length,
      pendingSync: records.filter(r => r.status === 'pending').length,
      failedSync: records.filter(r => r.status === 'failed').length
    }

    // 找到最近的同步时间
    const lastSynced = records
      .filter(r => r.lastSynced)
      .sort((a, b) => new Date(b.lastSynced!).getTime() - new Date(a.lastSynced!).getTime())[0]
    
    if (lastSynced && lastSynced.lastSynced) {
      stats.lastSyncTime = lastSynced.lastSynced
    }

    return stats
  }

  // 获取失败的同步记录
  async getFailedSyncs(): Promise<SyncRecord[]> {
    const records = await this.getAllSyncRecords()
    return records.filter(r => r.status === 'failed')
  }

  // 获取待同步的记录
  async getPendingSyncs(): Promise<SyncRecord[]> {
    const records = await this.getAllSyncRecords()
    return records.filter(r => r.status === 'pending')
  }

  // 检查文章是否需要同步（基于内容哈希）
  async shouldSync(articleId: string, currentHash: string): Promise<boolean> {
    const record = await this.getSyncRecord(articleId)
    
    if (!record) return true // 新文章需要同步
    if (record.status === 'failed') return true // 失败的需要重试
    if (record.contentHash !== currentHash) return true // 内容有变化
    
    return false
  }

  // 清理所有同步记录
  async clearAllRecords(): Promise<void> {
    await this.writeSyncRecords({})
  }
}

export { SyncManager, type SyncRecord, type SyncStats } 