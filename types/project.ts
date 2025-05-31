export interface Project {
  id: string
  title: string
  slug: string
  description: string
  content: string
  category: string
  tags: string[]
  status: 'draft' | 'published'
  featured: boolean
  createdAt: string
  updatedAt: string
  author: string
  featuredImage: string
  demoUrl: string
  githubUrl: string
  technologies: string[]
  viewCount: number
  likes: number
}

export interface CreateProjectData {
  title: string
  description: string
  content: string
  category: string
  tags: string[]
  status: 'draft' | 'published'
  featured?: boolean
  featuredImage?: string
  demoUrl?: string
  githubUrl?: string
  technologies: string[]
}

export interface UpdateProjectData extends Partial<CreateProjectData> {
  id: string
}

export interface ProjectFilters {
  category?: string
  tags?: string[]
  status?: 'draft' | 'published' | 'all'
  search?: string
  featured?: boolean
  page?: number
  limit?: number
  sortBy?: 'createdAt' | 'updatedAt' | 'title' | 'viewCount'
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedProjects {
  projects: Project[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
} 