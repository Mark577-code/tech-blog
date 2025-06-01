import { NextRequest, NextResponse } from 'next/server'
import { KnowledgeSyncService } from '@/lib/services/knowledge-sync'
import { getAllArticles } from '@/lib/articles'

const syncService = new KnowledgeSyncService()

// 获取同步状态
export async function GET() {
  try {
    const stats = await syncService.getSyncStats()
    const records = await syncService.getAllSyncRecords()
    
    return NextResponse.json({
      success: true,
      data: {
        stats,
        records
      }
    })
  } catch (error) {
    console.error('获取同步状态失败:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '获取同步状态失败' 
      },
      { status: 500 }
    )
  }
}

// 执行同步操作
export async function POST(request: NextRequest) {
  try {
    const { action, articleId } = await request.json()

    switch (action) {
      case 'sync-single': {
        if (!articleId) {
          return NextResponse.json(
            { success: false, error: '缺少文章ID' },
            { status: 400 }
          )
        }

        const result = await getAllArticles({ status: 'all', limit: 1000 })
        const article = result.articles.find(a => a.id === articleId)
        
        if (!article) {
          return NextResponse.json(
            { success: false, error: '文章不存在' },
            { status: 404 }
          )
        }

        await syncService.syncArticle(article)
        
        return NextResponse.json({
          success: true,
          message: `文章 "${article.title}" 同步成功`
        })
      }

      case 'sync-all': {
        const result = await getAllArticles({ status: 'published', limit: 1000 })
        const publishedArticles = result.articles
        
        await syncService.syncAllArticles(publishedArticles)
        
        return NextResponse.json({
          success: true,
          message: `成功同步 ${publishedArticles.length} 篇文章`
        })
      }

      case 'retry-failed': {
        const result = await getAllArticles({ status: 'all', limit: 1000 })
        await syncService.retryFailedSyncs(result.articles)
        
        return NextResponse.json({
          success: true,
          message: '重试失败同步完成'
        })
      }

      case 'remove-article': {
        if (!articleId) {
          return NextResponse.json(
            { success: false, error: '缺少文章ID' },
            { status: 400 }
          )
        }

        await syncService.removeArticle(articleId)
        
        return NextResponse.json({
          success: true,
          message: '文章从知识库中删除成功'
        })
      }

      case 'clear-all': {
        await syncService.clearAllKnowledgeBase()
        
        return NextResponse.json({
          success: true,
          message: '知识库清空完成'
        })
      }

      default:
        return NextResponse.json(
          { success: false, error: '无效的操作类型' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('同步操作失败:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '同步操作失败' 
      },
      { status: 500 }
    )
  }
} 