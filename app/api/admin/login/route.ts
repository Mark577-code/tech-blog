import { NextRequest, NextResponse } from 'next/server'
import { validateAdminCredentials, generateAdminToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: '用户名和密码不能为空' },
        { status: 400 }
      )
    }

    // 在服务端验证管理员凭据
    const isValid = validateAdminCredentials(username, password)

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: '用户名或密码错误' },
        { status: 401 }
      )
    }

    // 生成token
    const token = generateAdminToken()

    // 设置 HttpOnly cookie - 更安全
    const response = NextResponse.json({
      success: true,
      message: '登录成功',
      user: {
        username,
        role: 'admin'
      }
    })

    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60, // 24小时
      path: '/',
      sameSite: 'lax'
    })

    return response

  } catch (error) {
    console.error('❌ 管理员登录失败:', error)
    return NextResponse.json(
      { success: false, error: '登录过程中发生错误' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // 清除登录 cookie
    const response = NextResponse.json({
      success: true,
      message: '已退出登录'
    })

    response.cookies.delete('admin-token')

    return response

  } catch (error) {
    console.error('❌ 退出登录失败:', error)
    return NextResponse.json(
      { success: false, error: '退出登录失败' },
      { status: 500 }
    )
  }
} 