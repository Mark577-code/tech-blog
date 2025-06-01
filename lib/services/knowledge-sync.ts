import { Article } from '@/types/article'
import { DifyKnowledgeService } from './dify-knowledge'
import { ArticleProcessor } from '../processors/article-processor'
import { SyncManager } from './sync-manager'

class KnowledgeSyncService {
  private difyService: DifyKnowledgeService
  private syncManager: SyncManager

  constructor() {
    this.difyService = new DifyKnowledgeService()
    this.syncManager = new SyncManager()
  }

  // 同步单篇文章到知识库
  async syncArticle(article: Article): Promise<void> {
    console.log(`开始同步文章: ${article.title}`)

    try {
      // 检查文章是否适合同步
      if (!ArticleProcessor.shouldSyncArticle(article)) {
        console.log(`文章 ${article.title} 不符合同步条件`)
        return
      }

      // 生成内容哈希
      const contentHash = ArticleProcessor.generateContentHash(article)
      
      // 检查是否需要同步
      const shouldSync = await this.syncManager.shouldSync(article.id, contentHash)
      if (!shouldSync) {
        console.log(`文章 ${article.title} 无需同步`)
        return
      }

      // 格式化文章内容
      const articleDoc = ArticleProcessor.formatForKnowledgeBase(article)
      const documentRequest = ArticleProcessor.createDifyDocumentRequest(articleDoc)

      // 获取或创建对应分类的知识库
      const dataset = await this.difyService.getOrCreateDatasetByCategory(article.category)
      
      // 检查是否已存在文档
      const existingRecord = await this.syncManager.getSyncRecord(article.id)
      
      let documentId: string

      if (existingRecord && existingRecord.documentId) {
        // 更新已存在的文档
        console.log(`更新已存在的文档: ${article.title}`)
        const updatedDoc = await this.difyService.updateDocument(
          dataset.id,
          existingRecord.documentId,
          documentRequest.text
        )
        documentId = updatedDoc.id
      } else {
        // 创建新文档
        console.log(`创建新文档: ${article.title}`)
        const newDoc = await this.difyService.createDocument(dataset.id, documentRequest)
        documentId = newDoc.id
      }

      // 更新同步记录
      await this.syncManager.updateSyncRecord(article.id, {
        datasetId: dataset.id,
        documentId: documentId,
        contentHash: contentHash,
        status: 'synced',
        lastSynced: new Date().toISOString()
      })

      console.log(`文章 ${article.title} 同步成功`)

    } catch (error) {
      console.error(`文章 ${article.title} 同步失败:`, error)
      
      // 记录失败状态
      await this.syncManager.updateSyncRecord(article.id, {
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : '未知错误',
        lastAttempt: new Date().toISOString()
      })

      throw error
    }
  }

  // 删除文章的知识库文档
  async removeArticle(articleId: string): Promise<void> {
    console.log(`开始删除文章文档: ${articleId}`)

    try {
      const record = await this.syncManager.getSyncRecord(articleId)
      
      if (record && record.datasetId && record.documentId) {
        await this.difyService.deleteDocument(record.datasetId, record.documentId)
        console.log(`文档删除成功: ${articleId}`)
      }

      // 删除同步记录
      await this.syncManager.deleteSyncRecord(articleId)

    } catch (error) {
      console.error(`删除文档失败: ${articleId}`, error)
      throw error
    }
  }

  // 批量同步所有文章
  async syncAllArticles(articles: Article[]): Promise<void> {
    console.log(`开始批量同步 ${articles.length} 篇文章`)

    const results = {
      success: 0,
      failed: 0,
      skipped: 0
    }

    // 分批处理，避免API限流
    const batchSize = 3
    for (let i = 0; i < articles.length; i += batchSize) {
      const batch = articles.slice(i, i + batchSize)
      
      await Promise.allSettled(
        batch.map(async (article) => {
          try {
            await this.syncArticle(article)
            results.success++
          } catch (error) {
            results.failed++
            console.error(`批量同步失败: ${article.title}`, error)
          }
        })
      )

      // 批次间暂停，避免过快请求
      if (i + batchSize < articles.length) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }

    console.log(`批量同步完成:`, results)
  }

  // 重试失败的同步
  async retryFailedSyncs(articles: Article[]): Promise<void> {
    const failedRecords = await this.syncManager.getFailedSyncs()
    console.log(`开始重试 ${failedRecords.length} 个失败的同步`)

    for (const record of failedRecords) {
      const article = articles.find(a => a.id === record.articleId)
      if (article) {
        try {
          await this.syncArticle(article)
          console.log(`重试成功: ${article.title}`)
        } catch (error) {
          console.error(`重试失败: ${article.title}`, error)
        }
      }
    }
  }

  // 获取同步统计信息
  async getSyncStats() {
    return await this.syncManager.getSyncStats()
  }

  // 获取所有同步记录
  async getAllSyncRecords() {
    return await this.syncManager.getAllSyncRecords()
  }

  // 清空所有知识库数据（危险操作）
  async clearAllKnowledgeBase(): Promise<void> {
    console.log('开始清空知识库数据...')
    
    try {
      const datasets = await this.difyService.getDatasets()
      const blogDatasets = datasets.filter(ds => ds.name.startsWith('博客文章-'))

      for (const dataset of blogDatasets) {
        const documents = await this.difyService.getDocuments(dataset.id)
        for (const doc of documents) {
          await this.difyService.deleteDocument(dataset.id, doc.id)
        }
      }

      await this.syncManager.clearAllRecords()
      console.log('知识库数据清空完成')

    } catch (error) {
      console.error('清空知识库失败:', error)
      throw error
    }
  }
}

export { KnowledgeSyncService } 