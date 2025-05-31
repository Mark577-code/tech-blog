import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import type { AuthResponse } from '@/types/article'

export async function GET() {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({
        success: false,
        message: '未授权访问'
      } as AuthResponse, { status: 401 })
    }
    
    return NextResponse.json({
      success: true,
      user,
      message: '获取用户信息成功'
    } as AuthResponse)
    
  } catch (error) {
    console.error('获取用户信息错误:', error)
    return NextResponse.json({
      success: false,
      message: '服务器错误'
    } as AuthResponse, { status: 500 })
  }
} 