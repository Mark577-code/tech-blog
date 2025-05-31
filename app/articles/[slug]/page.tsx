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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatContent = (content: string) => {
    // 简单的 Markdown 渲染（可以后续替换为更强大的 Markdown 解析器）
    return content
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold mt-8 mb-4">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-semibold mt-8 mb-4">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mt-8 mb-4">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm font-mono">$1</code>')
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-muted p-4 rounded-lg overflow-x-auto my-4"><code class="font-mono text-sm">$1</code></pre>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/\n/g, '<br/>')
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded mb-4"></div>
            <div className="h-4 bg-muted rounded mb-2"></div>
            <div className="h-4 bg-muted rounded mb-8"></div>
            <div className="h-64 bg-muted rounded mb-8"></div>
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-4 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!article) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* 返回按钮 */}
        <div className="mb-6">
          <Link href="/articles">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              返回文章列表
            </Button>
          </Link>
        </div>

        {/* 文章头部 */}
        <article className="mb-12">
          <header className="mb-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Badge variant="outline">
                {categoryLabels[article.category] || article.category}
              </Badge>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(article.createdAt)}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{article.readingTime} 分钟阅读</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{article.author}</span>
              </div>
            </div>

            <h1 className="text-4xl font-bold mb-4 leading-tight">
              {article.title}
            </h1>

            <p className="text-xl text-muted-foreground mb-6">
              {article.excerpt}
            </p>

            {article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {article.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* 文章统计 */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground border-b pb-6">
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{article.viewCount} 次浏览</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                <span>{article.likes} 个赞</span>
              </div>
            </div>
          </header>

          {/* 特色图片 */}
          {article.featuredImage && (
            <div className="relative w-full h-64 md:h-96 mb-8">
              <Image
                src={article.featuredImage}
                alt={article.title}
                fill
                className="object-cover rounded-lg"
                priority
              />
            </div>
          )}

          {/* 文章内容 */}
          <div className="prose prose-lg max-w-none">
            <div 
              className="text-foreground leading-relaxed"
              dangerouslySetInnerHTML={{ 
                __html: `<p class="mb-4">${formatContent(article.content)}</p>` 
              }}
            />
          </div>
        </article>

        {/* 相关文章 */}
        {relatedArticles.length > 0 && (
          <section className="border-t pt-12">
            <h2 className="text-2xl font-bold mb-6">相关文章</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((relatedArticle) => (
                <Card key={relatedArticle.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <Link href={`/articles/${relatedArticle.slug}`}>
                      {relatedArticle.featuredImage && (
                        <div className="relative w-full h-32 mb-3">
                          <Image
                            src={relatedArticle.featuredImage}
                            alt={relatedArticle.title}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                      )}
                      <h3 className="font-semibold mb-2 line-clamp-2 hover:text-primary transition-colors">
                        {relatedArticle.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {relatedArticle.excerpt}
                      </p>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(relatedArticle.createdAt)}
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
} 