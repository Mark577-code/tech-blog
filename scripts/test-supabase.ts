#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'
import * as fs from 'fs'

// 手动加载环境变量
const envPath = path.join(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath })
  console.log('✅ 已加载 .env.local 文件')
} else {
  console.log('❌ .env.local 文件不存在，请先创建环境变量文件')
}

async function testSupabaseConnection() {
  console.log('🔧 测试 Supabase 连接...')
  
  // 检查环境变量
  console.log('\n📋 环境变量检查:')
  const supabaseUrl = process.env['NEXT_PUBLIC_SUPABASE_URL']
  const supabaseAnonKey = process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY']
  const supabaseServiceKey = process.env['SUPABASE_SERVICE_ROLE_KEY']
  
  console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ 已设置' : '❌ 未设置')
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ 已设置' : '❌ 未设置')
  console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅ 已设置' : '❌ 未设置')

  if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
    console.log('\n❌ 环境变量缺失，请检查 .env.local 文件配置')
    return
  }

  // 创建客户端实例
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  try {
    // 测试基本连接
    console.log('\n🌐 测试基本连接...')
    const { data, error } = await supabase.from('articles').select('count', { count: 'exact' })
    
    if (error) {
      console.error('❌ 基本连接失败:', error)
      
      if (error.code === '42P01') {
        console.log('\n📋 表不存在，需要先创建数据库表！')
        console.log('请按以下步骤操作：')
        console.log('1. 登录 Supabase 控制台: https://app.supabase.io')
        console.log('2. 选择你的项目')
        console.log('3. 进入 SQL Editor')
        console.log('4. 执行 database/schema.sql 中的所有 SQL 语句')
        console.log('5. 再次运行此测试脚本')
        return
      }
      
      throw error
    }
    
    console.log('✅ 基本连接成功')
    console.log('📊 当前文章数量:', data?.length || 0)

    // 测试管理员权限
    console.log('\n👤 测试管理员权限...')
    const { data: adminData, error: adminError } = await supabaseAdmin
      .from('articles')
      .select('count', { count: 'exact' })
    
    if (adminError) {
      console.error('❌ 管理员权限测试失败:', adminError)
      throw adminError
    }
    
    console.log('✅ 管理员权限正常')

    // 测试表结构
    console.log('\n🏗️  检查表结构...')
    const tables = ['articles', 'categories', 'tags', 'projects', 'gallery_images', 'images']
    
    for (const table of tables) {
      try {
        const { data, error } = await supabaseAdmin
          .from(table)
          .select('*')
          .limit(1)
        
        if (error) {
          console.log(`❌ 表 ${table} 访问失败:`, error.message)
        } else {
          console.log(`✅ 表 ${table} 访问正常`)
        }
      } catch (err) {
        console.log(`❌ 表 ${table} 访问失败:`, err)
      }
    }

    console.log('\n🎉 Supabase 连接测试完成！')
    console.log('\n📝 下一步：运行数据迁移脚本')
    console.log('   npm run db:migrate')

  } catch (error) {
    console.error('\n💥 Supabase 连接测试失败:', error)
    console.log('\n🔍 可能的解决方案:')
    console.log('1. 检查网络连接')
    console.log('2. 验证 Supabase 项目是否正常运行')
    console.log('3. 确认环境变量配置正确')
    console.log('4. 检查 Supabase 项目的 API 设置')
    console.log('5. 确认数据库表已创建（运行 database/schema.sql）')
  }
}

// 运行测试
if (require.main === module) {
  testSupabaseConnection()
} 