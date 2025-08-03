import { NextRequest, NextResponse } from 'next/server'
import { dbOperations } from '@/lib/supabase'

// GET /api/articles/[slug] - 根据 slug 获取单个文章
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const article = await dbOperations.articles.getBySlug(slug)

    if (!article) {
      return NextResponse.json(
        { success: false, error: '文章未找到' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: article
    })

  } catch (error) {
    console.error('❌ 获取文章失败:', error)
    return NextResponse.json(
      { success: false, error: '获取文章失败', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// PUT /api/articles/[slug] - 根据 slug 更新文章
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const body = await request.json()

    // 先获取文章ID
    const existingArticle = await dbOperations.articles.getBySlug(slug)
    if (!existingArticle) {
      return NextResponse.json(
        { success: false, error: '文章未找到' },
        { status: 404 }
      )
    }

    // 验证必需字段
    if (!body.title || !body.content) {
      return NextResponse.json(
        { success: false, error: '标题和内容不能为空' },
        { status: 400 }
      )
    }

    // 准备更新数据
    const updateData: any = {
      title: body.title,
      content: body.content,
      summary: body.summary || generateSummary(body.content),
      category: body.category,
      read_time: calculateReadTime(body.content),
      status: body.status
    }

    // 只有在标题改变时才更新 slug
    if (body.title && body.title !== existingArticle.title) {
      updateData.slug = createSlug(body.title)
    }

    // 处理标签
    if (body.tags !== undefined) {
      updateData.tags = Array.isArray(body.tags) ? body.tags : (body.tags ? body.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean) : [])
    }

    // 处理特色图片
    if (body.featuredImage !== undefined || body.featured_image !== undefined) {
      updateData.featured_image = body.featuredImage || body.featured_image
    }

    const updatedArticle = await dbOperations.articles.update(existingArticle.id, updateData)

    return NextResponse.json({
      success: true,
      data: updatedArticle,
      message: '文章更新成功'
    })

  } catch (error) {
    console.error('❌ 更新文章失败:', error)
    return NextResponse.json(
      { success: false, error: '更新文章失败', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// DELETE /api/articles/[slug] - 根据 slug 删除文章
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    // 先获取文章ID
    const existingArticle = await dbOperations.articles.getBySlug(slug)
    if (!existingArticle) {
      return NextResponse.json(
        { success: false, error: '文章未找到' },
        { status: 404 }
      )
    }

    await dbOperations.articles.delete(existingArticle.id)

    return NextResponse.json({
      success: true,
      message: '文章删除成功'
    })

  } catch (error) {
    console.error('❌ 删除文章失败:', error)
    return NextResponse.json(
      { success: false, error: '删除文章失败', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// 工具函数
function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s\u4e00-\u9fa5-]/g, '') // 保留中文字符
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    || `article-${Date.now()}`
}

function calculateReadTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.split(/\s+/).length
  return Math.ceil(words / wordsPerMinute) || 1
}

function generateSummary(content: string, maxLength: number = 200): string {
  // 移除 Markdown 语法
  const text = content
    .replace(/#+\s/g, '') // 移除标题标记
    .replace(/\*+/g, '') // 移除粗体斜体标记
    .replace(/`+/g, '') // 移除代码标记
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 移除链接，保留文本
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '') // 移除图片
    .trim()
  
  if (text.length <= maxLength) return text
  return text.substr(0, maxLength).replace(/\s+\S*$/, '') + '...'
} 