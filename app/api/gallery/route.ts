import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { getAllGalleryImages, createGalleryImage } from '@/lib/gallery'
import type { CreateGalleryImageData, GalleryFilters } from '@/types/gallery'
import type { ApiResponse } from '@/types/article'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    const filters: GalleryFilters = {
      category: searchParams.get('category') || '',
      search: searchParams.get('search') || '',
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10'),
      sortBy: (searchParams.get('sortBy') as any) || 'createdAt',
      sortOrder: (searchParams.get('sortOrder') as any) || 'desc'
    }
    
    // 处理featured参数
    const featuredParam = searchParams.get('featured')
    if (featuredParam === 'true') {
      filters.featured = true
    } else if (featuredParam === 'false') {
      filters.featured = false
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
    
    const result = await getAllGalleryImages(filters)
    
    return NextResponse.json({
      success: true,
      data: result
    } as ApiResponse)
    
  } catch (error) {
    console.error('获取图片列表错误:', error)
    return NextResponse.json({
      success: false,
      error: '获取图片列表失败'
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
    
    const body: CreateGalleryImageData = await request.json()
    
    // 验证必要字段
    if (!body.title || !body.url || !body.category) {
      return NextResponse.json({
        success: false,
        error: '标题、图片URL和分类不能为空'
      } as ApiResponse, { status: 400 })
    }
    
    const image = await createGalleryImage(body, user.username)
    
    return NextResponse.json({
      success: true,
      data: image,
      message: '图片创建成功'
    } as ApiResponse, { status: 201 })
    
  } catch (error) {
    console.error('创建图片错误:', error)
    return NextResponse.json({
      success: false,
      error: '创建图片失败'
    } as ApiResponse, { status: 500 })
  }
} 