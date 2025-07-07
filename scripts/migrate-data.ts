#!/usr/bin/env tsx

import { supabaseAdmin } from '../lib/supabase'
import articles from '../data/articles.json'
import categories from '../data/categories.json'
import projects from '../data/projects.json'
import tags from '../data/tags.json'
import gallery from '../data/gallery.json'

// 数据迁移脚本
async function migrateData() {
  console.log('🚀 开始数据迁移...')

  try {
    // 1. 迁移分类数据
    console.log('📁 迁移分类数据...')
    const categoryData = categories.map(cat => ({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      color: cat.color || '#3b82f6',
      icon: cat.icon || 'Folder',
      created_at: cat.createdAt || new Date().toISOString(),
      updated_at: cat.updatedAt || new Date().toISOString()
    }))

    const { data: insertedCategories, error: categoryError } = await supabaseAdmin
      .from('categories')
      .upsert(categoryData, { onConflict: 'slug' })
      .select()

    if (categoryError) {
      console.error('❌ 分类数据迁移失败:', categoryError)
      throw categoryError
    }
    console.log(`✅ 成功迁移 ${insertedCategories?.length} 个分类`)

    // 2. 迁移标签数据
    console.log('🏷️  迁移标签数据...')
    const validTags = tags.filter(tag => tag.name && tag.name.trim())
    const tagData = validTags.map((tag, index) => ({
      name: tag.name,
      slug: tag.slug || createSlug(tag.name),
      description: `${tag.name} 相关内容`,
      color: getRandomColor(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }))

    const { data: insertedTags, error: tagError } = await supabaseAdmin
      .from('tags')
      .upsert(tagData, { onConflict: 'slug' })
      .select()

    if (tagError) {
      console.error('❌ 标签数据迁移失败:', tagError)
      throw tagError
    }
    console.log(`✅ 成功迁移 ${insertedTags?.length} 个标签`)

    // 3. 迁移文章数据
    console.log('📝 迁移文章数据...')
    const articleData = articles.map(article => ({
      title: article.title,
      slug: article.slug || createSlug(article.title),
      content: article.content || '',
      summary: article.excerpt || article.content?.substring(0, 200) + '...' || '',
      category: article.category,
      tags: article.tags || [],
      author: article.author || 'Mark-李',
      published_at: article.createdAt || new Date().toISOString(),
      created_at: article.createdAt || new Date().toISOString(),
      updated_at: article.updatedAt || new Date().toISOString(),
      featured_image: article.featuredImage,
      read_time: article.readingTime || calculateReadTime(article.content || ''),
      status: article.status === 'published' ? 'published' : 'draft',
      seo_title: article.title,
      seo_description: article.excerpt || article.content?.substring(0, 160) + '...' || ''
    }))

    const { data: insertedArticles, error: articleError } = await supabaseAdmin
      .from('articles')
      .upsert(articleData, { onConflict: 'slug' })
      .select()

    if (articleError) {
      console.error('❌ 文章数据迁移失败:', articleError)
      throw articleError
    }
    console.log(`✅ 成功迁移 ${insertedArticles?.length} 篇文章`)

    // 4. 迁移项目数据
    console.log('🎯 迁移项目数据...')
    const projectData = projects.map(project => ({
      title: project.title,
      slug: project.slug || createSlug(project.title),
      description: project.description || '',
      content: project.content || '',
      tech_stack: project.technologies || [],
      github_url: project.githubUrl || '',
      demo_url: project.demoUrl || '',
      featured_image: project.featuredImage || '',
      status: project.status === 'published' ? 'completed' : 'planning',
      created_at: project.createdAt || new Date().toISOString(),
      updated_at: project.updatedAt || new Date().toISOString()
    }))

    const { data: insertedProjects, error: projectError } = await supabaseAdmin
      .from('projects')
      .upsert(projectData, { onConflict: 'slug' })
      .select()

    if (projectError) {
      console.error('❌ 项目数据迁移失败:', projectError)
      throw projectError
    }
    console.log(`✅ 成功迁移 ${insertedProjects?.length} 个项目`)

    // 5. 迁移图片库数据
    console.log('🖼️  迁移图片库数据...')
    const galleryData = gallery.map(image => ({
      title: image.title || '图片',
      description: image.description || '',
      url: image.url,
      alt_text: image.title || '图片',
      category: image.category || 'general',
      tags: image.tags || [],
      created_at: image.createdAt || new Date().toISOString(),
      updated_at: image.updatedAt || new Date().toISOString()
    }))

    const { data: insertedGallery, error: galleryError } = await supabaseAdmin
      .from('gallery_images')
      .upsert(galleryData, { onConflict: 'url' })
      .select()

    if (galleryError) {
      console.error('❌ 图片库数据迁移失败:', galleryError)
      throw galleryError
    }
    console.log(`✅ 成功迁移 ${insertedGallery?.length} 张图片`)

    console.log('🎉 数据迁移完成！')
    console.log(`
📊 迁移统计:
- 分类: ${insertedCategories?.length} 个
- 标签: ${insertedTags?.length} 个  
- 文章: ${insertedArticles?.length} 篇
- 项目: ${insertedProjects?.length} 个
- 图片: ${insertedGallery?.length} 张
    `)

  } catch (error) {
    console.error('💥 数据迁移失败:', error)
    process.exit(1)
  }
}

// 工具函数
function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // 移除特殊字符
    .replace(/[\s_-]+/g, '-') // 替换空格和下划线为连字符
    .replace(/^-+|-+$/g, '') // 移除首尾连字符
    || `slug-${Date.now()}` // 如果为空则生成默认slug
}

