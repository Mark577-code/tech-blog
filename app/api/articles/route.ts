import { NextRequest, NextResponse } from 'next/server'
import { dbOperations, supabaseAdmin } from '@/lib/supabase'
import { handleApiError, validateArticleData } from '@/lib/error-handler'
import { generateUniqueSlug, calculateReadTime, generateSummary } from '@/lib/articles'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')
    const category = searchParams.get('category')

    console.log('✅ API调用参数:', { status, sortBy, sortOrder, limit, offset, category })

    let query = supabaseAdmin
      .from('articles')
      .select('*')

    // 状态筛选
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    // 分类筛选
    if (category) {
      query = query.eq('category', category)
    }

    // 排序
    query = query.order(sortBy, { ascending: sortOrder === 'asc' })

    // 分页
    if (limit > 0) {
      query = query.range(offset, offset + limit - 1)
    }

    const { data, error } = await query

    if (error) {
      console.error('❌ 获取文章失败:', error)
      throw error
    }

    console.log('✅ 成功获取文章:', data?.length || 0, '篇')

    return NextResponse.json({
      success: true,
      data: data || [],
      total: data?.length || 0
    })

  } catch (error) {
    console.error('❌ 获取文章列表失败:', error)
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('📝 创建文章请求:', body)

    // 验证数据
    const validation = validateArticleData(body)
    if (!validation.isValid) {
      return NextResponse.json({
        success: false,
        error: `数据验证失败: ${validation.errors.join(', ')}`
      }, { status: 400 })
    }

    const { title, content, summary, category, tags, status, featured_image } = body

    // 生成唯一slug
    const slug = await generateUniqueSlug(title, supabaseAdmin)
    console.log('🔗 生成的slug:', slug)

    // 计算阅读时间
    const readTime = Math.max(1, calculateReadTime(content))

    // 生成摘要（如果未提供）
    const finalSummary = summary || generateSummary(content)

    // 创建文章数据
    const articleData = {
      title: title.trim(),
      slug,
      content,
      summary: finalSummary,
      category,
      tags: Array.isArray(tags) ? tags : [],
      status: status || 'draft',
      author: 'admin',
      featured_image: featured_image || null,
      read_time: readTime,
      published_at: status === 'published' ? new Date().toISOString() : null
    }

    console.log('💾 准备插入的文章数据:', articleData)

    // 插入到数据库
    const { data, error } = await supabaseAdmin
      .from('articles')
      .insert([articleData])
      .select()
      .single()

    if (error) {
      console.error('❌ 创建文章失败:', error)
      
      // 特殊处理常见错误
      if (error.code === '23505') {
        return NextResponse.json({
          success: false,
          error: 'slug已存在，请修改文章标题或稍后重试'
        }, { status: 409 })
      }
      
      throw error
    }

    console.log('✅ 文章创建成功:', data)

    return NextResponse.json({
      success: true,
      data,
      message: '文章创建成功'
    })

  } catch (error) {
    console.error('❌ 创建文章失败:', error)
    return handleApiError(error)
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('🔄 更新文章请求:', body)

    const { id, title, content, summary, category, tags, status, featured_image } = body

    if (!id) {
      return NextResponse.json({
        success: false,
        error: '缺少文章ID'
      }, { status: 400 })
    }

    // 验证数据
    const validation = validateArticleData(body)
    if (!validation.isValid) {
      return NextResponse.json({
        success: false,
        error: `数据验证失败: ${validation.errors.join(', ')}`
      }, { status: 400 })
    }

    // 获取原文章数据
    const { data: originalArticle, error: fetchError } = await supabaseAdmin
      .from('articles')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError) {
      console.error('❌ 获取原文章失败:', fetchError)
      return NextResponse.json({
        success: false,
        error: '文章不存在'
      }, { status: 404 })
    }

    // 生成新的slug（如果标题改变了）
    let slug = originalArticle.slug
    if (title && title.trim() !== originalArticle.title) {
      slug = await generateUniqueSlug(title, supabaseAdmin, id)
      console.log('🔗 更新的slug:', slug)
    }

    // 重新计算阅读时间（如果内容改变了）
    let readTime = originalArticle.read_time
    if (content && content !== originalArticle.content) {
      readTime = Math.max(1, calculateReadTime(content))
    }

    // 更新摘要（如果提供了新的或内容改变了）
    let finalSummary = summary
    if (!summary && content && content !== originalArticle.content) {
      finalSummary = generateSummary(content)
    } else if (!summary) {
      finalSummary = originalArticle.summary
    }

    // 准备更新数据
    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    if (title !== undefined) updateData.title = title.trim()
    if (slug !== originalArticle.slug) updateData.slug = slug
    if (content !== undefined) updateData.content = content
    if (finalSummary !== undefined) updateData.summary = finalSummary
    if (category !== undefined) updateData.category = category
    if (tags !== undefined) updateData.tags = Array.isArray(tags) ? tags : []
    if (status !== undefined) {
      updateData.status = status
      // 如果状态改为published且之前没有发布时间，设置发布时间
      if (status === 'published' && !originalArticle.published_at) {
        updateData.published_at = new Date().toISOString()
      }
    }
    if (featured_image !== undefined) updateData.featured_image = featured_image || null
    if (readTime !== originalArticle.read_time) updateData.read_time = readTime

    console.log('💾 准备更新的数据:', updateData)

    // 更新文章
    const { data, error } = await supabaseAdmin
      .from('articles')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('❌ 更新文章失败:', error)
      
      // 特殊处理常见错误
      if (error.code === '23505') {
        return NextResponse.json({
          success: false,
          error: 'slug已存在，请修改文章标题'
        }, { status: 409 })
      }
      
      throw error
    }

    console.log('✅ 文章更新成功:', data)

    return NextResponse.json({
      success: true,
      data,
      message: '文章更新成功'
    })

  } catch (error) {
    console.error('❌ 更新文章失败:', error)
    return handleApiError(error)
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({
        success: false,
        error: '缺少文章ID'
      }, { status: 400 })
    }

    console.log('🗑️ 删除文章:', id)

    const { error } = await supabaseAdmin
      .from('articles')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('❌ 删除文章失败:', error)
      throw error
    }

    console.log('✅ 文章删除成功')

    return NextResponse.json({
      success: true,
      message: '文章删除成功'
    })

  } catch (error) {
    console.error('❌ 删除文章失败:', error)
    return handleApiError(error)
  }
} 