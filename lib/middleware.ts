import { NextRequest, NextResponse } from 'next/server'
import { validateAdminToken } from '@/lib/auth'

// 管理员认证中间件
export async function requireAdminAuth(request: NextRequest) {
  const token = request.cookies.get('admin-token')?.value

  if (!token) {
    return NextResponse.json(
      { success: false, error: '未登录' },
      { status: 401 }
    )
  }

  const isValid = validateAdminToken(token)

  if (!isValid) {
    return NextResponse.json(
      { success: false, error: '登录已过期，请重新登录' },
      { status: 401 }
    )
  }

  return null // 认证通过
}

// 获取当前管理员信息
export async function getCurrentAdmin(request: NextRequest) {
  const token = request.cookies.get('admin-token')?.value

  if (!token || !validateAdminToken(token)) {
    return null
  }

  return {
    username: 'admin',
    role: 'admin' as const
  }
} 