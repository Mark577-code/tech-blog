import { NextResponse } from 'next/server'
import { verifyAdminPassword, generateToken, setAuthCookie, getAdminUser } from '@/lib/auth'
import type { LoginCredentials, AuthResponse } from '@/types/article'

export async function POST(request: Request) {
  try {
    const body: LoginCredentials = await request.json()
    
    if (!body.password) {
      return NextResponse.json({
        success: false,
        message: '密码不能为空'
      } as AuthResponse, { status: 400 })
    }

    // 验证管理员密码
    const isValid = await verifyAdminPassword(body.password)
    
    if (!isValid) {
      return NextResponse.json({
        success: false,
        message: '密码错误'
      } as AuthResponse, { status: 401 })
    }

    // 生成token
    const user = getAdminUser()
    const token = generateToken(user)

    // 设置cookie
    await setAuthCookie(token)

    return NextResponse.json({
      success: true,
      user,
      token,
      message: '登录成功'
    } as AuthResponse)

  } catch (error) {
    console.error('登录错误:', error)
    return NextResponse.json({
      success: false,
      message: '服务器错误'
    } as AuthResponse, { status: 500 })
  }
} 