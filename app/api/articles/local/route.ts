import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  try {
    // 读取本地JSON文件中的文章
    const filePath = path.join(process.cwd(), 'data', 'articles.json')
    
    let articles = []
    
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      articles = JSON.parse(fileContent)
    }

    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    // 过滤文章
    let filteredArticles = articles

    if (category) {
      filteredArticles = filteredArticles.filter((article: any) => 
        article.category === category
      )
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filteredArticles = filteredArticles.filter((article: any) =>
        article.title.toLowerCase().includes(searchLower) ||
        article.content.toLowerCase().includes(searchLower) ||
        article.summary.toLowerCase().includes(searchLower)
      )
    }

    // 排序（按创建时间倒序）
    filteredArticles.sort((a: any, b: any) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

    // 分页
    const paginatedArticles = filteredArticles.slice(offset, offset + limit)

    return NextResponse.json({
      success: true,
      data: paginatedArticles,
      total: filteredArticles.length,
      pagination: {
        limit,
        offset,
        total: filteredArticles.length,
        totalPages: Math.ceil(filteredArticles.length / limit)
      }
    })

  } catch (error) {
    console.error('获取本地文章失败:', error)
    return NextResponse.json({
      success: false,
      error: '获取文章失败',
      data: []
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const newArticle = await request.json()
    
    // 读取现有文章
    const filePath = path.join(process.cwd(), 'data', 'articles.json')
    let articles = []
    
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      articles = JSON.parse(fileContent)
    }

    // 添加新文章
    articles.unshift(newArticle)

    // 写回文件
    fs.writeFileSync(filePath, JSON.stringify(articles, null, 2))

    return NextResponse.json({
      success: true,
      data: newArticle,
      message: '文章创建成功'
    })

  } catch (error) {
    console.error('创建文章失败:', error)
    return NextResponse.json({
      success: false,
      error: '创建文章失败'
    }, { status: 500 })
  }
} 