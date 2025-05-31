import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { getArticleById, updateArticle, deleteArticle } from '@/lib/articles'
import type { UpdateArticleData, ApiResponse } from '@/types/article'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const article = await getArticleById(params.id)
    
    if (!article) {
      return NextResponse.json({
        success: false,
        error: '文章不存在'
      } as ApiResponse, { status: 404 })
    }
    
    return NextResponse.json({
      success: true,
      data: article
    } as ApiResponse)
    
  } catch (error) {
    console.error('获取文章错误:', error)
    return NextResponse.json({
      success: false,
      error: '获取文章失败'
    } as ApiResponse, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
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
    
    const body: UpdateArticleData = await request.json()
    
    // 确保ID匹配
    if (body.id !== params.id) {
      return NextResponse.json({
        success: false,
        error: 'ID不匹配'
      } as ApiResponse, { status: 400 })
    }
    
    const article = await updateArticle(body)
    
    if (!article) {
      return NextResponse.json({
        success: false,
        error: '文章不存在'
      } as ApiResponse, { status: 404 })
    }
    
    return NextResponse.json({
      success: true,
      data: article,
      message: '文章更新成功'
    } as ApiResponse)
    
  } catch (error) {
    console.error('更新文章错误:', error)
    return NextResponse.json({
      success: false,
      error: '更新文章失败'
    } as ApiResponse, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
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
    
    const success = await deleteArticle(params.id)
    
    if (!success) {
      return NextResponse.json({
        success: false,
        error: '文章不存在'
      } as ApiResponse, { status: 404 })
    }
    
    return NextResponse.json({
      success: true,
      message: '文章删除成功'
    } as ApiResponse)
    
  } catch (error) {
    console.error('删除文章错误:', error)
    return NextResponse.json({
      success: false,
      error: '删除文章失败'
    } as ApiResponse, { status: 500 })
  }
} 