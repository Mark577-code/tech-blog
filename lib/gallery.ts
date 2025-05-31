import { promises as fs } from 'fs'
import path from 'path'
import type { 
  GalleryImage, 
  CreateGalleryImageData, 
  UpdateGalleryImageData, 
  GalleryFilters, 
  PaginatedGalleryImages 
} from '@/types/gallery'

const DATA_DIR = path.join(process.cwd(), 'data')
const GALLERY_FILE = path.join(DATA_DIR, 'gallery.json')

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
 * 读取图片数据
 */
async function readGalleryImages(): Promise<GalleryImage[]> {
  try {
    await ensureDataDir()
    const data = await fs.readFile(GALLERY_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

/**
 * 写入图片数据
 */
async function writeGalleryImages(images: GalleryImage[]): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(GALLERY_FILE, JSON.stringify(images, null, 2), 'utf-8')
}

/**
 * 生成唯一ID
 */
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

/**
 * 获取所有图片
 */
export async function getAllGalleryImages(filters: GalleryFilters = {}): Promise<PaginatedGalleryImages> {
  const images = await readGalleryImages()
  let filteredImages = [...images]

  // 应用筛选器
  if (filters.category) {
    filteredImages = filteredImages.filter(image => image.category === filters.category)
  }

  if (filters.featured !== undefined) {
    filteredImages = filteredImages.filter(image => image.featured === filters.featured)
  }

  if (filters.tags && filters.tags.length > 0) {
    filteredImages = filteredImages.filter(image =>
      filters.tags!.some(tag => image.tags.includes(tag))
    )
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    filteredImages = filteredImages.filter(image =>
      image.title.toLowerCase().includes(searchLower) ||
      (image.description && image.description.toLowerCase().includes(searchLower))
    )
  }

  // 排序
  const sortBy = filters.sortBy || 'createdAt'
  const sortOrder = filters.sortOrder || 'desc'
  
  filteredImages.sort((a, b) => {
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
  const paginatedImages = filteredImages.slice(startIndex, endIndex)

  const total = filteredImages.length
  const totalPages = Math.ceil(total / limit)

  return {
    images: paginatedImages,
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
 * 根据ID获取图片
 */
export async function getGalleryImageById(id: string): Promise<GalleryImage | null> {
  const images = await readGalleryImages()
  return images.find(image => image.id === id) || null
}

/**
 * 创建新图片记录
 */
export async function createGalleryImage(data: CreateGalleryImageData, author: string): Promise<GalleryImage> {
  const images = await readGalleryImages()
  
  const id = generateId()
  const now = new Date().toISOString()
  
  const image: GalleryImage = {
    id,
    title: data.title,
    description: data.description || '',
    url: data.url,
    thumbnailUrl: data.thumbnailUrl || data.url,
    category: data.category,
    tags: data.tags,
    featured: data.featured || false,
    createdAt: now,
    updatedAt: now,
    author,
    viewCount: 0,
    likes: 0,
    order: data.order || 0
  }
  
  images.unshift(image) // 新图片放在前面
  await writeGalleryImages(images)
  
  return image
}

/**
 * 更新图片记录
 */
export async function updateGalleryImage(data: UpdateGalleryImageData): Promise<GalleryImage | null> {
  const images = await readGalleryImages()
  const index = images.findIndex(image => image.id === data.id)
  
  if (index === -1) {
    return null
  }
  
  const existingImage = images[index]!
  const updatedImage: GalleryImage = {
    ...existingImage,
    ...data,
    id: existingImage.id, // 确保ID不被覆盖
    createdAt: existingImage.createdAt, // 保持创建时间
    updatedAt: new Date().toISOString(),
    viewCount: existingImage.viewCount || 0,
    likes: existingImage.likes || 0
  }
  
  images[index] = updatedImage
  await writeGalleryImages(images)
  
  return updatedImage
}

/**
 * 删除图片记录
 */
export async function deleteGalleryImage(id: string): Promise<boolean> {
  const images = await readGalleryImages()
  const index = images.findIndex(image => image.id === id)
  
  if (index === -1) {
    return false
  }
  
  images.splice(index, 1)
  await writeGalleryImages(images)
  
  return true
}

/**
 * 获取精选图片（用于首页轮播）
 */
export async function getFeaturedImages(limit: number = 3): Promise<GalleryImage[]> {
  const result = await getAllGalleryImages({
    featured: true,
    limit,
    sortBy: 'order',
    sortOrder: 'asc'
  })
  
  return result.images
} 