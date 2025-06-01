"use client"

import { useState, useEffect } from 'react'
import { useParams, notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, Calendar, Clock, User, Eye, Heart } from 'lucide-react'
import type { Article } from '@/types/article'

const categoryLabels: Record<string, string> = {
  programming: "编程技术",
  photography: "摄影分享", 
  tutorial: "文字教程",
  project: "项目展示"
}

export default function ArticleDetailPage() {
  const { slug } = useParams()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([])
  const [scrollY, setScrollY] = useState(0)
  const [readingProgress, setReadingProgress] = useState(0)

  useEffect(() => {
    if (!slug) return

    const fetchArticle = async () => {
      try {
        setLoading(true)
        
        // 获取当前文章
        const articleResponse = await fetch(`/api/articles/slug/${slug}`)
        if (articleResponse.status === 404) {
          notFound()
          return
        }
        
        if (articleResponse.ok) {
          const articleData = await articleResponse.json()
          if (articleData.success) {
            setArticle(articleData.data)
            
            // 获取相关文章（同分类的其他文章）
            const relatedResponse = await fetch(`/api/articles?status=published&category=${articleData.data.category}&limit=4`)
            if (relatedResponse.ok) {
              const relatedData = await relatedResponse.json()
              if (relatedData.success) {
                // 排除当前文章，只显示其他文章
                const related = relatedData.data.articles
                  .filter((a: Article) => a.id !== articleData.data.id)
                  .slice(0, 3)
                setRelatedArticles(related)
              }
            }
          } else {
            notFound()
          }
        } else {
          notFound()
        }
      } catch (error) {
        console.error('获取文章失败:', error)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    fetchArticle()
  }, [slug])

  // 滚动效果
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (scrollTop / docHeight) * 100
      
      setScrollY(scrollTop)
      setReadingProgress(Math.min(progress, 100))
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatContent = (content: string) => {
    // 简单的段落处理
    return content
      .split('\n')
      .filter(line => line.trim())
      .map((paragraph, index) => `
        <p class="mb-6 text-lg leading-relaxed ${index === 0 ? 'text-xl font-medium' : ''} animate-fade-in-up" style="animation-delay: ${index * 0.1}s">
          ${paragraph}
        </p>
      `)
      .join('')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse space-y-8 max-w-4xl w-full p-8">
          <div className="h-12 bg-muted rounded w-3/4 animate-fade-in-up"></div>
          <div className="h-64 bg-muted rounded animate-scale-in"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-4 bg-muted rounded animate-slide-in-left" style={{animationDelay: `${i * 0.1}s`}}></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!article) {
    return null
  }

  return (
    <div className="relative">
      {/* 阅读进度条 */}
      <div 
        className="scroll-progress"
        style={{ width: `${readingProgress}%` }}
      />

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
        {/* 返回按钮 - 浮动位置 */}
        <div className="fixed top-24 left-6 z-50">
          <Button
            variant="outline"
            size="sm"
            className="glassmorphism hover-lift"
            asChild
          >
            <Link href="/articles">
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回文章列表
            </Link>
          </Button>
        </div>

        <div className="container mx-auto px-4 py-8">
          <article className="max-w-4xl mx-auto">
            {/* 文章头部 */}
            <header className="mb-12 text-center animate-fade-in-up">
              <div className="mb-6">
                <Badge variant="secondary" className="mb-4">
                  {categoryLabels[article.category] || article.category}
                </Badge>
                <h1 className="text-5xl font-bold mb-6 gradient-text heading-responsive">
                  {article.title}
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto text-responsive">
                  {article.excerpt}
                </p>
              </div>

              {/* 文章元信息 */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground mb-8 animate-slide-in-left">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{article.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(article.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{article.readingTime} 分钟阅读</span>
                </div>
              </div>

              {/* 文章标签 */}
              {article.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center mb-8 animate-slide-in-right">
                  {article.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="hover-lift">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* 文章统计 */}
              <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground border-b pb-8 mb-8 animate-fade-in-up">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>{article.viewCount} 次浏览</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  <span>{article.likes} 个赞</span>
                </div>
              </div>
            </header>

            {/* 特色图片 */}
            {article.featuredImage && (
              <div 
                className="relative w-full h-96 mb-12 rounded-2xl overflow-hidden image-overlay animate-scale-in"
                style={{
                  transform: `translateY(${scrollY * 0.1}px)`
                }}
              >
                <Image
                  src={article.featuredImage}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  priority
                />
              </div>
            )}

            {/* 文章内容 */}
            <div 
              className="prose prose-lg max-w-none"
              style={{
                transform: `translateY(${scrollY * 0.05}px)`
              }}
            >
              <div 
                className="text-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ 
                  __html: formatContent(article.content)
                }}
              />
            </div>
          </article>

          {/* 相关文章 */}
          {relatedArticles.length > 0 && (
            <section 
              className="mt-20 animate-fade-in-up"
              style={{
                transform: `translateY(${scrollY * 0.03}px)`
              }}
            >
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-12 gradient-text">
                  相关文章推荐
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {relatedArticles.map((relatedArticle, index) => (
                    <Card 
                      key={relatedArticle.id} 
                      className="interactive-card hover-lift animate-slide-in-left"
                      style={{animationDelay: `${index * 0.2}s`}}
                    >
                      <CardContent className="p-6">
                        <Link href={`/articles/${relatedArticle.slug}`} className="block space-y-4">
                          {relatedArticle.featuredImage && (
                            <div className="relative w-full h-48 rounded-lg overflow-hidden image-overlay">
                              <Image
                                src={relatedArticle.featuredImage}
                                alt={relatedArticle.title}
                                fill
                                className="object-cover transition-transform duration-300 hover:scale-110"
                              />
                            </div>
                          )}
                          <div>
                            <Badge variant="secondary" className="mb-2">
                              {categoryLabels[relatedArticle.category] || relatedArticle.category}
                            </Badge>
                            <h3 className="font-semibold text-lg hover:text-primary transition-colors line-clamp-2 mb-2">
                              {relatedArticle.title}
                            </h3>
                            <p className="text-muted-foreground text-sm line-clamp-3">
                              {relatedArticle.excerpt}
                            </p>
                          </div>
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>{relatedArticle.readingTime}分钟阅读</span>
                            <span>{formatDate(relatedArticle.createdAt)}</span>
                          </div>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
} 