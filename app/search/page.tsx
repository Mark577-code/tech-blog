"use client"

import { Suspense, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Calendar, Eye, Heart } from "lucide-react"
import Loading from "@/components/loading"
import type { Article } from "@/types/article"

// 搜索API函数
const searchAPI = async (query: string): Promise<Article[]> => {
  if (!query.trim()) return []
  
  try {
    const response = await fetch(`/api/articles?search=${encodeURIComponent(query)}&status=published&limit=20`)
    if (response.ok) {
      const data = await response.json()
      return data.success ? data.data.articles : []
    }
  } catch (error) {
    console.error('搜索失败:', error)
  }
  return []
}

function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [results, setResults] = useState<Article[]>([])
  const [loading, setLoading] = useState(false)
  const [searchInput, setSearchInput] = useState(query)

  useEffect(() => {
    if (query) {
      performSearch(query)
    }
  }, [query])

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setLoading(true)
    try {
      const searchResults = await searchAPI(searchQuery)
      setResults(searchResults)
    } catch (error) {
      console.error('搜索出错:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      window.history.pushState({}, '', `/search?q=${encodeURIComponent(searchInput)}`)
      performSearch(searchInput)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* 搜索表单 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6 text-center">搜索文章</h1>
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="输入关键词搜索文章..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "搜索中..." : "搜索"}
          </Button>
        </form>
      </div>

      {/* 搜索结果 */}
      {query && (
        <>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-muted-foreground">
              搜索 "{query}" 的结果 {!loading && `(${results.length} 篇文章)`}
            </h2>
          </div>

          {loading ? (
            <Loading />
          ) : results.length > 0 ? (
            <div className="grid gap-6">
              {results.map((article) => (
                <Card key={article.id} className="card-hover">
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      {article.featuredImage && (
                        <div className="relative w-48 h-32 flex-shrink-0 overflow-hidden rounded-lg">
                          <Image
                            src={article.featuredImage}
                            alt={article.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <Link href={`/articles/${article.slug}`}>
                          <h3 className="text-xl font-semibold hover:text-primary transition-colors line-clamp-2 mb-3">
                            {article.title}
                          </h3>
                        </Link>
                        <p className="text-muted-foreground line-clamp-3 mb-4">
                          {article.excerpt || article.content.substring(0, 200) + '...'}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(article.createdAt).toLocaleDateString('zh-CN')}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{article.viewCount} 浏览</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            <span>{article.likes} 点赞</span>
                          </div>
                        </div>
                        {article.tags && article.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {article.tags.slice(0, 4).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">没有找到相关文章</h3>
                <p className="text-muted-foreground mb-4">
                  尝试使用不同的关键词或者浏览分类查看更多内容
                </p>
                <div className="flex justify-center gap-2">
                  <Link href="/articles">
                    <Button variant="outline">浏览所有文章</Button>
                  </Link>
                  <Link href="/">
                    <Button variant="outline">返回首页</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {!query && (
        <Card>
          <CardContent className="p-8 text-center">
            <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">开始搜索</h3>
            <p className="text-muted-foreground">
              在上方输入关键词来搜索相关文章
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<Loading />}>
      <SearchContent />
    </Suspense>
  )
}
