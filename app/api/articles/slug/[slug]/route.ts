import { NextResponse } from 'next/server'
import { getArticleBySlug } from '@/lib/articles'
import type { ApiResponse } from '@/types/article'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const article = await getArticleBySlug(slug)
    
    if (!article) {
      return NextResponse.json({
        success: false,
        error: '文章不存在'
      } as ApiResponse, { status: 404 })
    }

    // 只返回已发布的文章（除非是管理员请求）
    if (article.status !== 'published') {
      return NextResponse.json({
        success: false,
        error: '文章不存在'
      } as ApiResponse, { status: 404 })
    }
    
    return NextResponse.json({
      success: true,
      data: article
    } as ApiResponse)
    
  } catch (error) {
    console.error('获取文章错误:', error)
    return NextResponse.json({
      success: false,
      error: '获取文章失败'
    } as ApiResponse, { status: 500 })
  }
} 