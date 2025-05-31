import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { getAllArticles } from '@/lib/articles'
import { getAllProjects } from '@/lib/projects'
import { getAllGalleryImages } from '@/lib/gallery'
import type { DashboardStats } from '@/types/gallery'
import type { ApiResponse } from '@/types/article'

export async function GET(request: Request) {
  try {
    // 验证管理员权限
    const user = await requireAdmin()
    if (!user) {
      return NextResponse.json({
        success: false,
        error: '需要管理员权限'
      } as ApiResponse, { status: 401 })
    }

    // 获取统计数据
    const [articlesResult, projectsResult, imagesResult] = await Promise.all([
      getAllArticles({ status: 'all', limit: 1000 }),
      getAllProjects({ status: 'all', limit: 1000 }),
      getAllGalleryImages({ limit: 1000 })
    ])

    const articles = articlesResult.articles
    const projects = projectsResult.projects
    const images = imagesResult.images

    // 计算今日访问量（模拟数据）
    const todayViews = Math.floor(Math.random() * 1000) + 500

    // 生成访问趋势数据（模拟数据）
    const now = new Date()
    const viewsData = []
    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000)
      const timeStr = time.getHours().toString().padStart(2, '0') + ':00'
      const views = Math.floor(Math.random() * 100) + 10
      viewsData.push({ time: timeStr, views })
    }

    // 获取最近活动
    const recentActivities = [
      ...articles.slice(0, 3).map(article => ({
        id: article.id,
        type: 'article' as const,
        action: 'updated' as const,
        title: article.title,
        timestamp: article.updatedAt
      })),
      ...projects.slice(0, 2).map(project => ({
        id: project.id,
        type: 'project' as const,
        action: 'updated' as const,
        title: project.title,
        timestamp: project.updatedAt
      }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5)

    const stats: DashboardStats = {
      todayViews,
      totalArticles: articles.length,
      totalProjects: projects.length,
      totalImages: images.length,
      recentActivities,
      viewsData
    }

    return NextResponse.json({
      success: true,
      data: stats
    } as ApiResponse)

  } catch (error) {
    console.error('获取统计数据错误:', error)
    return NextResponse.json({
      success: false,
      error: '获取统计数据失败'
    } as ApiResponse, { status: 500 })
  }
} 