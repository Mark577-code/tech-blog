import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { getCategoryById, updateCategory, deleteCategory } from '@/lib/categories'
import type { UpdateCategoryData } from '@/types/category'
import type { ApiResponse } from '@/types/article'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const category = await getCategoryById(id)
    
    if (!category) {
      return NextResponse.json({
        success: false,
        error: '分类不存在'
      } as ApiResponse, { status: 404 })
    }
    
    return NextResponse.json({
      success: true,
      data: category
    } as ApiResponse)
    
  } catch (error) {
    console.error('获取分类错误:', error)
    return NextResponse.json({
      success: false,
      error: '获取分类失败'
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
    const body: UpdateCategoryData = await request.json()
    
    // 验证必要字段
    if (!body.name || !body.slug || !body.icon || !body.color) {
      return NextResponse.json({
        success: false,
        error: '名称、标识符、图标和颜色不能为空'
      } as ApiResponse, { status: 400 })
    }
    
    const updatedCategory = await updateCategory({ ...body, id })
    
    if (!updatedCategory) {
      return NextResponse.json({
        success: false,
        error: '分类不存在'
      } as ApiResponse, { status: 404 })
    }
    
    return NextResponse.json({
      success: true,
      data: updatedCategory,
      message: '分类更新成功'
    } as ApiResponse)
    
  } catch (error) {
    console.error('更新分类错误:', error)
    const errorMessage = error instanceof Error ? error.message : '更新分类失败'
    return NextResponse.json({
      success: false,
      error: errorMessage
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
    const success = await deleteCategory(id)
    
    if (!success) {
      return NextResponse.json({
        success: false,
        error: '分类不存在'
      } as ApiResponse, { status: 404 })
    }
    
    return NextResponse.json({
      success: true,
      message: '分类删除成功'
    } as ApiResponse)
    
  } catch (error) {
    console.error('删除分类错误:', error)
    return NextResponse.json({
      success: false,
      error: '删除分类失败'
    } as ApiResponse, { status: 500 })
  }
} 