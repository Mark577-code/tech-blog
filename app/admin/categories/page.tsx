"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Plus, Pencil, Trash, Eye, EyeOff, Hash, Palette } from "lucide-react"
import { toast } from "sonner"
import type { Category, CreateCategoryData } from "@/types/category"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const availableIcons = [
  { name: "Code", label: "代码" },
  { name: "Camera", label: "相机" },
  { name: "BookOpen", label: "书本" },
  { name: "Boxes", label: "项目" },
  { name: "PenTool", label: "笔" },
  { name: "Heart", label: "心形" },
  { name: "Star", label: "星星" },
  { name: "Zap", label: "闪电" },
  { name: "Globe", label: "地球" },
  { name: "Music", label: "音乐" },
]

const availableColors = [
  "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444",
  "#06b6d4", "#84cc16", "#f97316", "#ec4899", "#6366f1"
]

interface CategoryFormData {
  name: string
  slug: string
  description: string
  icon: string
  color: string
  order: number
  isVisible: boolean
}

const defaultFormData: CategoryFormData = {
  name: "",
  slug: "",
  description: "",
  icon: "Code",
  color: "#3b82f6",
  order: 0,
  isVisible: true
}

export default function CategoriesManagement() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<CategoryFormData>(defaultFormData)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // 获取分类列表
  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/categories?limit=100&sortBy=order&sortOrder=asc', {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setCategories(data.data.categories)
        }
      }
    } catch (error) {
      console.error('获取分类失败:', error)
      toast.error('获取分类失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  // 自动生成slug
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]/g, '')
      .substring(0, 20)
  }

  // 保存分类
  const handleSave = async () => {
    try {
      if (!formData.name.trim()) {
        toast.error("请输入分类名称")
        return
      }
      if (!formData.slug.trim()) {
        toast.error("请输入分类标识符")
        return
      }

      const categoryData: CreateCategoryData = {
        name: formData.name,
        slug: formData.slug,
        ...(formData.description.trim() && { description: formData.description }),
        icon: formData.icon,
        color: formData.color,
        order: formData.order,
        isVisible: formData.isVisible
      }

      let response
      if (editingId) {
        // 更新分类
        response = await fetch(`/api/categories/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ id: editingId, ...categoryData }),
        })
      } else {
        // 创建新分类
        response = await fetch('/api/categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(categoryData),
        })
      }

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          toast.success(editingId ? '分类更新成功' : '分类创建成功')
          setIsDialogOpen(false)
          setIsEditing(false)
          setEditingId(null)
          setFormData(defaultFormData)
          fetchCategories()
        } else {
          toast.error(data.error || '操作失败')
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

  // 删除分类
  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个分类吗？删除后相关文章将需要重新分类。')) {
      return
    }

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          toast.success('分类删除成功')
          fetchCategories()
        } else {
          toast.error(data.error || '删除失败')
        }
      } else {
        toast.error('删除失败')
      }
    } catch (error) {
      console.error('删除失败:', error)
      toast.error('删除失败')
    }
  }

  // 编辑分类
  const handleEdit = (category: Category) => {
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      icon: category.icon,
      color: category.color,
      order: category.order,
      isVisible: category.isVisible
    })
    setEditingId(category.id)
    setIsEditing(true)
    setIsDialogOpen(true)
  }

  // 新建分类
  const handleCreate = () => {
    setFormData(defaultFormData)
    setEditingId(null)
    setIsEditing(false)
    setIsDialogOpen(true)
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
        <h1 className="text-2xl font-bold">分类管理</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              新建分类
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{isEditing ? '编辑分类' : '新建分类'}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">分类名称 *</label>
                  <Input
                    placeholder="请输入分类名称"
                    value={formData.name}
                    onChange={(e) => {
                      const name = e.target.value
                      setFormData({ 
                        ...formData, 
                        name,
                        slug: formData.slug || generateSlug(name)
                      })
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">标识符 *</label>
                  <Input
                    placeholder="category-slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">用于URL，建议使用英文</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">分类描述</label>
                <Textarea
                  placeholder="请输入分类描述"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">图标 *</label>
                  <div className="grid grid-cols-5 gap-2">
                    {availableIcons.map((icon) => (
                      <button
                        key={icon.name}
                        type="button"
                        className={`p-2 border rounded-lg flex flex-col items-center gap-1 hover:bg-muted transition-colors ${
                          formData.icon === icon.name ? 'border-primary bg-primary/10' : 'border-border'
                        }`}
                        onClick={() => setFormData({ ...formData, icon: icon.name })}
                      >
                        <Hash className="h-4 w-4" />
                        <span className="text-xs">{icon.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">颜色 *</label>
                  <div className="grid grid-cols-5 gap-2">
                    {availableColors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`w-8 h-8 rounded-lg border-2 transition-all ${
                          formData.color === color ? 'border-foreground scale-110' : 'border-border'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setFormData({ ...formData, color })}
                      />
                    ))}
                  </div>
                  <Input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full h-8"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">排序权重</label>
                  <Input
                    type="number"
                    placeholder="数字越小越靠前"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.isVisible}
                    onCheckedChange={(checked) => setFormData({ ...formData, isVisible: checked })}
                  />
                  <label className="text-sm font-medium">在网站中显示</label>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  取消
                </Button>
                <Button onClick={handleSave}>
                  {isEditing ? '更新' : '创建'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-muted-foreground">加载中...</p>
          </div>
        ) : categories.length > 0 ? (
          categories.map((category) => (
            <Card key={category.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: category.color + '20', color: category.color }}
                  >
                    <Hash className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                          {category.name}
                          {!category.isVisible && (
                            <Badge variant="secondary">
                              <EyeOff className="h-3 w-3 mr-1" />
                              隐藏
                            </Badge>
                          )}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <Badge variant="outline">{category.slug}</Badge>
                          <span>{formatDate(category.createdAt)}</span>
                          <span>{category.articleCount} 篇文章</span>
                          <span>排序: {category.order}</span>
                        </div>
                        {category.description && (
                          <p className="text-muted-foreground line-clamp-2">{category.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(category)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(category.id)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <Hash className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">暂无分类</h3>
              <p className="text-muted-foreground mb-4">点击"新建分类"按钮开始创建分类</p>
              <Button onClick={handleCreate}>
                <Plus className="h-4 w-4 mr-2" />
                新建分类
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 