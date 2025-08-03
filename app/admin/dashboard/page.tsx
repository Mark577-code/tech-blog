'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  PlusCircle, Edit, Trash2, Eye, Save, X, RefreshCw, Calendar, User, Clock, 
  LogOut, Shield, FileText, ExternalLink, Copy, Check 
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import MarkdownEditor from '@/components/MarkdownEditor'

interface AdminUser {
  id: string
  username: string
  role: string
}

interface Article {
  id: string
  title: string
  slug: string
  content: string
  summary: string
  category: string
  tags: string[]
  status: 'draft' | 'published' | 'archived'
  author: string
  featured_image?: string
  read_time: number
  created_at: string
  updated_at: string
  published_at: string
}

const categories = [
  { value: 'programming', label: '编程技术' },
  { value: 'photography', label: '摄影分享' },
  { value: 'tutorial', label: '文字教程' },
  { value: 'project', label: '项目展示' }
]

export default function AdminDashboard() {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const router = useRouter()

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    summary: '',
    category: 'programming',
    tags: '',
    status: 'published' as 'draft' | 'published' | 'archived',
    featured_image: ''
  })

  // 检查认证状态
  useEffect(() => {
    checkAuth()
  }, [])

  // 加载文章数据
  useEffect(() => {
    if (user) {
      loadArticles()
    }
  }, [user])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/me')
      const result = await response.json()
      
      if (result.success) {
        setUser(result.user)
      } else {
        router.push('/admin/login')
      }
    } catch (error) {
      router.push('/admin/login')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/login', { method: 'DELETE' })
      toast.success('已退出登录')
      router.push('/admin/login')
    } catch (error) {
      toast.error('退出登录失败')
    }
  }

  const loadArticles = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/articles?status=all&limit=50')
      const result = await response.json()
      
      if (result.success) {
        setArticles(result.data || [])
      } else {
        toast.error(`加载文章失败: ${result.error}`)
      }
    } catch (error) {
      toast.error('网络错误，无法加载文章')
      console.error('加载文章失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const createArticle = async () => {
    if (!formData.title || !formData.content) {
      toast.error('请填写标题和内容')
      return
    }

    try {
      setLoading(true)
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          summary: formData.summary,
          category: formData.category,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
          status: formData.status,
          featured_image: formData.featured_image
        })
      })

      const result = await response.json()
      
      if (result.success) {
        toast.success('文章创建成功！')
        resetForm()
        setDialogOpen(false)
        await loadArticles()
      } else {
        // 特殊处理重复错误
        if (result.code === 'DUPLICATE_SLUG') {
          toast.error('文章标题重复，请修改标题后重试')
        } else {
          toast.error(result.error || '创建文章失败')
        }
        console.error('创建文章失败:', result)
      }
    } catch (error) {
      toast.error('网络错误，请检查网络连接')
      console.error('创建文章网络错误:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateArticle = async () => {
    if (!editingArticle || !formData.title || !formData.content) {
      toast.error('请填写标题和内容')
      return
    }

    try {
      setLoading(true)
      const response = await fetch('/api/articles', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingArticle.id,
          title: formData.title,
          content: formData.content,
          summary: formData.summary,
          category: formData.category,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
          status: formData.status,
          featured_image: formData.featured_image
        })
      })

      const result = await response.json()
      
      if (result.success) {
        toast.success('文章更新成功！')
        resetForm()
        setDialogOpen(false)
        await loadArticles()
      } else {
        toast.error(`更新失败: ${result.error}`)
      }
    } catch (error) {
      toast.error('网络错误，更新失败')
    } finally {
      setLoading(false)
    }
  }

  const deleteArticle = async (id: string) => {
    if (!confirm('确定要删除这篇文章吗？此操作不可撤销！')) {
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`/api/articles?id=${id}`, {
        method: 'DELETE'
      })

      const result = await response.json()
      
      if (result.success) {
        toast.success('文章删除成功！')
        await loadArticles()
      } else {
        toast.error(`删除失败: ${result.error}`)
      }
    } catch (error) {
      toast.error('网络错误，删除失败')
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (article: Article) => {
    setEditingArticle(article)
    setFormData({
      title: article.title,
      content: article.content,
      summary: article.summary,
      category: article.category,
      tags: article.tags.join(', '),
      status: article.status,
      featured_image: article.featured_image || ''
    })
    setIsCreating(false)
    setDialogOpen(true)
  }

  const startCreate = () => {
    resetForm()
    setIsCreating(true)
    setDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      summary: '',
      category: 'programming',
      tags: '',
      status: 'published',
      featured_image: ''
    })
    setIsCreating(false)
    setEditingArticle(null)
  }

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      toast.success('已复制到剪贴板')
      setTimeout(() => setCopiedId(null), 2000)
    } catch (error) {
      toast.error('复制失败')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* 顶部导航栏 */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Shield className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-bold">管理员面板</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                欢迎, {user?.username}
              </span>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/" target="_blank">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  查看网站
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                退出登录
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">总文章数</p>
                  <p className="text-2xl font-bold">{articles.length}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">已发布</p>
                  <p className="text-2xl font-bold text-green-600">
                    {articles.filter(a => a.status === 'published').length}
                  </p>
                </div>
                <Eye className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">草稿</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {articles.filter(a => a.status === 'draft').length}
                  </p>
                </div>
                <Edit className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">已归档</p>
                  <p className="text-2xl font-bold text-gray-600">
                    {articles.filter(a => a.status === 'archived').length}
                  </p>
                </div>
                <Trash2 className="h-8 w-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 文章管理 */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                文章管理
              </CardTitle>
              <div className="flex gap-2">
                <Button onClick={loadArticles} disabled={loading} variant="outline" size="sm">
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  刷新
                </Button>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" onClick={startCreate}>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      新建文章
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editingArticle ? '编辑文章' : '创建新文章'}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">标题 *</Label>
                          <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            placeholder="输入文章标题"
                            disabled={loading}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="category">分类</Label>
                          <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})} disabled={loading}>
                            <SelectTrigger>
                              <SelectValue placeholder="选择分类" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((cat) => (
                                <SelectItem key={cat.value} value={cat.value}>
                                  {cat.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="summary">摘要</Label>
                        <Textarea
                          id="summary"
                          value={formData.summary}
                          onChange={(e) => setFormData({...formData, summary: e.target.value})}
                          placeholder="文章摘要（可选，不填写将自动生成）"
                          rows={3}
                          disabled={loading}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="content">内容 (支持 Markdown) *</Label>
                        <MarkdownEditor
                          value={formData.content}
                          onChange={(value) => setFormData({...formData, content: value})}
                          placeholder="输入文章内容，支持 Markdown 语法..."
                          height={400}
                          disabled={loading}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="tags">标签</Label>
                          <Input
                            id="tags"
                            value={formData.tags}
                            onChange={(e) => setFormData({...formData, tags: e.target.value})}
                            placeholder="标签1, 标签2, 标签3"
                            disabled={loading}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="status">状态</Label>
                          <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value as 'draft' | 'published' | 'archived'})} disabled={loading}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="draft">草稿</SelectItem>
                              <SelectItem value="published">发布</SelectItem>
                              <SelectItem value="archived">归档</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="featured_image">特色图片 URL</Label>
                        <Input
                          id="featured_image"
                          value={formData.featured_image}
                          onChange={(e) => setFormData({...formData, featured_image: e.target.value})}
                          placeholder="https://example.com/image.jpg"
                          disabled={loading}
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          onClick={editingArticle ? updateArticle : createArticle}
                          disabled={loading || !formData.title || !formData.content}
                        >
                          {loading ? (
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Save className="h-4 w-4 mr-2" />
                          )}
                          {editingArticle ? '更新文章' : '创建文章'}
                        </Button>
                        <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={loading}>
                          <X className="h-4 w-4 mr-2" />
                          取消
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {loading && articles.length === 0 ? (
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">加载中...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {articles.map((article) => (
                  <div key={article.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{article.title}</h3>
                          <Badge variant={article.status === 'published' ? 'default' : article.status === 'draft' ? 'secondary' : 'outline'}>
                            {article.status === 'published' ? '已发布' : article.status === 'draft' ? '草稿' : '已归档'}
                          </Badge>
                        </div>
                        
                        <div className="flex gap-4 text-sm text-muted-foreground mb-2">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {article.author}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(article.created_at)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {article.read_time}分钟阅读
                          </div>
                        </div>
                        
                        <div className="flex gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {categories.find(c => c.value === article.category)?.label}
                          </Badge>
                          {article.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {article.summary}
                        </p>
                        
                        {/* 文章链接和复制功能 */}
                        <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                          <span>文章链接:</span>
                          <code className="bg-muted px-2 py-1 rounded text-xs">
                            /articles/{article.slug}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => copyToClipboard(`${window.location.origin}/articles/${article.slug}`, article.id)}
                          >
                            {copiedId === article.id ? (
                              <Check className="h-3 w-3 text-green-500" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex gap-1 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startEdit(article)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <Link href={`/articles/${article.slug}`} target="_blank">
                            <Eye className="h-3 w-3" />
                          </Link>
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteArticle(article.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {articles.length === 0 && !loading && (
                  <div className="text-center py-8">
                    <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">暂无文章，点击"新建文章"开始创作吧！</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
} 