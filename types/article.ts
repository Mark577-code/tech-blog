export interface Article {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  category: string
  tags: string[]
  status: 'draft' | 'published'
  createdAt: string
  updatedAt: string
  author: string
  featuredImage: string
  readingTime: number
  viewCount: number
  likes: number
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  color?: string
  createdAt: string
  updatedAt: string
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
  excerpt?: string
  category: string
  tags: string[]
  status: 'draft' | 'published'
  featuredImage?: string
}

export interface UpdateArticleData extends Partial<CreateArticleData> {
  id: string
}

export interface ArticleFilters {
  category?: string
  tags?: string[]
  status?: 'draft' | 'published' | 'all'
  search?: string
  page?: number
  limit?: number
  sortBy?: 'createdAt' | 'updatedAt' | 'title' | 'viewCount'
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
  createdAt: string
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