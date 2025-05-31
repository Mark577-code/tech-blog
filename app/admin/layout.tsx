'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { LayoutDashboard, FileText, ImageIcon, FolderKanban, LogOut, Hash } from 'lucide-react'

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      // 如果是登录页面，直接显示
      if (pathname === '/admin/login') {
        setIsAuthenticated(false)
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include',
        })
        
        if (response.ok) {
          setIsAuthenticated(true)
        } else {
          setIsAuthenticated(false)
          router.push('/admin/login')
        }
      } catch (error) {
        console.error('认证检查失败:', error)
        setIsAuthenticated(false)
        router.push('/admin/login')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [pathname, router])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
    } catch (error) {
      console.error('退出登录失败:', error)
    } finally {
      router.push('/admin/login')
      router.refresh()
    }
  }

  // 如果正在加载，显示加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p>验证身份中...</p>
        </div>
      </div>
    )
  }

  // 如果是登录页面或未认证，直接显示子组件
  if (!isAuthenticated || pathname === '/admin/login') {
    return <>{children}</>
  }

  const menuItems = [
    { icon: LayoutDashboard, label: '控制台', path: '/admin/dashboard' },
    { icon: FileText, label: '文章管理', path: '/admin/articles' },
    { icon: FolderKanban, label: '项目管理', path: '/admin/projects' },
    { icon: ImageIcon, label: '图片管理', path: '/admin/images' },
    { icon: Hash, label: '分类管理', path: '/admin/categories' },
  ]

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-card border-r">
        <div className="p-6">
          <h1 className="text-xl font-bold text-primary">管理后台</h1>
        </div>
        <nav className="px-4 py-2">
          {menuItems.map((item) => (
            <a
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg mb-1 transition-colors ${
                pathname === item.path
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-destructive hover:bg-destructive/10 w-full transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>退出登录</span>
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6 bg-background">
        {children}
      </main>
    </div>
  )
}

export default AdminLayout
