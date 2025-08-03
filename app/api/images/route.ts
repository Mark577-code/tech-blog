import { NextRequest, NextResponse } from 'next/server'
import { dbOperations } from '@/lib/supabase'
import { handleApiError, validateImageData } from '@/lib/error-handler'

// GET /api/images - 获取图片列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const usageType = searchParams.get('usage_type')
    const limit = searchParams.get('limit')

    let images = await dbOperations.images.getAll(category || undefined, usageType || undefined)

    // 应用分页
    if (limit) {
      const limitNum = parseInt(limit)
      images = images.slice(0, limitNum)
    }

    return NextResponse.json({
      success: true,
      data: images,
      total: images.length
    })

  } catch (error) {
    const errorInfo = handleApiError(error)
    return NextResponse.json(
      { success: false, error: errorInfo.message },
      { status: errorInfo.status }
    )
  }
}

// POST /api/images - 上传新图片记录
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // 验证必需字段
    const validation = validateImageData(body)
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.errors.join(', ') },
        { status: 400 }
      )
    }

    const imageData = {
      filename: body.filename,
      original_name: body.original_name,
      file_path: body.file_path,
      file_url: body.file_url,
      file_size: body.file_size,
      width: body.width,
      height: body.height,
      mime_type: body.mime_type,
      alt_text: body.alt_text,
      title: body.title,
      description: body.description,
      tags: body.tags || [],
      category: body.category || 'general',
      usage_type: body.usage_type || 'general',
      is_public: body.is_public ?? true,
      uploaded_by: body.uploaded_by || 'admin'
    }

    const newImage = await dbOperations.images.create(imageData)

    return NextResponse.json({
      success: true,
      data: newImage,
      message: '图片记录创建成功'
    })

  } catch (error) {
    const errorInfo = handleApiError(error)
    return NextResponse.json(
      { success: false, error: errorInfo.message },
      { status: errorInfo.status }
    )
  }
}

// PUT /api/images - 更新图片信息
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    if (!body.id) {
      return NextResponse.json(
        { success: false, error: '图片ID不能为空' },
        { status: 400 }
      )
    }

    const updateData: any = {}
    
    // 只更新提供的字段
    if (body.alt_text !== undefined) updateData.alt_text = body.alt_text
    if (body.title !== undefined) updateData.title = body.title
    if (body.description !== undefined) updateData.description = body.description
    if (body.tags !== undefined) updateData.tags = body.tags
    if (body.category !== undefined) updateData.category = body.category
    if (body.usage_type !== undefined) updateData.usage_type = body.usage_type
    if (body.is_public !== undefined) updateData.is_public = body.is_public

    const updatedImage = await dbOperations.images.update(body.id, updateData)

    return NextResponse.json({
      success: true,
      data: updatedImage,
      message: '图片信息更新成功'
    })

  } catch (error) {
    const errorInfo = handleApiError(error)
    return NextResponse.json(
      { success: false, error: errorInfo.message },
      { status: errorInfo.status }
    )
  }
}

// DELETE /api/images - 删除图片记录
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: '图片ID不能为空' },
        { status: 400 }
      )
    }

    await dbOperations.images.delete(id)

    return NextResponse.json({
      success: true,
      message: '图片记录删除成功'
    })

  } catch (error) {
    const errorInfo = handleApiError(error)
    return NextResponse.json(
      { success: false, error: errorInfo.message },
      { status: errorInfo.status }
    )
  }
} 