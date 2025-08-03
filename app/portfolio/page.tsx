'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/language-context'
import Image from 'next/image'
import Link from 'next/link'
import { Github, Globe } from 'lucide-react'

// 定义项目接口，与数据库字段保持一致
interface Project {
  id: string
  title: string
  slug: string
  description: string
  content?: string
  tech_stack: string[]  // 使用数据库中的字段名
  github_url?: string
  demo_url?: string
  featured_image?: string
  status: string
  created_at: string
  updated_at: string
}

export default function Portfolio() {
  const { t } = useLanguage()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/projects?status=completed')
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setProjects(data.data || [])
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
                src={project.featured_image || "/placeholder.svg"}
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
                {/* 添加防护逻辑，确保 tech_stack 存在且是数组 */}
                {(project.tech_stack && Array.isArray(project.tech_stack) ? project.tech_stack : []).map((tech: string) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              
              <div className="flex gap-4">
                {project.github_url && (
                  <Link
                    href={project.github_url}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                    target="_blank"
                  >
                    <Github className="h-5 w-5" />
                    <span>GitHub</span>
                  </Link>
                )}
                {project.demo_url && (
                  <Link
                    href={project.demo_url}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                    target="_blank"
                  >
                    <Globe className="h-5 w-5" />
                    <span>访问项目</span>
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
