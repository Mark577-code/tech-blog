import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { getAllArticles, createArticle } from '@/lib/articles'
import type { CreateArticleData, ApiResponse, ArticleFilters } from '@/types/article'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    const filters: ArticleFilters = {
      status: (searchParams.get('status') as 'draft' | 'published' | 'all') || 'all',
      category: searchParams.get('category') || '',
      search: searchParams.get('search') || '',
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10'),
      sortBy: (searchParams.get('sortBy') as any) || 'createdAt',
      sortOrder: (searchParams.get('sortOrder') as any) || 'desc'
    }
    
    // 处理标签参数
    const tagsParam = searchParams.get('tags')
    if (tagsParam) {
      filters.tags = tagsParam.split(',').filter(Boolean)
    }
    
    // 清理空值
    if (!filters.category) {
      delete filters.category
    }
    if (!filters.search) {
      delete filters.search
    }
    
    const result = await getAllArticles(filters)
    
    return NextResponse.json({
      success: true,
      data: result
    } as ApiResponse)
    
  } catch (error) {
    console.error('获取文章列表错误:', error)
    return NextResponse.json({
      success: false,
      error: '获取文章列表失败'
    } as ApiResponse, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // 验证管理员权限
    const user = await requireAdmin()
    if (!user) {
      return NextResponse.json({
        success: false,
        error: '需要管理员权限'
      } as ApiResponse, { status: 401 })
    }
    
    const body: CreateArticleData = await request.json()
    
    // 验证必要字段
    if (!body.title || !body.content || !body.category) {
      return NextResponse.json({
        success: false,
        error: '标题、内容和分类不能为空'
      } as ApiResponse, { status: 400 })
    }
    
    const article = await createArticle(body, user.username)
    
    return NextResponse.json({
      success: true,
      data: article,
      message: '文章创建成功'
    } as ApiResponse, { status: 201 })
    
  } catch (error) {
    console.error('创建文章错误:', error)
    return NextResponse.json({
      success: false,
      error: '创建文章失败'
    } as ApiResponse, { status: 500 })
  }
} 