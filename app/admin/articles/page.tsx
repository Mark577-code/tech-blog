"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Pencil, Trash, X, Eye } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import type { Article, CreateArticleData } from "@/types/article"

const categories = [
  { value: "programming", label: "编程技术" },
  { value: "photography", label: "摄影分享" },
  { value: "tutorial", label: "文字教程" },
  { value: "project", label: "项目展示" },
]

interface ArticleFormData {
  title: string
  content: string
  excerpt: string
  category: string
  tags: string[]
  status: 'draft' | 'published'
  featuredImage: string
}

const defaultFormData: ArticleFormData = {
  title: "",
  content: "",
  excerpt: "",
  category: "programming",
  tags: [],
  status: "draft",
  featuredImage: ""
}

export default function ArticlesManagement() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<ArticleFormData>(defaultFormData)
  const [tagInput, setTagInput] = useState("")

  // 获取文章列表
  const fetchArticles = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/articles?status=all&limit=50')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setArticles(data.data.articles)
        }
      }
    } catch (error) {
      console.error('获取文章失败:', error)
      toast.error('获取文章失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchArticles()
  }, [])

  // 保存文章
  const handleSave = async () => {
    try {
      if (!formData.title.trim()) {
        toast.error("请输入文章标题")
        return
      }

      if (!formData.content.trim()) {
        toast.error("请输入文章内容")
        return
      }

      const articleData: CreateArticleData = {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        tags: formData.tags,
        status: formData.status,
        ...(formData.excerpt.trim() && { excerpt: formData.excerpt }),
        ...(formData.featuredImage.trim() && { featuredImage: formData.featuredImage })
      }

      let response
      if (editingId) {
        // 更新文章
        response = await fetch(`/api/articles/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ id: editingId, ...articleData }),
        })
      } else {
        // 创建新文章
        response = await fetch('/api/articles', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(articleData),
        })
      }

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          toast.success(editingId ? '文章更新成功' : '文章创建成功')
          setIsEditing(false)
          setEditingId(null)
          setFormData(defaultFormData)
          fetchArticles() // 重新获取文章列表
        } else {
          toast.error(data.message || '操作失败')
        }
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || '操作失败')
      }
    } catch (error) {
      console.error('保存失败:', error)
      toast.error('保存失败')
    }
  }

  // 删除文章
  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这篇文章吗？')) {
      return
    }

    try {
      const response = await fetch(`/api/articles/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          toast.success('文章删除成功')
          fetchArticles()
        } else {
          toast.error(data.message || '删除失败')
        }
      } else {
        toast.error('删除失败')
      }
    } catch (error) {
      console.error('删除失败:', error)
      toast.error('删除失败')
    }
  }

  // 编辑文章
  const handleEdit = (article: Article) => {
    setFormData({
      title: article.title,
      content: article.content,
      excerpt: article.excerpt,
      category: article.category,
      tags: article.tags,
      status: article.status,
      featuredImage: article.featuredImage || ""
    })
    setEditingId(article.id)
    setIsEditing(true)
  }

  // 添加标签
  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      })
      setTagInput("")
    }
  }

  // 移除标签
  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    })
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">文章管理</h1>
        <Button
          onClick={() => {
            setFormData(defaultFormData)
            setEditingId(null)
            setIsEditing(true)
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          新建文章
        </Button>
      </div>

      {isEditing ? (
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                {editingId ? '编辑文章' : '新建文章'}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsEditing(false)
                  setEditingId(null)
                  setFormData(defaultFormData)
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">文章标题 *</label>
                <Input
                  placeholder="请输入文章标题"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">分类 *</label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择分类" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">特色图片URL</label>
              <Input
                placeholder="https://example.com/image.jpg"
                value={formData.featuredImage}
                onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">文章摘要</label>
              <Textarea
                placeholder="请输入文章摘要（留空将自动生成）"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">标签</label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="输入标签后按回车添加"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addTag()
                    }
                  }}
                />
                <Button onClick={addTag} variant="outline">
                  添加
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                    {tag} <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">文章内容 *</label>
              <Textarea
                placeholder="请输入文章内容（支持Markdown格式）"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={15}
                className="font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">发布状态</label>
              <Select
                value={formData.status}
                onValueChange={(value: 'draft' | 'published') => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">草稿</SelectItem>
                  <SelectItem value="published">发布</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsEditing(false)
                  setEditingId(null)
                  setFormData(defaultFormData)
                }}
              >
                取消
              </Button>
              <Button onClick={handleSave}>
                {editingId ? '更新文章' : '创建文章'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-muted-foreground">加载中...</p>
            </div>
          ) : articles.length > 0 ? (
            articles.map((article) => (
              <Card key={article.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <Badge variant={article.status === 'published' ? 'default' : 'secondary'}>
                          {article.status === 'published' ? '已发布' : '草稿'}
                        </Badge>
                        <span>{categories.find((c) => c.value === article.category)?.label}</span>
                        <span>{formatDate(article.createdAt)}</span>
                        <span>{article.readingTime}分钟阅读</span>
                      </div>
                      {article.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {article.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <p className="text-muted-foreground line-clamp-2">{article.excerpt}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(`/articles/${article.slug}`, '_blank')}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(article)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => handleDelete(article.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground mb-4">还没有创建任何文章</p>
                <Button onClick={() => setIsEditing(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  创建第一篇文章
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
