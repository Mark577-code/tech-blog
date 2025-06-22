import { NextRequest, NextResponse } from 'next/server'

// 模拟分类数据
const mockCategories = [
  {
    id: '1',
    name: '编程技术',
    slug: 'programming',
    description: '编程语言、框架和开发技术相关内容',
    color: '#3b82f6',
    isVisible: true,
    order: 1,
    articleCount: 3,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z'
  },
  {
    id: '2',
    name: '前端开发',
    slug: 'frontend',
    description: '前端技术、框架、工具和最佳实践',
    color: '#10b981',
    isVisible: true,
    order: 2,
    articleCount: 1,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z'
  },
  {
    id: '3',
    name: '摄影分享',
    slug: 'photography',
    description: '摄影技巧、作品分享和后期处理',
    color: '#f59e0b',
    isVisible: true,
    order: 3,
    articleCount: 2,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z'
  },
  {
    id: '4',
    name: '项目展示',
    slug: 'projects',
    description: '个人项目和作品集展示',
    color: '#8b5cf6',
    isVisible: true,
    order: 4,
    articleCount: 1,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z'
  },
  {
    id: '5',
    name: 'tutorial',
    slug: 'tutorial',
    description: '技术教程和学习指南',
    color: '#ef4444',
    isVisible: true,
    order: 5,
    articleCount: 1,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z'
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // 获取查询参数
    const isVisible = searchParams.get('isVisible')
    const sortBy = searchParams.get('sortBy') || 'order'
    const sortOrder = searchParams.get('sortOrder') || 'asc'

    // 过滤分类
    let filteredCategories = mockCategories

    // 按可见性过滤
    if (isVisible !== null) {
      const isVisibleBool = isVisible === 'true'
      filteredCategories = filteredCategories.filter(category => 
        category.isVisible === isVisibleBool
      )
    }

    // 排序
    filteredCategories.sort((a, b) => {
      const aValue = a[sortBy as keyof typeof a] as any
      const bValue = b[sortBy as keyof typeof b] as any
      
      if (sortOrder === 'desc') {
        return aValue > bValue ? -1 : 1
      } else {
        return aValue < bValue ? -1 : 1
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        categories: filteredCategories,
        total: filteredCategories.length
      }
    })

  } catch (error) {
    console.error('获取分类列表失败:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: '获取分类列表失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
} 