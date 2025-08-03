import { NextRequest, NextResponse } from 'next/server'
import { validateAdminToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin-token')?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: '未登录' },
        { status: 401 }
      )
    }

    // 验证token
    const isValid = validateAdminToken(token)

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: '登录已过期' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        username: 'admin',
        role: 'admin'
      }
    })

  } catch (error) {
    console.error('❌ 获取管理员信息失败:', error)
    return NextResponse.json(
      { success: false, error: '获取用户信息失败' },
      { status: 500 }
    )
  }
} 