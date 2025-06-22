import { NextRequest, NextResponse } from 'next/server'

// 从JSON文件读取文章数据
import articlesData from '@/data/articles.json'

// 文章数据
const mockArticles = articlesData

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    
    // 查找文章
    const article = mockArticles.find(article => article.slug === slug)
    
    if (!article) {
      return NextResponse.json(
        { 
          success: false, 
          error: '文章不存在',
          message: `找不到slug为"${slug}"的文章`
        },
        { status: 404 }
      )
    }

    // 模拟增加浏览量
    article.viewCount += 1

    return NextResponse.json({
      success: true,
      data: {
        article
      }
    })

  } catch (error) {
    console.error('获取文章详情失败:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: '获取文章详情失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
} 