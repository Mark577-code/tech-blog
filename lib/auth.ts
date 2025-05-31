import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import type { User } from '@/types/article'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

// 预定义的管理员用户
const ADMIN_USER: User = {
  id: 'admin-001',
  username: 'admin',
  email: process.env.NEXT_PUBLIC_EMAIL || 'admin@example.com',
  role: 'admin',
  createdAt: new Date().toISOString()
}

/**
 * 生成JWT token
 */
export function generateToken(user: User): string {
  return jwt.sign(
    { 
      id: user.id, 
      username: user.username, 
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

/**
 * 验证JWT token
 */
export function verifyToken(token: string): User | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    if (!decoded || !decoded.id || !decoded.username || !decoded.role) {
      return null
    }
    
    return {
      id: decoded.id,
      username: decoded.username,
      email: ADMIN_USER.email,
      role: decoded.role,
      createdAt: ADMIN_USER.createdAt
    }
  } catch (error) {
    console.error('JWT验证失败:', error)
    return null
  }
}

/**
 * 验证管理员密码
 */
export async function verifyAdminPassword(password: string): Promise<boolean> {
  try {
    // 如果环境变量中的密码已经是哈希值，直接比较
    if (ADMIN_PASSWORD.startsWith('$2b$') || ADMIN_PASSWORD.startsWith('$2a$')) {
      return await bcrypt.compare(password, ADMIN_PASSWORD)
    }
    // 否则直接比较明文密码（仅用于开发环境）
    return password === ADMIN_PASSWORD
  } catch (error) {
    console.error('密码验证失败:', error)
    return false
  }
}

/**
 * 生成密码哈希（用于生产环境）
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

/**
 * 从请求中获取当前用户
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')
    
    if (!token?.value) {
      return null
    }
    
    return verifyToken(token.value)
  } catch (error) {
    console.error('获取当前用户失败:', error)
    return null
  }
}

/**
 * 检查用户是否为管理员
 */
export function isAdmin(user: User | null): boolean {
  return user?.role === 'admin'
}

/**
 * 设置认证cookie
 */
export async function setAuthCookie(token: string) {
  const cookieStore = await cookies()
  
  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7天
    path: '/'
  })
}

/**
 * 清除认证cookie
 */
export async function clearAuthCookie() {
  const cookieStore = await cookies()
  
  cookieStore.set('auth-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/'
  })
}

/**
 * 获取管理员用户信息
 */
export function getAdminUser(): User {
  return ADMIN_USER
}

/**
 * 验证请求是否来自管理员
 */
export async function requireAdmin(): Promise<User | null> {
  const user = await getCurrentUser()
  
  if (!user || !isAdmin(user)) {
    return null
  }
  
  return user
} 