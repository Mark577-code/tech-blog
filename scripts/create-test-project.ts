import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// 手动加载 .env.local 文件
dotenv.config({ path: '.env.local' })

console.log('✅ 已加载 .env.local 文件')

// 直接从环境变量获取配置
const supabaseUrl = process.env['NEXT_PUBLIC_SUPABASE_URL']!
const supabaseServiceKey = process.env['SUPABASE_SERVICE_ROLE_KEY']!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ 缺少必需的环境变量')
  process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// 测试项目数据
const testProjects = [
  {
    title: '个人技术博客',
    slug: 'tech-blog',
    description: '基于 Next.js 和 Supabase 构建的现代化博客系统，支持文章管理、分类标签、响应式设计等功能。',
    content: '# 个人技术博客\n\n这是一个现代化的博客系统，采用了最新的技术栈：\n\n- **前端**: Next.js 15 + TypeScript\n- **数据库**: Supabase (PostgreSQL)\n- **UI**: Tailwind CSS + shadcn/ui\n- **部署**: Vercel\n\n## 主要功能\n\n- 文章增删查改\n- 分类和标签管理\n- 响应式设计\n- SEO 优化\n- 图片管理\n- 评论系统',
    tech_stack: ['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS', 'Vercel'],
    github_url: 'https://github.com/username/tech-blog',
    demo_url: 'https://tech-blog.vercel.app',
    featured_image: '/placeholder.svg',
    status: 'completed'
  },
  {
    title: 'React 任务管理应用',
    slug: 'react-todo-app',
    description: '一个功能完整的任务管理应用，支持任务创建、编辑、删除、分类和搜索功能。',
    content: '# React 任务管理应用\n\n这是一个基于 React 的任务管理应用，提供了完整的任务管理功能。\n\n## 技术特性\n\n- React Hooks 状态管理\n- 本地存储持久化\n- 拖拽排序功能\n- 响应式界面设计\n- 任务分类和优先级\n- 搜索和筛选',
    tech_stack: ['React', 'JavaScript', 'CSS3', 'HTML5', 'Local Storage'],
    github_url: 'https://github.com/username/react-todo',
    demo_url: 'https://react-todo-demo.netlify.app',
    featured_image: '/placeholder.svg',
    status: 'completed'
  },
  {
    title: 'Vue 电商项目',
    slug: 'vue-ecommerce',
    description: '基于 Vue.js 的电商平台前端，包含商品展示、购物车、用户认证等功能。',
    content: '# Vue 电商项目\n\n一个现代化的电商平台前端，提供了完整的购物体验。\n\n## 主要功能\n\n- 商品浏览和搜索\n- 购物车管理\n- 用户注册和登录\n- 订单管理\n- 支付集成\n- 响应式设计\n\n## 技术栈\n\n- Vue 3 + Composition API\n- Vue Router\n- Vuex/Pinia\n- Element Plus\n- Axios',
    tech_stack: ['Vue.js', 'Vuex', 'Vue Router', 'Element Plus', 'Axios'],
    github_url: 'https://github.com/username/vue-ecommerce',
    demo_url: 'https://vue-ecommerce-demo.netlify.app',
    featured_image: '/placeholder.svg',
    status: 'in_progress'
  }
]

async function createTestProjects() {
  try {
    console.log('🚀 开始创建测试项目...')

    for (const project of testProjects) {
      console.log(`📝 创建项目: ${project.title}`)
      
      const { data, error } = await supabaseAdmin
        .from('projects')
        .insert(project)
        .select()
        .single()

      if (error) {
        console.error(`❌ 创建项目失败: ${project.title}`, error)
      } else {
        console.log(`✅ 项目创建成功: ${project.title}`)
      }
    }

    console.log('\n🎉 测试项目创建完成！')
    console.log('📱 现在可以访问项目页面查看效果：http://localhost:3000/portfolio')

  } catch (error) {
    console.error('❌ 创建测试项目失败:', error)
  }
}

createTestProjects() 