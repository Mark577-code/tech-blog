"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import CategoryIcon from "./CategoryIcon"
import type { Category } from "@/types/category"

const Sidebar = () => {
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  // 获取分类数据
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories?isVisible=true&sortBy=order&sortOrder=asc')
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setCategories(data.data.categories)
          }
        }
      } catch (error) {
        console.error('获取分类失败:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const SidebarContent = () => (
    <div className="h-full p-6 flex flex-col">
      <div className="flex flex-col items-center mb-8">
        <div className="relative w-32 h-32 mb-4">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%E5%A4%B4%E5%83%8F.jpg-ANZJC9BH6qbqBv36jUxwYoQMnmugBo.jpeg"
            alt="Profile"
            fill
            priority
            sizes="(max-width: 768px) 128px, 128px"
            className="rounded-full border-4 border-primary object-cover"
          />
        </div>
        <h2 className="text-xl font-bold mb-2 text-primary">Mark</h2>
        <p className="text-sm text-muted-foreground text-center">{t("profile.description")}</p>
      </div>

      <div className="flex-1">
        <h3 className="text-lg font-semibold mb-4 text-primary">{t("categories")}</h3>
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-muted animate-pulse rounded-lg"></div>
            ))}
          </div>
        ) : (
          <nav>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/category/${category.slug}`}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors group"
                    onClick={() => setIsOpen(false)}
                    style={{
                      '--category-color': category.color
                    } as React.CSSProperties}
                  >
                    <div
                      className="flex items-center justify-center w-6 h-6 rounded-lg transition-colors group-hover:text-white"
                      style={{ 
                        backgroundColor: category.color + '20',
                        color: category.color
                      }}
                    >
                      <CategoryIcon iconName={category.icon} className="h-4 w-4" />
                    </div>
                    <span className="font-medium">{category.name}</span>
                    {category.articleCount > 0 && (
                      <span className="ml-auto text-xs bg-muted px-2 py-1 rounded-full">
                        {category.articleCount}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </div>
  )

  // Mobile sidebar
  const MobileSidebar = () => (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className="fixed top-4 left-4 z-50 p-2 text-primary md:hidden">
          <Menu className="h-6 w-6" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] p-0 bg-background/95 backdrop-blur-lg">
        <SidebarContent />
      </SheetContent>
    </Sheet>
  )

  return (
    <>
      <MobileSidebar />
      <aside className="hidden md:block fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 gradient-window">
        <SidebarContent />
      </aside>
    </>
  )
}

export default Sidebar