function calculateReadTime(content: string): number {
  const wordsPerMinute = 200 // 平均阅读速度
  const words = content.split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

function getRandomColor(): string {
  const colors = [
    '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', 
    '#ef4444', '#06b6d4', '#84cc16', '#f97316'
  ]
  return colors[Math.floor(Math.random() * colors.length)] || '#3b82f6'
}

// 验证数据完整性
async function verifyMigration() {
  console.log('🔍 验证数据完整性...')
  
  try {
    const [categoriesResult, tagsResult, articlesResult, projectsResult, galleryResult] = await Promise.all([
      supabaseAdmin.from('categories').select('count', { count: 'exact' }),
      supabaseAdmin.from('tags').select('count', { count: 'exact' }),
      supabaseAdmin.from('articles').select('count', { count: 'exact' }),
      supabaseAdmin.from('projects').select('count', { count: 'exact' }),
      supabaseAdmin.from('gallery_images').select('count', { count: 'exact' })
    ])

    console.log(`
✅ 数据库统计:
- 分类总数: ${categoriesResult.count}
- 标签总数: ${tagsResult.count}
- 文章总数: ${articlesResult.count}
- 项目总数: ${projectsResult.count}
- 图片总数: ${galleryResult.count}
    `)

    // 检查数据一致性
    const { data: publishedArticles } = await supabaseAdmin
      .from('articles')
      .select('category')
      .eq('status', 'published')

    const { data: existingCategories } = await supabaseAdmin
      .from('categories')
      .select('slug')

    const categorySet = new Set(existingCategories?.map(c => c.slug))
    const missingCategories = publishedArticles?.filter(
      article => !categorySet.has(article.category)
    )

    if (missingCategories && missingCategories.length > 0) {
             console.warn('⚠️  发现文章引用了不存在的分类:', 
         [...new Set(missingCategories.map(a => a.category).filter(Boolean))]
       )
    } else {
      console.log('✅ 数据完整性检查通过')
    }

  } catch (error) {
    console.error('❌ 数据验证失败:', error)
  }
}

// 主函数
async function main() {
  await migrateData()
  await verifyMigration()
  process.exit(0)
}

// 如果直接运行此脚本
if (require.main === module) {
  main().catch(console.error)
}

export { migrateData, verifyMigration } 