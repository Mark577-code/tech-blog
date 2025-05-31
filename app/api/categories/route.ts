import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { getCategories, createCategory } from '@/lib/categories'
import type { CreateCategoryData, CategoryFilter } from '@/types/category'
import type { ApiResponse } from '@/types/article'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const isVisible = url.searchParams.get('isVisible')
    const limit = url.searchParams.get('limit')
    const sortBy = url.searchParams.get('sortBy') as 'order' | 'name' | 'createdAt' | 'updatedAt'
    const sortOrder = url.searchParams.get('sortOrder') as 'asc' | 'desc'

    const filter: CategoryFilter = {}
    if (isVisible !== null) {
      filter.isVisible = isVisible === 'true'
    }
    if (limit) {
      filter.limit = parseInt(limit)
    }
    if (sortBy) {
      filter.sortBy = sortBy
    }
    if (sortOrder) {
      filter.sortOrder = sortOrder
    }

    const result = await getCategories(filter)
    
    return NextResponse.json({
      success: true,
      data: result
    } as ApiResponse)
    
  } catch (error) {
    console.error('获取分类错误:', error)
    return NextResponse.json({
      success: false,
      error: '获取分类失败'
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

    const body: CreateCategoryData = await request.json()
    
    // 验证必要字段
    if (!body.name || !body.slug || !body.icon || !body.color) {
      return NextResponse.json({
        success: false,
        error: '名称、标识符、图标和颜色不能为空'
      } as ApiResponse, { status: 400 })
    }
    
    const newCategory = await createCategory(body)
    
    return NextResponse.json({
      success: true,
      data: newCategory,
      message: '分类创建成功'
    } as ApiResponse, { status: 201 })
    
  } catch (error) {
    console.error('创建分类错误:', error)
    const errorMessage = error instanceof Error ? error.message : '创建分类失败'
    return NextResponse.json({
      success: false,
      error: errorMessage
    } as ApiResponse, { status: 500 })
  }
} 