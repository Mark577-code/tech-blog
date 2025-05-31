"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search } from 'lucide-react'
import type { Article } from '@/types/article'

const categoryLabels: Record<string, string> = {
  programming: "编程技术",
  photography: "摄影分享", 
  tutorial: "文字教程",
  project: "项目展示"
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchArticles()
  }, [searchTerm, selectedCategory, page])

  const fetchArticles = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        status: 'published',
        page: page.toString(),
        limit: '6',
        sortBy: 'createdAt',
        sortOrder: 'desc'
      })

      if (searchTerm) {
        params.set('search', searchTerm)
      }
      
      if (selectedCategory !== 'all') {
        params.set('category', selectedCategory)
      }

      const response = await fetch(`/api/articles?${params}`)
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setArticles(data.data.articles)
          setTotalPages(data.data.pagination.totalPages)
        }
      }
    } catch (error) {
      console.error('获取文章失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">文章列表</h1>
      
      {/* 搜索和筛选 */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索文章..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="选择分类" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">所有分类</SelectItem>
            {Object.entries(categoryLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 文章列表 */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">加载中...</p>
        </div>
      ) : articles.length > 0 ? (
        <div className="grid gap-6">
          {articles.map((article) => (
            <Card key={article.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <Link href={`/articles/${article.slug}`} className="block">
                  <div className="flex flex-col md:flex-row">
                    {article.featuredImage && (
                      <div className="relative w-full md:w-64 h-48">
                        <Image
                          src={article.featuredImage || "/placeholder.svg"}
                          alt={article.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="p-6 flex-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Badge variant="outline">
                          {categoryLabels[article.category] || article.category}
                        </Badge>
                        <span>•</span>
                        <span>{formatDate(article.createdAt)}</span>
                        <span>•</span>
                        <span>{article.readingTime} 分钟阅读</span>
                      </div>
                      
                      <h2 className="text-2xl font-bold mb-2 text-foreground hover:text-primary transition-colors">
                        {article.title}
                      </h2>
                      
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {article.excerpt}
                      </p>

                      {article.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {article.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                          {article.tags.length > 3 && (
                            <span className="text-xs text-muted-foreground">+{article.tags.length - 3}</span>
                          )}
                        </div>
                      )}
                      
                      <span className="text-primary font-medium">
                        阅读全文 →
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
          <p className="text-muted-foreground mb-4">
            {searchTerm || selectedCategory !== 'all' ? '没有找到符合条件的文章' : '暂无发布的文章'}
          </p>
          <Link href="/admin/login" className="text-primary hover:underline">
            去发布第一篇文章 →
          </Link>
        </div>
      )}

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            上一页
          </button>
          <span className="px-4 py-2">
            第 {page} 页，共 {totalPages} 页
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            下一页
          </button>
        </div>
      )}
    </div>
  )
}
