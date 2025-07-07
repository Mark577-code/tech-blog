import { NextRequest, NextResponse } from 'next/server'
import { dbOperations, supabaseAdmin } from '@/lib/supabase'

// GET /api/projects - 获取所有项目
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = searchParams.get('limit')
    const offset = searchParams.get('offset')

    let projects = await dbOperations.projects.getAll()

    // 状态过滤
    if (status && status !== 'all') {
      projects = projects.filter(project => project.status === status)
    }

    // 分页
    if (limit) {
      const limitNum = parseInt(limit)
      const offsetNum = parseInt(offset || '0')
      projects = projects.slice(offsetNum, offsetNum + limitNum)
    }

    return NextResponse.json({
      success: true,
      data: projects,
      total: projects.length
    })

  } catch (error) {
    console.error('❌ 获取项目失败:', error)
    return NextResponse.json(
      { success: false, error: '获取项目失败' },
      { status: 500 }
    )
  }
}

// POST /api/projects - 创建新项目
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // 验证必需字段
    if (!body.title || !body.description) {
      return NextResponse.json(
        { success: false, error: '项目标题和描述不能为空' },
        { status: 400 }
      )
    }

    // 生成 slug
    const slug = body.slug || createSlug(body.title)

    // 创建项目数据
    const projectData = {
      title: body.title,
      slug,
      description: body.description,
      content: body.content || '',
      tech_stack: body.techStack || [],
      github_url: body.githubUrl || '',
      demo_url: body.demoUrl || '',
      featured_image: body.featuredImage || '',
      status: body.status || 'completed'
    }

    const { data: newProject, error } = await supabaseAdmin
      .from('projects')
      .insert(projectData)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      data: newProject,
      message: '项目创建成功'
    })

  } catch (error) {
    console.error('❌ 创建项目失败:', error)
    return NextResponse.json(
      { success: false, error: '创建项目失败' },
      { status: 500 }
    )
  }
}

// 工具函数
function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    || `project-${Date.now()}`
} 