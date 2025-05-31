import { promises as fs } from 'fs'
import path from 'path'
import type { 
  Project, 
  CreateProjectData, 
  UpdateProjectData, 
  ProjectFilters, 
  PaginatedProjects 
} from '@/types/project'

const DATA_DIR = path.join(process.cwd(), 'data')
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json')

/**
 * 确保数据目录存在
 */
async function ensureDataDir(): Promise<void> {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

/**
 * 读取项目数据
 */
async function readProjects(): Promise<Project[]> {
  try {
    await ensureDataDir()
    const data = await fs.readFile(PROJECTS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

/**
 * 写入项目数据
 */
async function writeProjects(projects: Project[]): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(PROJECTS_FILE, JSON.stringify(projects, null, 2), 'utf-8')
}

/**
 * 生成URL友好的slug
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * 生成唯一ID
 */
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

/**
 * 获取所有项目
 */
export async function getAllProjects(filters: ProjectFilters = {}): Promise<PaginatedProjects> {
  const projects = await readProjects()
  let filteredProjects = [...projects]

  // 应用筛选器
  if (filters.status && filters.status !== 'all') {
    filteredProjects = filteredProjects.filter(project => project.status === filters.status)
  }

  if (filters.category) {
    filteredProjects = filteredProjects.filter(project => project.category === filters.category)
  }

  if (filters.featured !== undefined) {
    filteredProjects = filteredProjects.filter(project => project.featured === filters.featured)
  }

  if (filters.tags && filters.tags.length > 0) {
    filteredProjects = filteredProjects.filter(project =>
      filters.tags!.some(tag => project.tags.includes(tag))
    )
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    filteredProjects = filteredProjects.filter(project =>
      project.title.toLowerCase().includes(searchLower) ||
      project.description.toLowerCase().includes(searchLower) ||
      project.content.toLowerCase().includes(searchLower)
    )
  }

  // 排序
  const sortBy = filters.sortBy || 'createdAt'
  const sortOrder = filters.sortOrder || 'desc'
  
  filteredProjects.sort((a, b) => {
    let aValue = a[sortBy] as any
    let bValue = b[sortBy] as any
    
    if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
      aValue = new Date(aValue).getTime()
      bValue = new Date(bValue).getTime()
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  // 分页
  const page = filters.page || 1
  const limit = filters.limit || 10
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedProjects = filteredProjects.slice(startIndex, endIndex)

  const total = filteredProjects.length
  const totalPages = Math.ceil(total / limit)

  return {
    projects: paginatedProjects,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  }
}

/**
 * 根据ID获取项目
 */
export async function getProjectById(id: string): Promise<Project | null> {
  const projects = await readProjects()
  return projects.find(project => project.id === id) || null
}

/**
 * 根据slug获取项目
 */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const projects = await readProjects()
  return projects.find(project => project.slug === slug) || null
}

/**
 * 创建新项目
 */
export async function createProject(data: CreateProjectData, author: string): Promise<Project> {
  const projects = await readProjects()
  
  const id = generateId()
  const slug = generateSlug(data.title)
  const now = new Date().toISOString()
  
  const project: Project = {
    id,
    title: data.title,
    slug,
    description: data.description,
    content: data.content,
    category: data.category,
    tags: data.tags,
    status: data.status,
    featured: data.featured || false,
    createdAt: now,
    updatedAt: now,
    author,
    featuredImage: data.featuredImage || '',
    demoUrl: data.demoUrl || '',
    githubUrl: data.githubUrl || '',
    technologies: data.technologies,
    viewCount: 0,
    likes: 0
  }
  
  projects.unshift(project) // 新项目放在前面
  await writeProjects(projects)
  
  return project
}

/**
 * 更新项目
 */
export async function updateProject(data: UpdateProjectData): Promise<Project | null> {
  const projects = await readProjects()
  const index = projects.findIndex(project => project.id === data.id)
  
  if (index === -1) {
    return null
  }
  
  const existingProject = projects[index]!
  const updatedProject: Project = {
    ...existingProject,
    ...data,
    id: existingProject.id, // 确保ID不被覆盖
    createdAt: existingProject.createdAt, // 保持创建时间
    updatedAt: new Date().toISOString(),
    slug: data.title ? generateSlug(data.title) : existingProject.slug,
    viewCount: existingProject.viewCount || 0,
    likes: existingProject.likes || 0
  }
  
  projects[index] = updatedProject
  await writeProjects(projects)
  
  return updatedProject
}

/**
 * 删除项目
 */
export async function deleteProject(id: string): Promise<boolean> {
  const projects = await readProjects()
  const index = projects.findIndex(project => project.id === id)
  
  if (index === -1) {
    return false
  }
  
  projects.splice(index, 1)
  await writeProjects(projects)
  
  return true
}

/**
 * 获取精选项目
 */
export async function getFeaturedProjects(limit: number = 4): Promise<Project[]> {
  const result = await getAllProjects({
    status: 'published',
    featured: true,
    limit,
    sortBy: 'updatedAt',
    sortOrder: 'desc'
  })
  
  return result.projects
} 