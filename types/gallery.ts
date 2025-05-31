export interface GalleryImage {
  id: string
  title: string
  description?: string
  url: string
  thumbnailUrl?: string
  category: string
  tags: string[]
  featured: boolean
  createdAt: string
  updatedAt: string
  author: string
  viewCount: number
  likes: number
  order?: number
}

export interface CreateGalleryImageData {
  title: string
  description?: string
  url: string
  thumbnailUrl?: string
  category: string
  tags: string[]
  featured?: boolean
  order?: number
}

export interface UpdateGalleryImageData extends Partial<CreateGalleryImageData> {
  id: string
}

export interface GalleryFilters {
  category?: string
  tags?: string[]
  featured?: boolean
  search?: string
  page?: number
  limit?: number
  sortBy?: 'createdAt' | 'updatedAt' | 'title' | 'viewCount' | 'order'
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedGalleryImages {
  images: GalleryImage[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export interface DashboardStats {
  todayViews: number
  totalArticles: number
  totalProjects: number
  totalImages: number
  recentActivities: Array<{
    id: string
    type: 'article' | 'project' | 'image'
    action: 'created' | 'updated' | 'published'
    title: string
    timestamp: string
  }>
  viewsData: Array<{
    time: string
    views: number
  }>
} 