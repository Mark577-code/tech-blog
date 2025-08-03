export interface Article {
  id: string
  title: string
  slug: string
  content: string
  summary: string  // 改用summary而不是excerpt
  category: string
  tags: string[]
  status: 'draft' | 'published' | 'archived'
  created_at: string  // 使用蛇形命名匹配数据库
  updated_at: string  // 使用蛇形命名匹配数据库
  published_at: string  // 使用蛇形命名匹配数据库
  author: string
  featured_image: string | null  // 使用蛇形命名匹配数据库
  read_time: number  // 使用蛇形命名匹配数据库
  seo_title?: string | null
  seo_description?: string | null
  canonical_url?: string | null
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  color?: string
  created_at: string
  updated_at: string
}

export interface Tag {
  id: string
  name: string
  slug: string
  color?: string
  count: number
}

export interface CreateArticleData {
  title: string
  content: string
  summary?: string
  category: string
  tags: string[]
  status: 'draft' | 'published' | 'archived'
  featured_image?: string
}

export interface UpdateArticleData extends Partial<CreateArticleData> {
  id: string
}

export interface ArticleFilters {
  category?: string
  tags?: string[]
  status?: 'draft' | 'published' | 'archived' | 'all'
  search?: string
  page?: number
  limit?: number
  sortBy?: 'created_at' | 'updated_at' | 'title' | 'read_time'
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedArticles {
  articles: Article[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

// API响应类型
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// 用户认证相关
export interface User {
  id: string
  username: string
  email?: string
  role: 'admin'
  created_at: string
}

export interface LoginCredentials {
  password: string
}

export interface AuthResponse {
  success: boolean
  user?: User
  token?: string
  message?: string
} 