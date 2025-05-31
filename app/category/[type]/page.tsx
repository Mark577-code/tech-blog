"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/language-context"
import CategoryIcon from "../../components/CategoryIcon"
import type { Category } from "@/types/category"
import type { Article } from "@/types/article"

export default function CategoryPage() {
  const { type } = useParams()
  const { t } = useLanguage()
  const [category, setCategory] = useState<Category | null>(null)
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategoryAndArticles = async () => {
      try {
        setLoading(true)
        
        // 获取分类信息
        const categoryResponse = await fetch('/api/categories?isVisible=true&sortBy=order&sortOrder=asc')
        if (categoryResponse.ok) {
          const categoryData = await categoryResponse.json()
          if (categoryData.success) {
            const foundCategory = categoryData.data.categories.find((cat: Category) => cat.slug === type)
            setCategory(foundCategory || null)
          }
        }

        // 获取该分类下的文章
        const articlesResponse = await fetch(`/api/articles?status=published&category=${type}&sortBy=createdAt&sortOrder=desc`)
        if (articlesResponse.ok) {
          const articlesData = await articlesResponse.json()
          if (articlesData.success) {
            setArticles(articlesData.data.articles || [])
          }
        }
      } catch (error) {
        console.error('获取数据失败:', error)
      } finally {
        setLoading(false)
      }
    }

    if (type) {
      fetchCategoryAndArticles()
    }
  }, [type])

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-muted animate-pulse rounded-lg"></div>
          <div>
            <div className="h-8 w-32 bg-muted animate-pulse rounded mb-2"></div>
            <div className="h-4 w-48 bg-muted animate-pulse rounded"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="aspect-video bg-muted animate-pulse rounded-lg mb-4"></div>
                <div className="h-6 bg-muted animate-pulse rounded mb-2"></div>
                <div className="h-4 bg-muted animate-pulse rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">分类不存在</h1>
        <p className="text-muted-foreground">您访问的分类不存在或已被隐藏。</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-8">
        <div 
          className="w-16 h-16 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: category.color + '20', color: category.color }}
        >
          <CategoryIcon iconName={category.icon} className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
          {category.description && (
            <p className="text-muted-foreground">{category.description}</p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline">{articles.length} 篇文章</Badge>
          </div>
        </div>
      </div>

      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Card key={article.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                {article.featuredImage && (
                  <div className="relative aspect-video mb-4 overflow-hidden rounded-lg">
                    <Image
                      src={article.featuredImage}
                      alt={article.title}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <Link href={`/articles/${article.slug}`}>
                  <h3 className="font-semibold hover:text-primary transition-colors line-clamp-2 mb-2">
                    {article.title}
                  </h3>
                </Link>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                  {article.excerpt || article.content.substring(0, 100) + '...'}
                </p>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{new Date(article.createdAt).toLocaleDateString('zh-CN')}</span>
                  <div className="flex items-center gap-2">
                    <span>{article.viewCount} 浏览</span>
                    <span>{article.likes} 点赞</span>
                  </div>
                </div>
                {article.tags && article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {article.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <CategoryIcon iconName={category.icon} className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">暂无文章</h3>
            <p className="text-muted-foreground">这个分类下还没有发布的文章。</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
