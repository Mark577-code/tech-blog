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
import Live2D from "@/app/components/Live2D"

export default function BlogHome() {
  const [articles, setArticles] = useState<Article[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [scrollY, setScrollY] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [mounted, setMounted] = useState(false)
  const { language } = useLanguage()

  const texts = [
    "世界很大，不妨去看看",
    "分享技术见解，记录成长历程",
    "探索无限可能的技术世界",
    "让代码改变世界",
  ]

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    let currentTextIndex = 0
    let currentCharIndex = 0
    let isDeleting = false
    
    const typeSpeed = 100
    const deleteSpeed = 50
    const pauseTime = 2000

    const typewriter = () => {
      const currentText = texts[currentTextIndex]
      if (!currentText) return
      
      if (isDeleting) {
        setDisplayText(currentText.substring(0, currentCharIndex - 1))
        currentCharIndex--
        
        if (currentCharIndex === 0) {
          isDeleting = false
          currentTextIndex = (currentTextIndex + 1) % texts.length
          setTimeout(typewriter, 500)
        } else {
          setTimeout(typewriter, deleteSpeed)
        }
      } else {
        setDisplayText(currentText.substring(0, currentCharIndex + 1))
        currentCharIndex++
        
        if (currentCharIndex === currentText.length) {
          isDeleting = true
          setTimeout(typewriter, pauseTime)
        } else {
          setTimeout(typewriter, typeSpeed)
        }
      }
    }

    typewriter()
  }, [mounted])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // 获取文章数据
        const articlesResponse = await fetch('/api/articles?status=published&limit=12&sortBy=created_at&sortOrder=desc')
        const articlesResult = await articlesResponse.json()
        
        // 获取分类数据
        const categoriesResponse = await fetch('/api/categories?isVisible=true&sortBy=order&sortOrder=asc')
        const categoriesResult = await categoriesResponse.json()
        
        if (articlesResult.success) {
          setArticles(articlesResult.data || [])
        }
        
        if (categoriesResult.success) {
          setCategories(categoriesResult.data || [])
        }
      } catch (error) {
        console.error('获取数据失败:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const getCategoryName = (categorySlug: string) => {
    const category = categories.find(cat => cat.slug === categorySlug)
    return category?.name || categorySlug
  }

  return (
    <div className="min-h-screen relative">
      {/* 背景装饰 */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800"></div>
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      
      {/* 滚动进度条 */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform origin-left scale-x-0 transition-transform duration-300 z-50" 
           style={{ 
             transform: typeof window !== 'undefined' && document.documentElement ? 
               `scaleX(${scrollY / (document.documentElement.scrollHeight - window.innerHeight)})` : 
               'scaleX(0)' 
           }}></div>
      
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-16 max-w-7xl">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center space-x-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                <p className="text-xl text-gray-600 dark:text-gray-400 font-medium">精彩内容加载中...</p>
              </div>
            </div>
          ) : (
            <>
              {/* 个人信息栏 */}
              <section className="mb-16">
                <div className="max-w-4xl mx-auto">
                  <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/30 dark:border-gray-700/30 p-8 md:p-12">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      {/* 头像 */}
                      <div className="flex-shrink-0">
                        <div className="relative">
                          <Image
                            src="/头像.png"
                            alt="Mark-李"
                            width={120}
                            height={120}
                            className="rounded-full ring-4 ring-blue-500/20 shadow-2xl"
                            priority
                          />
                          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full ring-4 ring-white dark:ring-gray-800 flex items-center justify-center">
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                          </div>
                        </div>
                      </div>

                      {/* 个人信息 */}
                      <div className="flex-1 text-center md:text-left">
                        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                          Mark-李
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                          技术爱好者和软件开发者
                        </p>
                        
                        {/* 社交链接 */}
                        <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                            </svg>
                            <span>a344932892@gmail.com</span>
                          </div>
                        </div>

                        {/* 统计数据 */}
                        <div className="grid grid-cols-3 gap-6 text-center">
                          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4">
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                              {articles.length}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">文章</div>
                          </div>
                          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-4">
                            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                              {categories.length}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">分类</div>
                          </div>
                          <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-4">
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                              {articles.reduce((total, article) => total + (article.read_time || 0), 0)}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">分钟</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 最新文章 */}
              <section className="mb-20">
                <div className="text-center mb-12">
                  <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4">
                    最新文章
                  </h2>
                  <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    探索最新的技术趋势和深度思考
                  </p>
                  
                  {/* 分类标签 */}
                  <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto mt-8">
                    {categories.slice(0, 8).map((category, index) => (
                      <Link
                        key={category.id}
                        href={`/category/${category.slug}`}
                        className="group px-6 py-3 bg-white/50 dark:bg-gray-800/50 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-gray-200/30 dark:border-gray-700/30 hover:border-blue-300 dark:hover:border-blue-600"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <span className="text-gray-700 dark:text-gray-300 font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {category.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>

                {articles.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-none">
                    {articles.map((article, index) => (
                      <Card 
                        key={article.id} 
                        className="group h-full bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                        style={{ animationDelay: `${index * 150}ms` }}
                      >
                        <CardContent className="p-0 h-full flex flex-col">
                          <Link href={`/articles/${article.slug}`} className="flex flex-col h-full">
                            {article.featured_image && (
                              <div className="relative h-56 overflow-hidden">
                                <Image
                                  src={article.featured_image}
                                  alt={article.title}
                                  fill
                                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                                <div className="absolute top-4 left-4">
                                  <Badge variant="secondary" className="bg-white/70 text-gray-800 font-medium">
                                    {getCategoryName(article.category)}
                                  </Badge>
                                </div>
                              </div>
                            )}
                            
                            <div className="p-6 flex-1 flex flex-col">
                              <div className="flex items-center gap-3 mb-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {article.read_time}分钟阅读
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {new Date(article.published_at || article.created_at).toLocaleDateString('zh-CN')}
                                </span>
                              </div>
                              
                              <h3 className="text-xl font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-3 line-clamp-2 leading-tight">
                                {article.title}
                              </h3>
                              
                              <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4 flex-1 leading-relaxed">
                                {article.summary}
                              </p>
                              
                              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <Eye className="h-3 w-3" />
                                    {Math.floor(Math.random() * 1000) + 100}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Heart className="h-3 w-3" />
                                    {Math.floor(Math.random() * 50) + 10}
                                  </span>
                                </div>
                                <span className="text-blue-600 dark:text-blue-400 font-medium group-hover:translate-x-1 transition-transform text-sm">
                                  阅读更多 →
                                </span>
                              </div>
                            </div>
                          </Link>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-white/30 dark:bg-gray-800/30 rounded-3xl backdrop-blur-sm">
                    <BookOpen className="h-20 w-20 text-gray-400 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-2">暂无文章</h3>
                    <p className="text-gray-500 dark:text-gray-500 text-lg">精彩内容正在准备中，请稍后再来查看</p>
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </div>
      
      {/* Live2D 看板娘 */}
      <Live2D />
      
      {/* Live2D 容器和提示 */}
      <div className="fixed bottom-4 left-4 z-50 group">
        <div className="bg-gray-800/70 backdrop-blur-sm text-white px-3 py-2 rounded-lg shadow-xl text-sm mb-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 whitespace-nowrap">
          记得把小家加入收藏夹呢！
          <div className="absolute bottom-0 left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-800/70 transform translate-y-full"></div>
        </div>
        <div 
          id="live2d-container" 
          className="w-28 h-28 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full backdrop-blur-sm border border-white/10 flex items-center justify-center shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-110"
        >
          {/* Live2D会被动态注入到这里 */}
        </div>
      </div>
    </div>
  )
} 