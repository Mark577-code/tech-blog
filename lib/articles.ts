import { supabase } from './supabase'

/**
 * 计算阅读时间（分钟）
 */
export function calculateReadTime(content: string): number {
  const wordsPerMinute = 200 // 假设每分钟读200个中文字符
  const wordCount = content.length
  const readTime = Math.ceil(wordCount / wordsPerMinute)
  return Math.max(1, readTime) // 最少1分钟
}

/**
 * 生成文章摘要
 */
export function generateSummary(content: string, maxLength: number = 200): string {
  // 移除 Markdown 标记
  const cleanContent = content
    .replace(/#{1,6}\s+/g, '') // 移除标题标记
    .replace(/\*\*(.*?)\*\*/g, '$1') // 移除粗体标记
    .replace(/\*(.*?)\*/g, '$1') // 移除斜体标记
    .replace(/`(.*?)`/g, '$1') // 移除代码标记
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // 移除链接，保留文本
    .replace(/!\[.*?\]\(.*?\)/g, '') // 移除图片
    .replace(/>\s+/g, '') // 移除引用标记
    .replace(/\n+/g, ' ') // 换行符替换为空格
    .trim()

  if (cleanContent.length <= maxLength) {
    return cleanContent
  }

  // 截取指定长度，并在最后一个完整词处截断
  const truncated = cleanContent.substring(0, maxLength)
  const lastSpaceIndex = truncated.lastIndexOf(' ')
  
  if (lastSpaceIndex > maxLength * 0.8) {
    return truncated.substring(0, lastSpaceIndex) + '...'
  }
  
  return truncated + '...'
}

/**
 * 创建slug - 支持中文并确保唯一性
 */
export function createSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    // 移除特殊字符，保留中文、英文、数字、连字符
    .replace(/[^\u4e00-\u9fa5a-z0-9\s-]/g, '')
    // 空格替换为连字符
    .replace(/\s+/g, '-')
    // 多个连字符合并为一个
    .replace(/-+/g, '-')
    // 移除首尾连字符
    .replace(/^-+|-+$/g, '')
}

/**
 * 生成唯一slug
 */
export async function generateUniqueSlug(title: string, excludeId?: string): Promise<string> {
  const baseSlug = createSlug(title)
  let slug = baseSlug
  let counter = 1

  // 检查slug是否已存在
  while (true) {
    let query = supabase
      .from('articles')
      .select('id')
      .eq('slug', slug)
      .limit(1)
    
    // 如果是更新操作，排除当前文章
    if (excludeId) {
      query = query.neq('id', excludeId)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('检查slug唯一性时出错:', error)
      // 如果检查出错，添加时间戳确保唯一性
      return `${baseSlug}-${Date.now()}`
    }
    
    // 如果没有找到重复的slug，返回当前slug
    if (!data || data.length === 0) {
      return slug
    }
    
    // 如果找到重复，生成新的slug
    slug = `${baseSlug}-${counter}`
    counter++
    
    // 防止无限循环，最多尝试100次
    if (counter > 100) {
      return `${baseSlug}-${Date.now()}`
    }
  }
}

/**
 * 获取默认分类数据
 */
export function getCategories() {
  return [
    {
      id: 'tech',
      name: '技术文章',
      slug: 'technology',
      description: '编程、开发、技术相关文章',
      color: '#3b82f6',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'life',
      name: '生活随笔',
      slug: 'life',
      description: '日常生活、思考、随笔',
      color: '#10b981',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'project',
      name: '项目经验',
      slug: 'projects',
      description: '项目开发、经验分享',
      color: '#f59e0b',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]
} 