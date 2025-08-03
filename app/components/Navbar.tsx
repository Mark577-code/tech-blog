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
                  className="absolute top-full left-0 mt-2 w-48 bg-background/85 backdrop-blur-sm border rounded-lg shadow-lg py-2 z-50"
                  onMouseEnter={() => setShowArticleDropdown(true)}
                  onMouseLeave={() => setShowArticleDropdown(false)}
                >
                  <Link href="/blog" className="block p-4 hover:bg-muted text-sm">
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



    </>
  )
}

export default Navbar
