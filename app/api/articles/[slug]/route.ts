import { NextRequest, NextResponse } from 'next/server'
import { dbOperations } from '@/lib/supabase'

// GET /api/articles/[slug] - 获取单篇文章
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    if (!slug) {
      return NextResponse.json(
        { success: false, error: '文章 slug 不能为空' },
        { status: 400 }
      )
    }

    const article = await dbOperations.articles.getBySlug(slug)

    if (!article) {
      return NextResponse.json(
        { success: false, error: '文章不存在' },
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
      { success: false, error: '获取文章失败' },
      { status: 500 }
    )
  }
}

// PUT /api/articles/[slug] - 更新文章
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    const body = await request.json()

    if (!slug) {
      return NextResponse.json(
        { success: false, error: '文章 slug 不能为空' },
        { status: 400 }
      )
    }

    // 首先获取现有文章
    const existingArticle = await dbOperations.articles.getBySlug(slug)
    if (!existingArticle) {
      return NextResponse.json(
        { success: false, error: '文章不存在' },
        { status: 404 }
      )
    }

    // 准备更新数据
    const updateData: any = {}
    
    if (body.title) updateData.title = body.title
    if (body.content) updateData.content = body.content
    if (body.summary) updateData.summary = body.summary
    if (body.category) updateData.category = body.category
    if (body.tags) updateData.tags = body.tags
    if (body.featured_image) updateData.featured_image = body.featured_image
    if (body.status) updateData.status = body.status
    if (body.seo_title) updateData.seo_title = body.seo_title
    if (body.seo_description) updateData.seo_description = body.seo_description

    // 如果更新内容，重新计算阅读时间
    if (body.content) {
      updateData.read_time = calculateReadTime(body.content)
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
      { success: false, error: '更新文章失败' },
      { status: 500 }
    )
  }
}

// DELETE /api/articles/[slug] - 删除文章
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    if (!slug) {
      return NextResponse.json(
        { success: false, error: '文章 slug 不能为空' },
        { status: 400 }
      )
    }

    // 首先获取文章确认存在
    const existingArticle = await dbOperations.articles.getBySlug(slug)
    if (!existingArticle) {
      return NextResponse.json(
        { success: false, error: '文章不存在' },
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
      { success: false, error: '删除文章失败' },
      { status: 500 }
    )
  }
}

// 工具函数
function calculateReadTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
} 