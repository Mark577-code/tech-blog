// 管理员认证系统 - 安全版本
export interface AdminUser {
  username: string
  role: 'admin'
}

// 从环境变量获取管理员凭据
const getAdminCredentials = () => {
  const username = process.env['ADMIN_USERNAME']
  const password = process.env['ADMIN_PASSWORD']
  
  if (!username || !password) {
    throw new Error('管理员凭据未在环境变量中配置')
  }
  
  return { username, password }
}

// 验证管理员凭据 - 仅在服务端使用
export function validateAdminCredentials(username: string, password: string): boolean {
  try {
    const credentials = getAdminCredentials()
    return username === credentials.username && password === credentials.password
  } catch (error) {
    console.error('验证凭据时出错:', error)
    return false
  }
}

// 生成简单的token（实际项目中应该使用JWT）
export function generateAdminToken(): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2)
  return btoa(`admin:${timestamp}:${random}`)
}

// 验证token
export function validateAdminToken(token: string): boolean {
  try {
    if (!token) return false
    
    const decoded = atob(token)
    const parts = decoded.split(':')
    
    if (parts[0] !== 'admin') return false
    
    const timestamp = parseInt(parts[1])
    if (isNaN(timestamp)) return false
    
    const now = Date.now()
    
    // Token 24小时过期
    return (now - timestamp) < 24 * 60 * 60 * 1000
  } catch {
    return false
  }
}

// 本地存储管理
export const adminAuth = {
  // 设置token
  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_token', token)
    }
  },
  
  // 获取token
  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('admin_token')
    }
    return null
  },
  
  // 移除token
  removeToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token')
    }
  },
  
  // 检查是否已登录
  isLoggedIn: (): boolean => {
    const token = adminAuth.getToken()
    if (!token) return false
    return validateAdminToken(token)
  }
} 