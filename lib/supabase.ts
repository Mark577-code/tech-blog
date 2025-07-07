import { createClient } from '@supabase/supabase-js'

// Supabase 配置
const supabaseUrl = process.env["NEXT_PUBLIC_SUPABASE_URL"] || 'https://aieatfsfsbhrjhjdnlhb.supabase.co'
const supabaseAnonKey = process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"] || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpZWF0ZnNmc2JocmpoamRubGhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1NTA5MDQsImV4cCI6MjA2NzEyNjkwNH0.pGXO09CnMm5b0-rdZEUVXyER0GcDTovOhFPEh-v65-I'

// 客户端实例 - 用于前端
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 服务端实例 - 用于管理员操作
const supabaseServiceKey = process.env["SUPABASE_SERVICE_ROLE_KEY"] || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpZWF0ZnNmc2JocmpoamRubGhiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTU1MDkwNCwiZXhwIjoyMDY3MTI2OTA0fQ.ShTudi_JcKiEYIwTfhRfpuKNbFZTVzMgDYaPUYUx0wc'

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// 数据库表类型定义
export interface Article {
  id: string
  title: string
  slug: string
  content: string
  summary: string
  category: string
  tags: string[]
  author: string
  published_at: string
  updated_at: string
  created_at: string
  featured_image?: string
  read_time?: number
  status: 'draft' | 'published' | 'archived'
  seo_title?: string
  seo_description?: string
  canonical_url?: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  color?: string
  icon?: string
  created_at: string
  updated_at: string
}

export interface Tag {
  id: string
  name: string
  slug: string
  description?: string
  color?: string
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  title: string
  slug: string
  description: string
  content?: string
  tech_stack: string[]
  github_url?: string
  demo_url?: string
  featured_image?: string
  status: 'planning' | 'in_progress' | 'completed' | 'archived'
  created_at: string
  updated_at: string
}

export interface GalleryImage {
  id: string
  title: string
  description?: string
  url: string
  alt_text?: string
  category?: string
  tags?: string[]
  created_at: string
  updated_at: string
}

// 数据库操作封装
export const dbOperations = {
  // 文章操作
  articles: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
      
      if (error) throw error
      return data
    },
    
    getBySlug: async (slug: string) => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single()
      
      if (error) throw error
      return data
    },
    
    getByCategory: async (category: string) => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('category', category)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
      
      if (error) throw error
      return data
    },
    
    create: async (article: Omit<Article, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabaseAdmin
        .from('articles')
        .insert(article)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    
    update: async (id: string, updates: Partial<Article>) => {
      const { data, error } = await supabaseAdmin
        .from('articles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    
    delete: async (id: string) => {
      const { error } = await supabaseAdmin
        .from('articles')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    }
  },
  
  // 分类操作
  categories: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')
      
      if (error) throw error
      return data
    },
    
    getBySlug: async (slug: string) => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single()
      
      if (error) throw error
      return data
    }
  },
  
  // 标签操作
  tags: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('name')
      
      if (error) throw error
      return data
    }
  },
  
  // 项目操作
  projects: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    }
  },
  
  // 图片库操作
  gallery: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    }
  }
} 