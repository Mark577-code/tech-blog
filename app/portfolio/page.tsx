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
    image: '/placeholder.png',
    tags: ['Next.js', 'React', 'Tailwind CSS'],
    github: 'https://github.com/Mark577-code/tech-blog',
    demo: 'https://github.com/Mark577-code/tech-blog'
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
                sizes="(max-width: 768px) 100vw, 50vw"
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
