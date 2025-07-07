import { NextRequest, NextResponse } from 'next/server'
import { dbOperations, supabaseAdmin } from '@/lib/supabase'
import fs from 'fs'
import path from 'path'

// GET /api/categories - 获取所有分类
export async function GET(request: NextRequest) {
  try {
    let categories
    let source = 'database'

    try {
      // 尝试使用数据库
      categories = await dbOperations.categories.getAll()
      console.log('✅ 成功从数据库获取分类')

      // 为每个分类添加文章数统计
      const categoriesWithStats = await Promise.all(
        categories.map(async (category) => {
          const articles = await dbOperations.articles.getByCategory(category.slug)
          return {
            ...category,
            articleCount: articles.length
          }
        })
      )

      return NextResponse.json({
        success: true,
        data: categoriesWithStats,
        source
      })

    } catch (dbError) {
      console.log('⚠️ 数据库连接失败，使用本地默认分类:', dbError)
      source = 'local'
      
      // 回退到默认分类
      const filePath = path.join(process.cwd(), 'data', 'categories.json')
      
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf-8')
        categories = JSON.parse(fileContent)
      } else {
        // 提供默认分类
        categories = [
          {
            id: 'programming',
            name: '编程技术',
            slug: 'programming',
            description: '前端、后端、编程语言等技术分享',
            color: '#3b82f6',
            icon: 'code'
          },
          {
            id: 'photography',
            name: '摄影分享',
            slug: 'photography',
            description: '摄影作品、技巧和心得分享',
            color: '#ef4444',
            icon: 'camera'
          },
          {
            id: 'tutorial',
            name: '文字教程',
            slug: 'tutorial',
            description: '详细的教程和指南',
            color: '#10b981',
            icon: 'book'
          },
          {
            id: 'project',
            name: '项目展示',
            slug: 'project',
            description: '个人项目和作品展示',
            color: '#f59e0b',
            icon: 'folder'
          }
        ]
      }

      // 简单的文章数统计（本地模式）
      const articlesPath = path.join(process.cwd(), 'data', 'articles.json')
      let articles = []
      
      if (fs.existsSync(articlesPath)) {
        const articlesContent = fs.readFileSync(articlesPath, 'utf-8')
        articles = JSON.parse(articlesContent)
      }

      const categoriesWithStats = categories.map((category: any) => ({
        ...category,
        articleCount: articles.filter((article: any) => article.category === category.slug).length
      }))

      return NextResponse.json({
        success: true,
        data: categoriesWithStats,
        source
      })
    }

  } catch (error) {
    console.error('❌ 获取分类失败:', error)
    return NextResponse.json(
      { success: false, error: '获取分类失败' },
      { status: 500 }
    )
  }
}

// POST /api/categories - 创建新分类
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // 验证必需字段
    if (!body.name) {
      return NextResponse.json(
        { success: false, error: '分类名称不能为空' },
        { status: 400 }
      )
    }

    // 生成 slug
    const slug = body.slug || createSlug(body.name)

    // 创建分类数据
    const categoryData = {
      name: body.name,
      slug,
      description: body.description || '',
      color: body.color || '#3b82f6',
      icon: body.icon || 'Folder'
    }

    const newCategory = await supabaseAdmin
      .from('categories')
      .insert(categoryData)
      .select()
      .single()

    if (newCategory.error) {
      throw newCategory.error
    }

    return NextResponse.json({
      success: true,
      data: newCategory.data,
      message: '分类创建成功'
    })

  } catch (error) {
    console.error('❌ 创建分类失败:', error)
    return NextResponse.json(
      { success: false, error: '创建分类失败' },
      { status: 500 }
    )
  }
}

// 工具函数
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    || `category-${Date.now()}`
} 