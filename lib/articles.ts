import fs from 'fs/promises'
import path from 'path'
import type { 
  Article, 
  CreateArticleData, 
  UpdateArticleData, 
  ArticleFilters,
  PaginatedArticles,
  Category,
  Tag
} from '@/types/article'

const DATA_DIR = path.join(process.cwd(), 'data')
const ARTICLES_FILE = path.join(DATA_DIR, 'articles.json')
const CATEGORIES_FILE = path.join(DATA_DIR, 'categories.json')
const TAGS_FILE = path.join(DATA_DIR, 'tags.json')

/**
 * 确保数据目录存在
 */
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

/**
 * 读取文章数据
 */
async function readArticles(): Promise<Article[]> {
  try {
    await ensureDataDir()
    const data = await fs.readFile(ARTICLES_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

/**
 * 写入文章数据
 */
async function writeArticles(articles: Article[]): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(ARTICLES_FILE, JSON.stringify(articles, null, 2), 'utf-8')
}

/**
 * 读取分类数据
 */
async function readCategories(): Promise<Category[]> {
  try {
    await ensureDataDir()
    const data = await fs.readFile(CATEGORIES_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return getDefaultCategories()
  }
}

/**
 * 写入分类数据
 */
async function writeCategories(categories: Category[]): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(CATEGORIES_FILE, JSON.stringify(categories, null, 2), 'utf-8')
}

/**
 * 读取标签数据
 */
async function readTags(): Promise<Tag[]> {
  try {
    await ensureDataDir()
    const data = await fs.readFile(TAGS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

/**
 * 写入标签数据
 */
async function writeTags(tags: Tag[]): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(TAGS_FILE, JSON.stringify(tags, null, 2), 'utf-8')
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
 * 计算阅读时间（分钟）
 */
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

/**
 * 生成文章摘要
 */
function generateExcerpt(content: string, maxLength: number = 150): string {
  const text = content.replace(/#+\s/g, '').replace(/\*+/g, '').replace(/`+/g, '')
  if (text.length <= maxLength) return text
  return text.substr(0, maxLength).replace(/\s+\S*$/, '') + '...'
}

/**
 * 获取默认分类
 */
function getDefaultCategories(): Category[] {
  return [
    {
      id: 'tech',
      name: '技术文章',
      slug: 'technology',
      description: '编程、开发、技术相关文章',
      color: '#3b82f6',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'life',
      name: '生活随笔',
      slug: 'life',
      description: '日常生活、思考、随笔',
      color: '#10b981',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'project',
      name: '项目经验',
      slug: 'projects',
      description: '项目开发、经验分享',
      color: '#f59e0b',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]
}

/**
 * 获取所有文章
 */
export async function getAllArticles(filters: ArticleFilters = {}): Promise<PaginatedArticles> {
  const articles = await readArticles()
  let filteredArticles = [...articles]

  // 应用筛选器
  if (filters.status && filters.status !== 'all') {
    filteredArticles = filteredArticles.filter(article => article.status === filters.status)
  }

  if (filters.category) {
    filteredArticles = filteredArticles.filter(article => article.category === filters.category)
  }

  if (filters.tags && filters.tags.length > 0) {
    filteredArticles = filteredArticles.filter(article =>
      filters.tags!.some(tag => article.tags.includes(tag))
    )
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    filteredArticles = filteredArticles.filter(article =>
      article.title.toLowerCase().includes(searchLower) ||
      article.content.toLowerCase().includes(searchLower) ||
      article.excerpt.toLowerCase().includes(searchLower)
    )
  }

  // 排序
  const sortBy = filters.sortBy || 'createdAt'
  const sortOrder = filters.sortOrder || 'desc'
  
  filteredArticles.sort((a, b) => {
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
  const paginatedArticles = filteredArticles.slice(startIndex, endIndex)

  const total = filteredArticles.length
  const totalPages = Math.ceil(total / limit)

  return {
    articles: paginatedArticles,
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
 * 根据ID获取文章
 */
export async function getArticleById(id: string): Promise<Article | null> {
  const articles = await readArticles()
  return articles.find(article => article.id === id) || null
}

/**
 * 根据slug获取文章
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const articles = await readArticles()
  return articles.find(article => article.slug === slug) || null
}

/**
 * 创建新文章
 */
export async function createArticle(data: CreateArticleData, author: string): Promise<Article> {
  const articles = await readArticles()
  
  const id = generateId()
  const slug = generateSlug(data.title)
  const now = new Date().toISOString()
  
  const article: Article = {
    id,
    title: data.title,
    slug,
    content: data.content,
    excerpt: data.excerpt || generateExcerpt(data.content),
    category: data.category,
    tags: data.tags,
    status: data.status,
    createdAt: now,
    updatedAt: now,
    author,
    featuredImage: data.featuredImage || '',
    readingTime: calculateReadingTime(data.content),
    viewCount: 0,
    likes: 0
  }
  
  articles.unshift(article) // 新文章放在前面
  await writeArticles(articles)
  
  // 更新标签统计
  await updateTagCounts()
  
  return article
}

/**
 * 更新文章
 */
export async function updateArticle(data: UpdateArticleData): Promise<Article | null> {
  const articles = await readArticles()
  const index = articles.findIndex(article => article.id === data.id)
  
  if (index === -1) {
    return null
  }
  
  const existingArticle = articles[index]!
  const updatedArticle: Article = {
    ...existingArticle,
    ...data,
    id: existingArticle.id, // 确保ID不被覆盖
    createdAt: existingArticle.createdAt, // 保持创建时间
    updatedAt: new Date().toISOString(),
    readingTime: data.content ? calculateReadingTime(data.content) : existingArticle.readingTime,
    excerpt: data.excerpt || (data.content ? generateExcerpt(data.content) : existingArticle.excerpt),
    slug: data.title ? generateSlug(data.title) : existingArticle.slug,
    featuredImage: data.featuredImage !== undefined ? data.featuredImage : existingArticle.featuredImage,
    viewCount: existingArticle.viewCount || 0,
    likes: existingArticle.likes || 0
  }
  
  articles[index] = updatedArticle
  await writeArticles(articles)
  
  // 更新标签统计
  await updateTagCounts()
  
  return updatedArticle
}

/**
 * 删除文章
 */
export async function deleteArticle(id: string): Promise<boolean> {
  const articles = await readArticles()
  const filteredArticles = articles.filter(article => article.id !== id)
  
  if (filteredArticles.length === articles.length) {
    return false // 文章不存在
  }
  
  await writeArticles(filteredArticles)
  
  // 更新标签统计
  await updateTagCounts()
  
  return true
}

/**
 * 获取所有分类
 */
export async function getAllCategories(): Promise<Category[]> {
  return await readCategories()
}

/**
 * 获取所有标签
 */
export async function getAllTags(): Promise<Tag[]> {
  return await readTags()
}

/**
 * 更新标签统计
 */
async function updateTagCounts(): Promise<void> {
  const articles = await readArticles()
  const tagCounts = new Map<string, number>()
  
  articles.forEach(article => {
    article.tags.forEach(tag => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
    })
  })
  
  const tags: Tag[] = Array.from(tagCounts.entries()).map(([name, count]) => ({
    id: generateSlug(name),
    name,
    slug: generateSlug(name),
    count
  }))
  
  await writeTags(tags)
}

/**
 * 增加文章浏览量
 */
export async function incrementViewCount(id: string): Promise<void> {
  const articles = await readArticles()
  const article = articles.find(a => a.id === id)
  
  if (article) {
    article.viewCount = (article.viewCount || 0) + 1
    await writeArticles(articles)
  }
} 