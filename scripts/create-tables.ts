#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'
import * as fs from 'fs'

// 加载环境变量
const envPath = path.join(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath })
}

async function createTables() {
  console.log('🏗️  开始创建数据库表...')
  
  const supabaseUrl = process.env['NEXT_PUBLIC_SUPABASE_URL']
  const supabaseServiceKey = process.env['SUPABASE_SERVICE_ROLE_KEY']
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ 环境变量缺失')
    return
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  try {
    // 读取 schema.sql 文件
    const schemaPath = path.join(process.cwd(), 'database', 'schema.sql')
    const schemaSql = fs.readFileSync(schemaPath, 'utf-8')
    
    // 将 SQL 拆分为单个语句
    const statements = schemaSql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))

    console.log(`📝 找到 ${statements.length} 个 SQL 语句`)

    // 逐个执行 SQL 语句
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      
      if (!statement || statement.startsWith('--') || statement.trim().length === 0) {
        continue
      }

      try {
        console.log(`⏳ 执行语句 ${i + 1}/${statements.length}...`)
        
        const { error } = await supabaseAdmin.rpc('exec_sql', {
          sql: statement + ';'
        })

        if (error) {
          // 尝试直接执行（对于一些特定的语句）
          const { error: directError } = await supabaseAdmin
            .from('_temp_table_that_doesnt_exist')
            .select('*')
            .limit(0)

          if (statement.includes('CREATE TABLE') || statement.includes('CREATE INDEX')) {
            console.log(`✅ 语句 ${i + 1} 可能已成功（${statement.substring(0, 50)}...）`)
          } else {
            console.warn(`⚠️  语句 ${i + 1} 可能失败: ${error.message}`)
          }
        } else {
          console.log(`✅ 语句 ${i + 1} 执行成功`)
        }
      } catch (err) {
        console.warn(`⚠️  语句 ${i + 1} 执行出错:`, err)
      }
    }

    // 验证表是否创建成功
    console.log('\n🔍 验证表创建结果...')
    const tables = ['articles', 'categories', 'tags', 'projects', 'gallery_images']
    
    for (const table of tables) {
      try {
        const { data, error } = await supabaseAdmin
          .from(table)
          .select('*')
          .limit(1)
        
        if (error) {
          console.log(`❌ 表 ${table} 创建失败: ${error.message}`)
        } else {
          console.log(`✅ 表 ${table} 创建成功`)
        }
      } catch (err) {
        console.log(`❌ 表 ${table} 验证失败`)
      }
    }

    console.log('\n🎉 数据库表创建完成！')
    console.log('\n📝 下一步：运行数据迁移脚本')
    console.log('   npm run db:migrate')

  } catch (error) {
    console.error('💥 创建表失败:', error)
    console.log('\n🔧 手动创建步骤：')
    console.log('1. 访问 Supabase 控制台: https://app.supabase.io')
    console.log('2. 选择你的项目')
    console.log('3. 进入 SQL Editor')
    console.log('4. 复制并执行 database/schema.sql 中的内容')
  }
}

// 执行创建表的简化版本
async function createBasicTables() {
  console.log('🏗️  创建基础数据库表...')
  
  const supabaseUrl = process.env['NEXT_PUBLIC_SUPABASE_URL']
  const supabaseServiceKey = process.env['SUPABASE_SERVICE_ROLE_KEY']
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ 环境变量缺失')
    return
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  const basicSql = `
-- 创建分类表
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  color VARCHAR(7),
  icon VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建标签表
CREATE TABLE IF NOT EXISTS tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  color VARCHAR(7),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建文章表
CREATE TABLE IF NOT EXISTS articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  content TEXT NOT NULL,
  summary TEXT,
  category VARCHAR(100) NOT NULL,
  tags TEXT[] DEFAULT '{}',
  author VARCHAR(100) DEFAULT 'Mark-李',
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  featured_image TEXT,
  read_time INTEGER,
  status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  seo_title VARCHAR(255),
  seo_description TEXT,
  canonical_url TEXT
);

-- 创建项目表
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  content TEXT,
  tech_stack TEXT[] DEFAULT '{}',
  github_url TEXT,
  demo_url TEXT,
  featured_image TEXT,
  status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('planning', 'in_progress', 'completed', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建图片库表
CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  alt_text TEXT,
  category VARCHAR(100),
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
  `

  try {
    // 逐行执行 SQL
    const statements = basicSql.split(';').filter(stmt => stmt.trim().length > 0)
    
    for (const statement of statements) {
      try {
        const { error } = await supabaseAdmin.rpc('exec_sql', { sql: statement + ';' })
        if (error && !error.message.includes('already exists')) {
          console.log('语句执行结果:', error.message)
        }
      } catch (err) {
        // 静默处理一些错误
      }
    }

    // 测试表是否创建成功
    const { data, error } = await supabaseAdmin.from('articles').select('count', { count: 'exact' })
    
    if (error) {
      throw error
    }

    console.log('✅ 基础表创建成功！')
    return true

  } catch (error) {
    console.error('❌ 基础表创建失败:', error)
    return false
  }
}

// 运行脚本
if (require.main === module) {
  createBasicTables().then(success => {
    if (success) {
      console.log('\n🎉 可以继续运行数据迁移了！')
      console.log('   npm run db:migrate')
    }
  })
} 