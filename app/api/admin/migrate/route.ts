import { NextRequest, NextResponse } from 'next/server'
import { migrateData, verifyMigration } from '@/scripts/migrate-data'

// POST /api/admin/migrate - 执行数据迁移
export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()

    if (action === 'migrate') {
      console.log('🚀 开始执行数据迁移...')
      await migrateData()
      
      return NextResponse.json({
        success: true,
        message: '数据迁移完成！',
        timestamp: new Date().toISOString()
      })

    } else if (action === 'verify') {
      console.log('🔍 开始验证数据完整性...')
      await verifyMigration()
      
      return NextResponse.json({
        success: true,
        message: '数据完整性验证完成！',
        timestamp: new Date().toISOString()
      })

    } else {
      return NextResponse.json(
        { success: false, error: '无效的操作类型' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('❌ 数据迁移失败:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: '数据迁移失败',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}

// GET /api/admin/migrate - 获取迁移状态
export async function GET() {
  try {
    const { supabaseAdmin } = await import('@/lib/supabase')
    
    // 检查各表的数据量
    const [categoriesResult, tagsResult, articlesResult, projectsResult, galleryResult] = await Promise.all([
      supabaseAdmin.from('categories').select('count', { count: 'exact' }),
      supabaseAdmin.from('tags').select('count', { count: 'exact' }),
      supabaseAdmin.from('articles').select('count', { count: 'exact' }),
      supabaseAdmin.from('projects').select('count', { count: 'exact' }),
      supabaseAdmin.from('gallery_images').select('count', { count: 'exact' })
    ])

    const stats = {
      categories: categoriesResult.count || 0,
      tags: tagsResult.count || 0,
      articles: articlesResult.count || 0,
      projects: projectsResult.count || 0,
      gallery: galleryResult.count || 0
    }

    const hasData = Object.values(stats).some(count => count > 0)

    return NextResponse.json({
      success: true,
      data: {
        stats,
        hasData,
        status: hasData ? 'migrated' : 'empty'
      }
    })

  } catch (error) {
    console.error('❌ 获取迁移状态失败:', error)
    return NextResponse.json(
      { success: false, error: '获取迁移状态失败' },
      { status: 500 }
    )
  }
} 