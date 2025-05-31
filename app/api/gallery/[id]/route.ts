import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { getGalleryImageById, updateGalleryImage, deleteGalleryImage } from '@/lib/gallery'
import type { UpdateGalleryImageData } from '@/types/gallery'
import type { ApiResponse } from '@/types/article'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const image = await getGalleryImageById(id)
    
    if (!image) {
      return NextResponse.json({
        success: false,
        error: '图片不存在'
      } as ApiResponse, { status: 404 })
    }
    
    return NextResponse.json({
      success: true,
      data: image
    } as ApiResponse)
    
  } catch (error) {
    console.error('获取图片错误:', error)
    return NextResponse.json({
      success: false,
      error: '获取图片失败'
    } as ApiResponse, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 验证管理员权限
    const user = await requireAdmin()
    if (!user) {
      return NextResponse.json({
        success: false,
        error: '需要管理员权限'
      } as ApiResponse, { status: 401 })
    }

    const { id } = await params
    const body: UpdateGalleryImageData = await request.json()
    
    // 验证必要字段
    if (!body.title || !body.url || !body.category) {
      return NextResponse.json({
        success: false,
        error: '标题、图片URL和分类不能为空'
      } as ApiResponse, { status: 400 })
    }
    
    const updatedImage = await updateGalleryImage({ ...body, id })
    
    if (!updatedImage) {
      return NextResponse.json({
        success: false,
        error: '图片不存在'
      } as ApiResponse, { status: 404 })
    }
    
    return NextResponse.json({
      success: true,
      data: updatedImage,
      message: '图片更新成功'
    } as ApiResponse)
    
  } catch (error) {
    console.error('更新图片错误:', error)
    return NextResponse.json({
      success: false,
      error: '更新图片失败'
    } as ApiResponse, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 验证管理员权限
    const user = await requireAdmin()
    if (!user) {
      return NextResponse.json({
        success: false,
        error: '需要管理员权限'
      } as ApiResponse, { status: 401 })
    }

    const { id } = await params
    const success = await deleteGalleryImage(id)
    
    if (!success) {
      return NextResponse.json({
        success: false,
        error: '图片不存在'
      } as ApiResponse, { status: 404 })
    }
    
    return NextResponse.json({
      success: true,
      message: '图片删除成功'
    } as ApiResponse)
    
  } catch (error) {
    console.error('删除图片错误:', error)
    return NextResponse.json({
      success: false,
      error: '删除图片失败'
    } as ApiResponse, { status: 500 })
  }
} 