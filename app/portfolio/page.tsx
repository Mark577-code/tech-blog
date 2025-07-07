'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/language-context'
import Image from 'next/image'
import Link from 'next/link'
import { Github, Globe } from 'lucide-react'
import type { Project } from '@/types/project'

export default function Portfolio() {
  const { t } = useLanguage()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/projects')
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setProjects(data.data)
          }
        }
      } catch (error) {
        console.error('获取项目失败:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">作品集</h1>
      
      {loading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">加载中...</p>
        </div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <div className="relative h-48">
              <Image
                src={project.featuredImage || "/placeholder.svg"}
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
                {project.technologies.map((tech: string) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              
              <div className="flex gap-4">
                {project.githubUrl && (
                  <Link
                    href={project.githubUrl}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                    target="_blank"
                  >
                    <Github className="h-5 w-5" />
                    <span>GitHub</span>
                  </Link>
                )}
                {project.demoUrl && (
                  <Link
                    href={project.demoUrl}
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
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground">暂无项目</p>
        </div>
      )}
    </div>
  )
}
