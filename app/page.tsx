"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Star, ExternalLink, Github } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Article } from "@/types/article"
import type { Project } from "@/types/project"
import type { GalleryImage } from "@/types/gallery"

const categoryLabels: Record<string, string> = {
  programming: "编程技术",
  photography: "摄影分享", 
  tutorial: "文字教程",
  project: "项目展示",
  web: "Web开发",
  ai: "人工智能",
  miniprogram: "小程序",
  visualization: "数据可视化"
}

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [latestArticles, setLatestArticles] = useState<Article[]>([])
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([])
  const [featuredImages, setFeaturedImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const { t } = useLanguage()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // 并行获取所有数据
        const [articlesRes, projectsRes, imagesRes] = await Promise.all([
          fetch('/api/articles?status=published&limit=3&sortBy=createdAt&sortOrder=desc'),
          fetch('/api/projects?status=published&featured=true&limit=4&sortBy=updatedAt&sortOrder=desc'),
          fetch('/api/gallery?featured=true&limit=5&sortBy=order&sortOrder=asc')
        ])

        if (articlesRes.ok) {
          const articlesData = await articlesRes.json()
          if (articlesData.success) {
            setLatestArticles(articlesData.data.articles)
          }
        }

        if (projectsRes.ok) {
          const projectsData = await projectsRes.json()
          if (projectsData.success) {
            setFeaturedProjects(projectsData.data.projects)
          }
        }

        if (imagesRes.ok) {
          const imagesData = await imagesRes.json()
          if (imagesData.success) {
            setFeaturedImages(imagesData.data.images)
          }
        }
      } catch (error) {
        console.error('获取首页数据失败:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredImages.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredImages.length) % featuredImages.length)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto mt-8">
        <div className="animate-pulse">
          <div className="h-[400px] bg-muted rounded-lg mb-12"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="h-8 bg-muted rounded w-48"></div>
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
            <div className="space-y-6">
              <div className="h-8 bg-muted rounded w-48"></div>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-square bg-muted rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto mt-8">
      {/* Hero Slider - 动态图片轮播 */}
      {featuredImages.length > 0 && (
        <div className="mb-12 relative h-[400px] rounded-lg overflow-hidden">
          {featuredImages.map((image, index) => (
            <div
              key={image.id}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={image.url}
                alt={image.title}
                fill
                className="object-cover"
                priority={index === currentSlide}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/80 to-transparent p-6">
                <h2 className="text-3xl font-bold text-foreground">{image.title}</h2>
                {image.description && (
                  <p className="text-lg text-foreground/80 mt-2">{image.description}</p>
                )}
              </div>
            </div>
          ))}
          
          {featuredImages.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-background/50 text-foreground p-2 rounded-full opacity-75 hover:opacity-100 transition-opacity"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-background/50 text-foreground p-2 rounded-full opacity-75 hover:opacity-100 transition-opacity"
                aria-label="Next slide"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
              
              {/* 轮播指示器 */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {featuredImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentSlide ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Latest Articles - 动态文章 */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{t("latest.articles")}</h2>
            <Link href="/articles" className="text-primary hover:underline">
              {t("view.all")}
            </Link>
          </div>
          <div className="space-y-6">
            {latestArticles.length > 0 ? (
              latestArticles.map((article) => (
                <Card key={article.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <Link href={`/articles/${article.slug}`} className="block space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold hover:text-primary transition-colors line-clamp-2">
                            {article.title}
                          </h3>
                          <p className="text-muted-foreground mt-2 line-clamp-3">
                            {article.excerpt}
                          </p>
                        </div>
                        <Badge variant="secondary" className="ml-4 flex-shrink-0">
                          {categoryLabels[article.category] || article.category}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{article.readingTime}分钟阅读</span>
                        <span>{formatDate(article.createdAt)}</span>
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">暂无发布的文章</p>
                  <Link href="/admin/login" className="text-primary hover:underline mt-2 inline-block">
                    去发布第一篇文章 →
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* Featured Projects - 动态项目 */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{t("featured.projects")}</h2>
            <Link href="/portfolio" className="text-primary hover:underline">
              {t("view.all")}
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {featuredProjects.length > 0 ? (
              featuredProjects.map((project) => (
                <Card key={project.id} className="group hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {project.featuredImage && (
                        <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-lg">
                          <Image
                            src={project.featuredImage}
                            alt={project.title}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-1">
                            {project.title}
                          </h3>
                          {project.featured && (
                            <Badge className="bg-primary ml-2 flex-shrink-0">
                              <Star className="h-3 w-3 mr-1" />
                              精选
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {project.description}
                        </p>
                        <div className="flex items-center gap-2 mt-3">
                          <Badge variant="outline" className="text-xs">
                            {categoryLabels[project.category] || project.category}
                          </Badge>
                          {project.technologies.slice(0, 2).map((tech) => (
                            <Badge key={tech} variant="secondary" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                          {project.demoUrl && (
                            <Button size="sm" variant="outline" asChild>
                              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3 mr-1" />
                                演示
                              </a>
                            </Button>
                          )}
                          {project.githubUrl && (
                            <Button size="sm" variant="outline" asChild>
                              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                <Github className="h-3 w-3 mr-1" />
                                代码
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">暂无精选项目</p>
                  <Link href="/admin/login" className="text-primary hover:underline mt-2 inline-block">
                    去添加第一个项目 →
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
