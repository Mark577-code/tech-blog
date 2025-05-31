import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { getProjectById, updateProject, deleteProject } from '@/lib/projects'
import type { UpdateProjectData } from '@/types/project'
import type { ApiResponse } from '@/types/article'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const project = await getProjectById(id)
    
    if (!project) {
      return NextResponse.json({
        success: false,
        error: '项目不存在'
      } as ApiResponse, { status: 404 })
    }
    
    return NextResponse.json({
      success: true,
      data: project
    } as ApiResponse)
    
  } catch (error) {
    console.error('获取项目错误:', error)
    return NextResponse.json({
      success: false,
      error: '获取项目失败'
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
    const body: UpdateProjectData = await request.json()
    
    // 验证必要字段
    if (!body.title || !body.description || !body.content || !body.category) {
      return NextResponse.json({
        success: false,
        error: '标题、描述、内容和分类不能为空'
      } as ApiResponse, { status: 400 })
    }
    
    const updatedProject = await updateProject({ ...body, id })
    
    if (!updatedProject) {
      return NextResponse.json({
        success: false,
        error: '项目不存在'
      } as ApiResponse, { status: 404 })
    }
    
    return NextResponse.json({
      success: true,
      data: updatedProject,
      message: '项目更新成功'
    } as ApiResponse)
    
  } catch (error) {
    console.error('更新项目错误:', error)
    return NextResponse.json({
      success: false,
      error: '更新项目失败'
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
    const success = await deleteProject(id)
    
    if (!success) {
      return NextResponse.json({
        success: false,
        error: '项目不存在'
      } as ApiResponse, { status: 404 })
    }
    
    return NextResponse.json({
      success: true,
      message: '项目删除成功'
    } as ApiResponse)
    
  } catch (error) {
    console.error('删除项目错误:', error)
    return NextResponse.json({
      success: false,
      error: '删除项目失败'
    } as ApiResponse, { status: 500 })
  }
} 