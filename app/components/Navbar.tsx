"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useTheme } from "@/contexts/theme-context"
import { useLanguage } from "@/contexts/language-context"
import { Moon, Sun, Languages, Home, FileText, Briefcase, User, Music, Github, ChevronDown } from "lucide-react"
import SearchBar from "./SearchBar"
import type { Category } from "@/types/category"

const Navbar = () => {
  const { theme, toggleTheme } = useTheme()
  const { t, toggleLanguage } = useLanguage()
  const [categories, setCategories] = useState<Category[]>([])
  const [showArticleDropdown, setShowArticleDropdown] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setCategories(data.data)
          }
        }
      } catch (error) {
        console.error('获取分类失败:', error)
      }
    }

    fetchCategories()
  }, [])

  // 监听滚动，判断是否显示侧边栏
  useEffect(() => {
    if (!mounted) return

    const handleScroll = () => {
      const scrollY = window.scrollY
      const viewportHeight = window.innerHeight
      // 当滚动超过首页区域50%时显示侧边栏（适应70vh的首页高度）
      setShowSidebar(scrollY > viewportHeight * 0.5)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [mounted])

  return (
    <>
      {/* 主导航栏 */}
      <nav className="fixed top-0 left-0 right-0 z-30">
        <div className="container mx-auto flex justify-between items-center px-2 py-4 gradient-window">
          <Link href="/" className="text-2xl font-bold ml-12 md:ml-0">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Mark-李的博客
            </span>
          </Link>

          <ul className="hidden md:flex space-x-6">
            <li>
              <Link href="/" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Home className="h-4 w-4" />
                {t("nav.home")}
              </Link>
            </li>
            <li className="relative">
              <button
                className="flex items-center gap-2 hover:text-primary transition-colors"
                onMouseEnter={() => setShowArticleDropdown(true)}
                onMouseLeave={() => setShowArticleDropdown(false)}
              >
                <FileText className="h-4 w-4" />
                {t("nav.articles")}
                <ChevronDown className="h-3 w-3" />
              </button>
              {/* 下拉菜单 */}
              {showArticleDropdown && (
                <div 
                  className="absolute top-full left-0 mt-2 w-48 bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg py-2 z-50"
                  onMouseEnter={() => setShowArticleDropdown(true)}
                  onMouseLeave={() => setShowArticleDropdown(false)}
                >
                  <Link href="/articles" className="block p-4 hover:bg-muted text-sm">
                    全部文章
                  </Link>
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/category/${category.slug}`}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-muted text-sm"
                    >
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </li>
            <li>
              <Link href="/portfolio" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Briefcase className="h-4 w-4" />
                {t("nav.portfolio")}
              </Link>
            </li>
            <li>
              <Link href="/about" className="flex items-center gap-2 hover:text-primary transition-colors">
                <User className="h-4 w-4" />
                关于
              </Link>
            </li>
          </ul>

          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <SearchBar />
            </div>

            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-background/50 rounded-full"
              aria-label={t("theme.toggle")}
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <button
              onClick={toggleLanguage}
              className="p-2 hover:bg-background/50 rounded-full"
              aria-label={t("language.toggle")}
            >
              <Languages className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* 左侧个人信息卡片 - 只在文章区域显示 */}
      {showSidebar && (
        <div className="fixed left-2 top-1/2 transform -translate-y-1/2 w-56 bg-background/95 backdrop-blur-sm border rounded-2xl shadow-lg z-40 hidden lg:block transition-all duration-300">
          <div className="p-6">
            {/* 个人介绍 */}
            <div className="text-center mb-4">
              <div className="w-16 h-16 rounded-full border-2 border-primary/20 overflow-hidden mx-auto mb-3 bg-primary/10">
                <img 
                  src="/头像.png" 
                  alt="Mark-李"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // 如果图片加载失败，尝试其他头像路径
                    const target = e.target as HTMLImageElement
                    if (target.src.includes('头像.png')) {
                      target.src = '/avatar.svg'
                    } else if (target.src.includes('avatar.svg')) {
                      target.src = '/placeholder.svg'
                    } else {
                      // 最后备选，显示默认图标
                      target.style.display = 'none'
                      const fallback = target.nextElementSibling as HTMLElement
                      if (fallback) fallback.style.display = 'flex'
                    }
                  }}
                />
                <div className="w-full h-full bg-primary/20 flex items-center justify-center" style={{display: 'none'}}>
                  <User className="h-7 w-7 text-primary" />
                </div>
              </div>
              <h3 className="font-semibold text-lg mb-2">Mark-李</h3>
              <p className="text-sm text-muted-foreground mb-4">
                技术爱好者和软件开发者
              </p>
              
              {/* 社交链接 - 横向展示 */}
              <div className="flex justify-center gap-4 mb-4">
                <a
                  href="https://music.163.com/#/user/home?id=1857158786"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                  title="网易云音乐"
                >
                  <Music className="h-5 w-5 text-red-500" />
                </a>
                <a
                  href="https://github.com/Mark577-code"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                  title="GitHub"
                >
                  <Github className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                </a>
              </div>
              
              {/* 邮箱文字 - 增加显示空间 */}
              <div className="bg-muted/50 rounded-lg p-3 mb-4">
                <p className="text-xs text-muted-foreground break-all">
                  a3449322892@gmail.com
                </p>
              </div>
            </div>

            {/* Live2D 容器 */}
            <div className="flex justify-center">
              <div id="live2d-container" className="w-28 h-28 relative" style={{zIndex: 99999}}>
                {/* Live2D 将在这里渲染 */}
              </div>
            </div>
          </div>
        </div>
      )}

    </>
  )
}

export default Navbar
