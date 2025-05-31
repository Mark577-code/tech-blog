'use client'

import { useLanguage } from '@/contexts/language-context'
import Image from 'next/image'
import Link from 'next/link'
import { Github, Globe } from 'lucide-react'

const projects = [
  {
    id: 1,
    title: '个人技术博客',
    description: '使用 Next.js 和 Tailwind CSS 构建的个人博客网站，支持暗色模式和国际化。',
    image: '/placeholder.svg',
    tags: ['Next.js', 'React', 'Tailwind CSS'],
    github: 'https://github.com/yourusername/tech-blog',
    demo: 'https://your-blog-url.com'
  },
  {
    id: 2,
    title: 'AI 聊天助手',
    description: '基于 OpenAI API 开发的智能聊天助手，支持自然语言交互和多轮对话。',
    image: '/placeholder.svg',
    tags: ['Python', 'OpenAI', 'FastAPI'],
    github: 'https://github.com/yourusername/ai-chat',
  },
  {
    id: 3,
    title: '微信小程序商城',
    description: '完整的电商微信小程序解决方案，包含商品展示、购物车、订单管理等功能。',
    image: '/placeholder.svg',
    tags: ['微信小程序', 'Node.js', 'MongoDB'],
    github: 'https://github.com/yourusername/wx-mall',
  },
  {
    id: 4,
    title: '数据可视化平台',
    description: '企业级数据可视化解决方案，支持多种图表类型和实时数据更新。',
    image: '/placeholder.svg',
    tags: ['Vue.js', 'ECharts', 'Express'],
    github: 'https://github.com/yourusername/data-vis',
    demo: 'https://your-vis-demo.com'
  }
]

export default function Portfolio() {
  const { t } = useLanguage()

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">作品集</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <div className="relative h-48">
              <Image
                src={project.image || "/placeholder.svg"}
                alt={project.title}
                fill
                className="object-cover"
              />
            </div>
            
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
              <p className="text-muted-foreground mb-4">{project.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="flex gap-4">
                {project.github && (
                  <Link
                    href={project.github}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                    target="_blank"
                  >
                    <Github className="h-5 w-5" />
                    <span>GitHub</span>
                  </Link>
                )}
                {project.demo && (
                  <Link
                    href={project.demo}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                    target="_blank"
                  >
                    <Globe className="h-5 w-5" />
                    <span>{t('portfolio.visit')}</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
