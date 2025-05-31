'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Upload, X, Plus, Edit, Trash, Star, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'
import type { GalleryImage, CreateGalleryImageData } from '@/types/gallery'

const categories = [
  { value: "technology", label: "技术" },
  { value: "ai", label: "人工智能" },
  { value: "data", label: "数据" },
  { value: "cloud", label: "云计算" },
  { value: "mobile", label: "移动开发" },
  { value: "web", label: "Web开发" },
  { value: "photography", label: "摄影" },
  { value: "design", label: "设计" },
]

interface ImageFormData {
  title: string
  description: string
  url: string
  category: string
  tags: string[]
  featured: boolean
  order: number
}

const defaultFormData: ImageFormData = {
  title: "",
  description: "",
  url: "",
  category: "technology",
  tags: [],
  featured: false,
  order: 0
}

export default function ImagesManagement() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<ImageFormData>(defaultFormData)
  const [tagInput, setTagInput] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // 获取图片列表
  const fetchImages = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/gallery?limit=100', {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setImages(data.data.images)
        }
      }
    } catch (error) {
      console.error('获取图片失败:', error)
      toast.error('获取图片失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchImages()
  }, [])

  // 保存图片
  const handleSave = async () => {
    try {
      if (!formData.title.trim()) {
        toast.error("请输入图片标题")
        return
      }
      if (!formData.url.trim()) {
        toast.error("请输入图片URL")
        return
      }

      const imageData: CreateGalleryImageData = {
        title: formData.title,
        description: formData.description,
        url: formData.url,
        category: formData.category,
        tags: formData.tags,
        featured: formData.featured,
        order: formData.order
      }

      let response
      if (editingId) {
        // 更新图片
        response = await fetch(`/api/gallery/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ id: editingId, ...imageData }),
        })
      } else {
        // 创建新图片
        response = await fetch('/api/gallery', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(imageData),
        })
      }

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          toast.success(editingId ? '图片更新成功' : '图片创建成功')
          setIsDialogOpen(false)
          setIsEditing(false)
          setEditingId(null)
          setFormData(defaultFormData)
          fetchImages()
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

  // 删除图片
  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这张图片吗？')) {
      return
    }

    try {
      const response = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          toast.success('图片删除成功')
          fetchImages()
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

  // 编辑图片
  const handleEdit = (image: GalleryImage) => {
    setFormData({
      title: image.title,
      description: image.description || "",
      url: image.url,
      category: image.category,
      tags: image.tags,
      featured: image.featured,
      order: image.order || 0
    })
    setEditingId(image.id)
    setIsEditing(true)
    setIsDialogOpen(true)
  }

  // 新建图片
  const handleCreate = () => {
    setFormData(defaultFormData)
    setEditingId(null)
    setIsEditing(false)
    setIsDialogOpen(true)
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
        <h1 className="text-2xl font-bold">图片管理</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              新建图片
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{isEditing ? '编辑图片' : '新建图片'}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">图片标题 *</label>
                  <Input
                    placeholder="请输入图片标题"
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
                <label className="text-sm font-medium">图片URL *</label>
                <Input
                  placeholder="https://example.com/image.jpg"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                />
                {formData.url && (
                  <div className="relative w-full h-32 border rounded-lg overflow-hidden">
                <Image
                      src={formData.url}
                      alt="预览"
                      fill
                      className="object-cover"
                      onError={() => toast.error('图片加载失败，请检查URL')}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">图片描述</label>
                <Textarea
                  placeholder="请输入图片描述"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">标签</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="输入标签后按回车"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addTag()
                      }
                    }}
                  />
                  <Button type="button" onClick={addTag}>添加</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      #{tag}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                  />
                  <label className="text-sm font-medium">设为轮播图</label>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">排序权重</label>
                  <Input
                    type="number"
                    placeholder="数字越小越靠前"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  />
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
        ) : images.length > 0 ? (
          images.map((image) => (
            <Card key={image.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={image.thumbnailUrl || image.url}
                      alt={image.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                          {image.title}
                          {image.featured && (
                            <Badge className="bg-primary">
                              <Star className="h-3 w-3 mr-1" />
                              轮播图
                            </Badge>
                          )}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <Badge variant="outline">
                            {categories.find((c) => c.value === image.category)?.label || image.category}
                          </Badge>
                          <span>{formatDate(image.createdAt)}</span>
                          <span>{image.viewCount} 浏览</span>
                          <span>{image.likes} 点赞</span>
                        </div>
                        {image.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {image.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                        {image.description && (
                          <p className="text-muted-foreground line-clamp-2">{image.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(image)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(image.id)}>
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
              <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">暂无图片</h3>
              <p className="text-muted-foreground mb-4">点击"新建图片"按钮开始添加图片内容</p>
              <Button onClick={handleCreate}>
                <Plus className="h-4 w-4 mr-2" />
                新建图片
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
