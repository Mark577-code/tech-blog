export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  icon: string
  color: string
  order: number
  isVisible: boolean
  articleCount: number
  createdAt: string
  updatedAt: string
  author: string
}

export interface CreateCategoryData {
  name: string
  slug: string
  description?: string
  icon: string
  color: string
  order: number
  isVisible: boolean
}

export interface UpdateCategoryData extends CreateCategoryData {
  id: string
}

export interface CategoryFilter {
  isVisible?: boolean
  limit?: number
  sortBy?: 'order' | 'name' | 'createdAt' | 'updatedAt'
  sortOrder?: 'asc' | 'desc'
}

export interface CategoryStats {
  totalCategories: number
  visibleCategories: number
  totalArticles: number
} 