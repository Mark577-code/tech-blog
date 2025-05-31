import { NextResponse } from 'next/server'
import { clearAuthCookie } from '@/lib/auth'
import type { AuthResponse } from '@/types/article'

export async function POST() {
  try {
    await clearAuthCookie()
    
    return NextResponse.json({
      success: true,
      message: '已成功退出登录'
    } as AuthResponse)
    
  } catch (error) {
    console.error('登出错误:', error)
    return NextResponse.json({
      success: false,
      message: '服务器错误'
    } as AuthResponse, { status: 500 })
  }
} 