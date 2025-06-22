import { NextRequest, NextResponse } from 'next/server'

// 从JSON文件读取文章数据
import articlesData from '@/data/articles.json'

// 模拟文章数据
const mockArticles = articlesData

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // 获取查询参数
    const status = searchParams.get('status') || 'published'
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    // 过滤文章
    let filteredArticles = mockArticles.filter(article => 
      article.status === status
    )

    // 按分类过滤
    if (category) {
      filteredArticles = filteredArticles.filter(article => 
        article.category === category
      )
    }

    // 按搜索关键词过滤
    if (search) {
      const searchLower = search.toLowerCase()
      filteredArticles = filteredArticles.filter(article =>
        article.title.toLowerCase().includes(searchLower) ||
        article.excerpt.toLowerCase().includes(searchLower) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchLower))
      )
    }

    // 排序
    filteredArticles.sort((a, b) => {
      const aValue = a[sortBy as keyof typeof a]
      const bValue = b[sortBy as keyof typeof b]
      
      if (sortOrder === 'desc') {
        return aValue > bValue ? -1 : 1
      } else {
        return aValue < bValue ? -1 : 1
      }
    })

    // 分页
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedArticles = filteredArticles.slice(startIndex, endIndex)

    // 计算总页数
    const totalPages = Math.ceil(filteredArticles.length / limit)

    return NextResponse.json({
      success: true,
      data: {
        articles: paginatedArticles,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount: filteredArticles.length,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    })

  } catch (error) {
    console.error('获取文章列表失败:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: '获取文章列表失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
} 