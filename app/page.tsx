"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Clock, Calendar, BookOpen, Eye, Heart, ChevronDown } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Article } from "@/types/article"
import type { Category } from "@/types/category"

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [scrollY, setScrollY] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [mounted, setMounted] = useState(false)
  const { t } = useLanguage()

  const fullText = "世界很大，不妨去看看"

  // 确保组件已挂载（客户端渲染）
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // 获取文章和分类数据
        const [articlesRes, categoriesRes] = await Promise.all([
          fetch('/api/articles?status=published&limit=12&sortBy=createdAt&sortOrder=desc'),
          fetch('/api/categories?isVisible=true&sortBy=order&sortOrder=asc')
        ])

        if (articlesRes.ok) {
          const articlesData = await articlesRes.json()
          if (articlesData.success) {
            setArticles(articlesData.data.articles)
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

  // 滚动效果 - 只在客户端执行
  useEffect(() => {
    if (!mounted) return
    
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [mounted])

  // 逐字动画效果
  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + fullText[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, 300) // 每300ms显示一个字

      return () => clearTimeout(timer)
    } else {
      // 文字显示完成后，延迟2秒重新开始
      const resetTimer = setTimeout(() => {
        setDisplayText("")
        setCurrentIndex(0)
      }, 3000)

      return () => clearTimeout(resetTimer)
    }
  }, [currentIndex, fullText])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // 获取分类显示名称
  const getCategoryLabel = (slug: string): string => {
    const category = categories.find(cat => cat.slug === slug)
    return category ? category.name : slug
  }

  // 获取分类颜色
  const getCategoryColor = (slug: string): string => {
    const category = categories.find(cat => cat.slug === slug)
    return category ? category.color : '#3b82f6'
  }

  // 计算滚动进度 - 安全的方式
  const getScrollProgress = () => {
    if (!mounted || typeof window === 'undefined') return 0
    const scrollTop = scrollY
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    return Math.min((scrollTop / docHeight) * 100, 100)
  }

  if (!mounted) {
    return null // 避免SSR不匹配
  }

  return (
    <div className="relative">
      {/* 滚动进度条 */}
      <div 
        className="scroll-progress"
        style={{ 
          width: `${getScrollProgress()}%`
        }}
      />

            {/* 首页主体 - 动态文字展示区域 */}
      <div className="h-[70vh] w-full flex items-center justify-center bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10 relative">
        <div className="text-center px-2">
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold gradient-text mb-6 min-h-[1.2em]">
            {displayText}
            <span className="animate-pulse">|</span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground mb-6">
            记录生活，分享技术，探索世界
          </p>
        </div>
        
        {/* 向下滚动提示 */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center gap-1 text-muted-foreground">
            <span className="text-sm">向下滚动查看更多</span>
            <ChevronDown className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* 文章内容区域 */}
      <div className="container mx-auto px-2 lg:px-4 lg:ml-60 pt-8 pb-8 relative max-w-none lg:max-w-[calc(100%-15rem)]">
        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">加载中...</p>
          </div>
        ) : (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold gradient-text flex items-center gap-2">
                <BookOpen className="h-8 w-8 text-primary" />
                最新文章
              </h2>
              <Button variant="ghost" className="group" asChild>
                <Link href="/articles">
                  查看全部
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
              </Button>
          </div>

            {articles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article, index) => (
                  <Card 
                    key={article.id} 
                    className="group interactive-card hover-lift animate-fade-in-up hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20" 
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    <CardContent className="p-0">
                      <Link href={`/articles/${article.slug}`} className="block">
                        {/* 文章图片 */}
                        {article.featuredImage && (
                          <div className="relative w-full h-40 overflow-hidden rounded-t-lg">
                    <Image
                              src={article.featuredImage || "/placeholder.svg"}
                              alt={article.title}
                                fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              priority={index < 6}
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          )}
                        
                        <div className="p-4 space-y-3">
                          {/* 分类和元信息 */}
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge 
                              variant="secondary" 
                              className="border"
                              style={{ 
                                borderColor: getCategoryColor(article.category),
                                color: getCategoryColor(article.category)
                              }}
                            >
                              <div 
                                className="w-2 h-2 rounded-full mr-2"
                                style={{ backgroundColor: getCategoryColor(article.category) }}
                              />
                              {getCategoryLabel(article.category)}
                        </Badge>
                            <span>•</span>
                            <span>{formatDate(article.createdAt)}</span>
                            </div>
                          
                          {/* 文章标题 */}
                          <h3 className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors">
                            {article.title}
                          </h3>
                          
                          {/* 文章摘要 */}
                          <p className="text-muted-foreground line-clamp-3 leading-relaxed">
                            {article.excerpt}
                          </p>

                          {/* 文章标签 */}
                          {article.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {article.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  #{tag}
                                </Badge>
                              ))}
                              {article.tags.length > 3 && (
                                <span className="text-xs text-muted-foreground">+{article.tags.length - 3}</span>
                              )}
                            </div>
                          )}

                          {/* 文章统计 */}
                          <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{article.readingTime} 分钟</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                <span>{article.viewCount}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Heart className="h-4 w-4" />
                                <span>{article.likes}</span>
                              </div>
                            </div>
                            <span className="text-primary font-medium group-hover:translate-x-1 transition-transform">
                              阅读 →
                            </span>
                          </div>
                        </div>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
              ) : (
              <div className="text-center py-16">
                <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-muted-foreground mb-2">暂无文章</h3>
                <p className="text-muted-foreground">还没有发布任何文章，请稍后再来查看。</p>
              </div>
              )}
        </section>
        )}
      </div>
    </div>
  )
}
