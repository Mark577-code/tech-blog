"use client"

import { useState, useEffect, useRef } from "react"
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
import type { Category } from "@/types/category"

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [latestArticles, setLatestArticles] = useState<Article[]>([])
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([])
  const [featuredImages, setFeaturedImages] = useState<GalleryImage[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [scrollY, setScrollY] = useState(0)
  const { t } = useLanguage()
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // 并行获取所有数据，包括分类
        const [articlesRes, projectsRes, imagesRes, categoriesRes] = await Promise.all([
          fetch('/api/articles?status=published&limit=3&sortBy=createdAt&sortOrder=desc'),
          fetch('/api/projects?status=published&featured=true&limit=4&sortBy=updatedAt&sortOrder=desc'),
          fetch('/api/gallery?featured=true&limit=5&sortBy=order&sortOrder=asc'),
          fetch('/api/categories?isVisible=true&sortBy=order&sortOrder=asc')
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

        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json()
          if (categoriesData.success) {
            setCategories(categoriesData.data.categories)
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

  // 滚动视差效果
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 自动轮播
  useEffect(() => {
    if (featuredImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % featuredImages.length)
      }, 5000)
      return () => clearInterval(interval)
    }
    // 添加返回值以确保所有代码路径都有返回值
    return () => {}
  }, [featuredImages.length])

  const nextSlide = (): void => {
    setCurrentSlide((prev) => (prev + 1) % featuredImages.length)
  }

  const prevSlide = (): void => {
    setCurrentSlide((prev) => (prev - 1 + featuredImages.length) % featuredImages.length)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  
  // 根据图片分类决定跳转链接
  const getImageLink = (image: GalleryImage): string => {
    // 根据分类判断跳转目标
    const categoryToRoute: Record<string, string> = {
      technology: "/articles",
      ai: "/articles", 
      data: "/portfolio",
      cloud: "/portfolio",
      mobile: "/portfolio",
      photography: "/photography",
      nature: "/photography",
      portrait: "/photography"
    }
    
    return categoryToRoute[image.category] || "/photography"
  }

  // 获取分类显示名称
  const getCategoryLabel = (slug: string): string => {
    const category = categories.find(cat => cat.slug === slug)
    return category ? category.name : slug
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse space-y-8">
          <div className="h-[400px] bg-muted rounded-lg mb-12 animate-scale-in"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="h-8 bg-muted rounded w-48 animate-slide-in-left"></div>
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-muted rounded animate-fade-in-up" style={{animationDelay: `${i * 0.1}s`}}></div>
              ))}
            </div>
            <div className="space-y-6">
              <div className="h-8 bg-muted rounded w-48 animate-slide-in-right"></div>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-square bg-muted rounded animate-scale-in" style={{animationDelay: `${i * 0.15}s`}}></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* 滚动进度条 */}
      <div 
        className="scroll-progress"
        style={{ 
          width: `${Math.min((scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100, 100)}%` 
        }}
      />

      <div ref={contentRef} className="container mx-auto mt-8 relative">
        {/* Hero Slider - 动态图片轮播 */}
        {featuredImages.length > 0 && (
          <div className="mb-12 relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden group">
            {/* 视差背景 */}
            <div 
              className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 z-[1]"
              style={{
                transform: `translateY(${scrollY * 0.5}px)`
              }}
            />
            
            {featuredImages.map((image, index) => {
              const isActive = index === currentSlide
              const linkUrl = getImageLink(image)
              
              return (
                <div
                  key={image.id}
                  className={`absolute inset-0 transition-all duration-1000 ${
                    isActive ? "opacity-100 scale-100" : "opacity-0 scale-105"
                  }`}
                >
                  {/* 整个区域都是可点击的链接 */}
                  <Link href={linkUrl} className="block w-full h-full relative">
                    <Image
                      src={image.url}
                      alt={image.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      priority={isActive}
                    />
                    
                    {/* 文字遮罩层 */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                    
                    {/* 文字内容 */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 lg:p-10 z-[2]">
                      <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 md:mb-3">
                          {image.title}
                        </h2>
                        {image.description && (
                          <p className="text-sm md:text-base lg:text-lg text-white/90 mb-3 md:mb-4">
                            {image.description}
                          </p>
                        )}
                        <Badge className="inline-flex items-center bg-white/20 text-white border-white/30 backdrop-blur-sm hover:bg-white/30 transition-all">
                          {image.category === 'technology' || image.category === 'ai' ? '查看技术文章 →' : 
                           image.category === 'data' || image.category === 'cloud' || image.category === 'mobile' ? '查看项目作品 →' : 
                           '查看摄影作品 →'}
                        </Badge>
                      </div>
                    </div>
                  </Link>
                </div>
              )
            })}
            
            {featuredImages.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-4 md:left-6 top-1/2 transform -translate-y-1/2 glassmorphism text-white p-2 md:p-3 rounded-full opacity-75 hover:opacity-100 transition-all hover-lift z-20"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 md:right-6 top-1/2 transform -translate-y-1/2 glassmorphism text-white p-2 md:p-3 rounded-full opacity-75 hover:opacity-100 transition-all hover-lift z-20"
                  aria-label="Next slide"
                >
                  <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
                </button>
                
                {/* 轮播指示器 */}
                <div className="absolute bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 md:space-x-3 z-20">
                  {featuredImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                        index === currentSlide 
                          ? 'bg-white scale-125' 
                          : 'bg-white/50 hover:bg-white/75'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Latest Articles - 动态文章 */}
          <section 
            className="animate-slide-in-left"
            style={{
              transform: `translateY(${scrollY * 0.1}px)`
            }}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold gradient-text">{t("latest.articles")}</h2>
              <Link href="/articles" className="text-primary hover:underline transition-colors">
                {t("view.all")}
              </Link>
            </div>
            <div className="space-y-6">
              {latestArticles.length > 0 ? (
                latestArticles.map((article, index) => (
                  <Card key={article.id} className="interactive-card hover-lift animate-fade-in-up" style={{animationDelay: `${index * 0.1}s`}}>
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
                            {getCategoryLabel(article.category)}
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
                <Card className="animate-fade-in-up">
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">暂无发布的文章</p>
                    <Link href="/admin/login" className="text-primary hover:underline mt-2 inline-block transition-colors">
                      去发布第一篇文章 →
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          </section>

          {/* Featured Projects - 动态项目 */}
          <section 
            className="animate-slide-in-right"
            style={{
              transform: `translateY(${scrollY * 0.15}px)`
            }}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold gradient-text">{t("featured.projects")}</h2>
              <Link href="/portfolio" className="text-primary hover:underline transition-colors">
                {t("view.all")}
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {featuredProjects.length > 0 ? (
                featuredProjects.map((project, index) => (
                  <Card key={project.id} className="group interactive-card hover-lift animate-scale-in" style={{animationDelay: `${index * 0.15}s`}}>
                    <CardContent className="p-6">
                      <Link href={`/portfolio/${project.id}`} className="block">
                        <div className="flex items-start gap-4">
                          {project.featuredImage && (
                            <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-lg image-overlay">
                              <Image
                                src={project.featuredImage}
                                alt={project.title}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-110"
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
                                {getCategoryLabel(project.category)}
                              </Badge>
                              {project.technologies.slice(0, 2).map((tech) => (
                                <Badge key={tech} variant="secondary" className="text-xs">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </Link>
                      {/* 外部链接按钮区域 */}
                      <div className="flex items-center gap-2 mt-4 pt-2 border-t">
                        {project.demoUrl && (
                          <Button size="sm" variant="outline" className="hover-lift" asChild>
                            <a 
                              href={project.demoUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              演示
                            </a>
                          </Button>
                        )}
                        {project.githubUrl && (
                          <Button size="sm" variant="outline" className="hover-lift" asChild>
                            <a 
                              href={project.githubUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Github className="h-3 w-3 mr-1" />
                              代码
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="animate-fade-in-up">
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">暂无精选项目</p>
                    <Link href="/admin/login" className="text-primary hover:underline mt-2 inline-block transition-colors">
                      去添加第一个项目 →
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
