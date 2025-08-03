import { NextResponse } from 'next/server'

export class ApiError extends Error {
  constructor(public override message: string, public statusCode: number = 500) {
    super(message)
  }
}

export function handleApiError(error: any): { message: string; status: number } {
  console.error('API Error:', error)

  // Supabase错误处理
  if (error?.code) {
    switch (error.code) {
      case '23505': // unique_violation
        if (error.details?.includes('slug')) {
          return {
            message: '文章标题已存在，系统将自动生成唯一标识符，请重试',
            status: 409
          }
        }
        return {
          message: '数据重复，请检查输入',
          status: 409
        }
      
      case '42P01': // undefined_table
        return {
          message: '数据表不存在，请检查数据库配置',
          status: 500
        }
      
      case 'PGRST116': // no_rows
        return {
          message: '未找到请求的数据',
          status: 404
        }
      
      case '23503': // foreign_key_violation
        return {
          message: '数据关联错误，请检查相关数据',
          status: 400
        }
      
      case '23514': // check_violation
        return {
          message: '数据格式不符合要求',
          status: 400
        }
    }
  }

  // 自定义API错误
  if (error instanceof ApiError) {
    return {
      message: error.message,
      status: error.statusCode
    }
  }

  // 网络或连接错误
  if (error?.message?.includes('fetch')) {
    return {
      message: '网络连接错误，请检查网络连接',
      status: 503
    }
  }

  // 默认错误
  return {
    message: '服务器内部错误，请稍后重试',
    status: 500
  }
}

export function validateArticleData(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
    errors.push('标题不能为空')
  }

  if (!data.content || typeof data.content !== 'string' || data.content.trim().length === 0) {
    errors.push('内容不能为空')
  }

  if (data.title && data.title.length > 200) {
    errors.push('标题长度不能超过200个字符')
  }

  if (data.summary && data.summary.length > 500) {
    errors.push('摘要长度不能超过500个字符')
  }

  if (data.tags && !Array.isArray(data.tags)) {
    errors.push('标签必须是数组格式')
  }

  if (data.status && !['draft', 'published', 'archived'].includes(data.status)) {
    errors.push('状态值无效')
  }

  if (data.category && typeof data.category !== 'string') {
    errors.push('分类必须是字符串')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export function validateImageData(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.filename || typeof data.filename !== 'string') {
    errors.push('文件名不能为空')
  }

  if (!data.url || typeof data.url !== 'string') {
    errors.push('图片URL不能为空')
  }

  if (data.size && (typeof data.size !== 'number' || data.size <= 0)) {
    errors.push('文件大小必须是正数')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
} 