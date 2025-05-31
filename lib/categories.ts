import fs from 'fs'
import path from 'path'
import type { Category, CreateCategoryData, UpdateCategoryData, CategoryFilter } from '@/types/category'

const CATEGORIES_FILE = path.join(process.cwd(), 'data', 'categories.json')
const ARTICLES_FILE = path.join(process.cwd(), 'data', 'articles.json')

// 获取真实的文章数量统计
async function getRealArticleCounts(): Promise<Record<string, number>> {
  try {
    const articlesData = fs.readFileSync(ARTICLES_FILE, 'utf-8')
    const articles = JSON.parse(articlesData)
    
    const counts: Record<string, number> = {}
    
    // 统计每个分类的已发布文章数量
    articles
      .filter((article: any) => article.status === 'published')
      .forEach((article: any) => {
        if (article.category) {
          counts[article.category] = (counts[article.category] || 0) + 1
        }
      })
    
    return counts
  } catch (error) {
    console.error('Error reading articles for count:', error)
    return {}
  }
}

// 读取分类数据
export async function getCategories(filter: CategoryFilter = {}): Promise<{ categories: Category[], total: number }> {
  try {
    const data = fs.readFileSync(CATEGORIES_FILE, 'utf-8')
    let categories: Category[] = JSON.parse(data)

    // 获取真实的文章数量统计
    const articleCounts = await getRealArticleCounts()

    // 更新文章数量为真实数据
    categories = categories.map(category => ({
      ...category,
      articleCount: articleCounts[category.slug] || 0
    }))

    // 应用过滤器
    if (filter.isVisible !== undefined) {
      categories = categories.filter(cat => cat.isVisible === filter.isVisible)
    }

    // 排序
    const sortBy = filter.sortBy || 'order'
    const sortOrder = filter.sortOrder || 'asc'
    categories.sort((a, b) => {
      const aValue = a[sortBy]
      const bValue = b[sortBy]
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    // 应用分页
    const total = categories.length
    if (filter.limit) {
      categories = categories.slice(0, filter.limit)
    }

    return { categories, total }
  } catch (error) {
    console.error('Error reading categories:', error)
    return { categories: [], total: 0 }
  }
}

// 根据ID获取分类
export async function getCategoryById(id: string): Promise<Category | null> {
  try {
    const { categories } = await getCategories()
    return categories.find(cat => cat.id === id) || null
  } catch (error) {
    console.error('Error getting category by id:', error)
    return null
  }
}

// 根据slug获取分类
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const { categories } = await getCategories()
    return categories.find(cat => cat.slug === slug) || null
  } catch (error) {
    console.error('Error getting category by slug:', error)
    return null
  }
}

// 创建分类
export async function createCategory(data: CreateCategoryData): Promise<Category> {
  try {
    const { categories } = await getCategories()
    
    // 检查slug是否已存在
    const existingCategory = categories.find(cat => cat.slug === data.slug)
    if (existingCategory) {
      throw new Error('分类标识符已存在')
    }

    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      ...data,
      articleCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: 'admin'
    }

    categories.push(newCategory)
    fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(categories, null, 2))
    
    return newCategory
  } catch (error) {
    console.error('Error creating category:', error)
    throw error
  }
}

// 更新分类
export async function updateCategory(data: UpdateCategoryData): Promise<Category | null> {
  try {
    const { categories } = await getCategories()
    const index = categories.findIndex(cat => cat.id === data.id)
    
    if (index === -1) {
      return null
    }

    // 检查slug是否与其他分类冲突
    const existingCategory = categories.find(cat => cat.slug === data.slug && cat.id !== data.id)
    if (existingCategory) {
      throw new Error('分类标识符已存在')
    }

    const currentCategory = categories[index]
    if (!currentCategory) {
      return null
    }

    const updatedCategory: Category = {
      id: currentCategory.id,
      name: data.name,
      slug: data.slug,
      icon: data.icon,
      color: data.color,
      order: data.order,
      isVisible: data.isVisible,
      articleCount: currentCategory.articleCount,
      createdAt: currentCategory.createdAt,
      updatedAt: new Date().toISOString(),
      author: currentCategory.author,
      ...(data.description !== undefined && { description: data.description })
    }

    categories[index] = updatedCategory
    fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(categories, null, 2))
    
    return updatedCategory
  } catch (error) {
    console.error('Error updating category:', error)
    throw error
  }
}

// 删除分类
export async function deleteCategory(id: string): Promise<boolean> {
  try {
    const { categories } = await getCategories()
    const index = categories.findIndex(cat => cat.id === id)
    
    if (index === -1) {
      return false
    }

    categories.splice(index, 1)
    fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(categories, null, 2))
    
    return true
  } catch (error) {
    console.error('Error deleting category:', error)
    return false
  }
}

// 更新分类的文章数量
export async function updateCategoryArticleCount(categorySlug: string, increment: number = 1): Promise<void> {
  try {
    const { categories } = await getCategories()
    const category = categories.find(cat => cat.slug === categorySlug)
    
    if (category) {
      category.articleCount = Math.max(0, (category.articleCount || 0) + increment)
      category.updatedAt = new Date().toISOString()
      fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(categories, null, 2))
    }
  } catch (error) {
    console.error('Error updating category article count:', error)
  }
} 