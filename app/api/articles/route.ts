import { NextRequest, NextResponse } from 'next/server'
import { dbOperations } from '@/lib/supabase'
import fs from 'fs'
import path from 'path'

// GET /api/articles - 获取所有文章
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const tag = searchParams.get('tag')
    const search = searchParams.get('search')
    const limit = searchParams.get('limit')
    const offset = searchParams.get('offset')

    let articles
    let source = 'database'

    try {
      // 尝试使用数据库
      if (category) {
        articles = await dbOperations.articles.getByCategory(category)
      } else {
        articles = await dbOperations.articles.getAll()
      }
      console.log('✅ 成功从数据库获取文章')
    } catch (dbError) {
      console.log('⚠️ 数据库连接失败，使用本地文件:', dbError)
      source = 'local'
      
      // 回退到本地JSON文件
      const filePath = path.join(process.cwd(), 'data', 'articles.json')
      
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf-8')
        articles = JSON.parse(fileContent)
        
        // 转换数据格式以匹配数据库字段
        articles = articles.map((article: any) => ({
          ...article,
          summary: article.excerpt || article.summary,
          published_at: article.createdAt,
          read_time: article.readingTime,
          featured_image: article.featuredImage
        }))
      } else {
        articles = []
      }
    }

    // 前端搜索过滤
    if (search) {
      const searchLower = search.toLowerCase()
      articles = articles.filter((article: any) => 
        article.title.toLowerCase().includes(searchLower) ||
        (article.summary && article.summary.toLowerCase().includes(searchLower)) ||
        (article.content && article.content.toLowerCase().includes(searchLower)) ||
        (article.tags && article.tags.some((tagItem: string) => tagItem.toLowerCase().includes(searchLower)))
      )
    }

    // 分类过滤
    if (category) {
      articles = articles.filter((article: any) => article.category === category)
    }

    // 标签过滤
    if (tag) {
      articles = articles.filter((article: any) => 
        article.tags && article.tags.includes(tag)
      )
    }

    // 排序（按创建时间倒序）
    articles.sort((a: any, b: any) => {
      const dateA = new Date(a.published_at || a.createdAt || a.updatedAt).getTime()
      const dateB = new Date(b.published_at || b.createdAt || b.updatedAt).getTime()
      return dateB - dateA
    })

    // 分页
    const totalArticles = articles.length
    if (limit) {
      const limitNum = parseInt(limit)
      const offsetNum = parseInt(offset || '0')
      articles = articles.slice(offsetNum, offsetNum + limitNum)
    }

    return NextResponse.json({
      success: true,
      data: articles,
      total: totalArticles,
      source
    })

  } catch (error) {
    console.error('❌ 获取文章失败:', error)
    return NextResponse.json(
      { success: false, error: '获取文章失败' },
      { status: 500 }
    )
  }
}

// POST /api/articles - 创建新文章
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // 验证必需字段
    if (!body.title || !body.content) {
      return NextResponse.json(
        { success: false, error: '标题和内容不能为空' },
        { status: 400 }
      )
    }

    // 生成 slug
    const slug = body.slug || createSlug(body.title)

    // 创建文章数据
    const articleData = {
      title: body.title,
      slug,
      content: body.content,
      summary: body.summary || body.content.substring(0, 200) + '...',
      category: body.category || 'programming',
      tags: body.tags || [],
      author: body.author || 'Mark-李',
      published_at: new Date().toISOString(),
      featured_image: body.featuredImage,
      read_time: calculateReadTime(body.content),
      status: body.status || 'published',
      seo_title: body.seoTitle || body.title,
      seo_description: body.seoDescription || body.summary
    }

    const newArticle = await dbOperations.articles.create(articleData)

    return NextResponse.json({
      success: true,
      data: newArticle,
      message: '文章创建成功'
    })

  } catch (error) {
    console.error('❌ 创建文章失败:', error)
    return NextResponse.json(
      { success: false, error: '创建文章失败' },
      { status: 500 }
    )
  }
}

// 工具函数
function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    || `article-${Date.now()}`
}

function calculateReadTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
} 