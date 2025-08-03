'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Upload, Edit, Trash2, Eye, Save, X, Image as ImageIcon, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

interface ImageData {
  id: string
  filename: string
  original_name: string
  file_path: string
  file_url: string
  file_size: number
  width?: number
  height?: number
  mime_type: string
  alt_text?: string
  title?: string
  description?: string
  tags?: string[]
  category: string
  usage_type: 'avatar' | 'featured' | 'gallery' | 'content' | 'general'
  is_public: boolean
  uploaded_by: string
  created_at: string
  updated_at: string
}

const categories = [
  { value: 'general', label: '通用' },
  { value: 'blog', label: '博客' },
  { value: 'avatar', label: '头像' },
  { value: 'banner', label: '横幅' },
  { value: 'icon', label: '图标' }
]

const usageTypes = [
  { value: 'general', label: '通用' },
  { value: 'avatar', label: '头像' },
  { value: 'featured', label: '特色图片' },
  { value: 'gallery', label: '画廊' },
  { value: 'content', label: '内容图片' }
]

export default function ImagesAdmin() {
  const [images, setImages] = useState<ImageData[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [filterCategory, setFilterCategory] = useState<string>('')
  const [filterUsageType, setFilterUsageType] = useState<string>('')

  const [editForm, setEditForm] = useState({
    title: '',
    alt_text: '',
    description: '',
    tags: '',
    category: '',
    usage_type: '',
    is_public: true
  })

  const [uploadForm, setUploadForm] = useState({
    title: '',
    alt_text: '',
    description: '',
    tags: '',
    category: 'general',
    usage_type: 'general',
    is_public: true,
    file_url: '',
    file_size: 0,
    mime_type: '',
    width: 0,
    height: 0
  })

  // 加载图片列表
  useEffect(() => {
    loadImages()
  }, [filterCategory, filterUsageType])

  const loadImages = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filterCategory) params.append('category', filterCategory)
      if (filterUsageType) params.append('usage_type', filterUsageType)

      const response = await fetch(`/api/images?${params.toString()}`)
      const result = await response.json()

      if (result.success) {
        setImages(result.data || [])
      } else {
        toast.error(`加载图片失败: ${result.error}`)
      }
    } catch (error) {
      toast.error('网络错误，无法加载图片')
      console.error('加载图片失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 开始编辑图片
  const startEdit = (image: ImageData) => {
    setSelectedImage(image)
    setEditForm({
      title: image.title || '',
      alt_text: image.alt_text || '',
      description: image.description || '',
      tags: image.tags?.join(', ') || '',
      category: image.category,
      usage_type: image.usage_type,
      is_public: image.is_public
    })
    setEditDialogOpen(true)
  }

  // 更新图片信息
  const updateImage = async () => {
    if (!selectedImage) return

    try {
      setLoading(true)
      const response = await fetch('/api/images', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedImage.id,
          title: editForm.title,
          alt_text: editForm.alt_text,
          description: editForm.description,
          tags: editForm.tags.split(',').map(tag => tag.trim()).filter(Boolean),
          category: editForm.category,
          usage_type: editForm.usage_type,
          is_public: editForm.is_public
        })
      })

      const result = await response.json()

      if (result.success) {
        toast.success('图片信息更新成功！')
        setEditDialogOpen(false)
        loadImages()
      } else {
        toast.error(`更新失败: ${result.error}`)
      }
    } catch (error) {
      toast.error('网络错误，更新失败')
    } finally {
      setLoading(false)
    }
  }

  // 删除图片
  const deleteImage = async (id: string) => {
    if (!confirm('确定要删除这张图片吗？此操作不可撤销！')) {
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`/api/images?id=${id}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (result.success) {
        toast.success('图片删除成功！')
        loadImages()
      } else {
        toast.error(`删除失败: ${result.error}`)
      }
    } catch (error) {
      toast.error('网络错误，删除失败')
    } finally {
      setLoading(false)
    }
  }

  // 添加图片记录
  const addImageRecord = async () => {
    if (!uploadForm.file_url || !uploadForm.file_size) {
      toast.error('请填写完整的图片信息')
      return
    }

    try {
      setLoading(true)
      const filename = uploadForm.file_url.split('/').pop() || 'image'
      
      const response = await fetch('/api/images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename,
          original_name: filename,
          file_path: uploadForm.file_url,
          file_url: uploadForm.file_url,
          file_size: uploadForm.file_size,
          width: uploadForm.width || undefined,
          height: uploadForm.height || undefined,
          mime_type: uploadForm.mime_type || 'image/jpeg',
          title: uploadForm.title,
          alt_text: uploadForm.alt_text,
          description: uploadForm.description,
          tags: uploadForm.tags.split(',').map(tag => tag.trim()).filter(Boolean),
          category: uploadForm.category,
          usage_type: uploadForm.usage_type,
          is_public: uploadForm.is_public
        })
      })

      const result = await response.json()

      if (result.success) {
        toast.success('图片记录添加成功！')
        setUploadDialogOpen(false)
        setUploadForm({
          title: '',
          alt_text: '',
          description: '',
          tags: '',
          category: 'general',
          usage_type: 'general',
          is_public: true,
          file_url: '',
          file_size: 0,
          mime_type: '',
          width: 0,
          height: 0
        })
        loadImages()
      } else {
        toast.error(`添加失败: ${result.error}`)
      }
    } catch (error) {
      toast.error('网络错误，添加失败')
    } finally {
      setLoading(false)
    }
  }

  // 格式化文件大小
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-4">图片管理</h1>
            <p className="text-muted-foreground">管理您的博客图片资源</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={loadImages} disabled={loading} variant="outline">
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              刷新
            </Button>
            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  添加图片
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>添加图片记录</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="file_url">图片 URL *</Label>
                    <Input
                      id="file_url"
                      value={uploadForm.file_url}
                      onChange={(e) => setUploadForm({...uploadForm, file_url: e.target.value})}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="file_size">文件大小 (bytes) *</Label>
                      <Input
                        id="file_size"
                        type="number"
                        value={uploadForm.file_size}
                        onChange={(e) => setUploadForm({...uploadForm, file_size: parseInt(e.target.value) || 0})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="mime_type">文件类型</Label>
                      <Select value={uploadForm.mime_type} onValueChange={(value) => setUploadForm({...uploadForm, mime_type: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="选择类型" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="image/jpeg">JPEG</SelectItem>
                          <SelectItem value="image/png">PNG</SelectItem>
                          <SelectItem value="image/gif">GIF</SelectItem>
                          <SelectItem value="image/webp">WebP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="width">宽度</Label>
                      <Input
                        id="width"
                        type="number"
                        value={uploadForm.width}
                        onChange={(e) => setUploadForm({...uploadForm, width: parseInt(e.target.value) || 0})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="height">高度</Label>
                      <Input
                        id="height"
                        type="number"
                        value={uploadForm.height}
                        onChange={(e) => setUploadForm({...uploadForm, height: parseInt(e.target.value) || 0})}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="title">标题</Label>
                    <Input
                      id="title"
                      value={uploadForm.title}
                      onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="alt_text">替代文字</Label>
                    <Input
                      id="alt_text"
                      value={uploadForm.alt_text}
                      onChange={(e) => setUploadForm({...uploadForm, alt_text: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">分类</Label>
                      <Select value={uploadForm.category} onValueChange={(value) => setUploadForm({...uploadForm, category: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="usage_type">用途</Label>
                      <Select value={uploadForm.usage_type} onValueChange={(value) => setUploadForm({...uploadForm, usage_type: value as any})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {usageTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={addImageRecord} disabled={loading}>
                      <Save className="h-4 w-4 mr-2" />
                      添加
                    </Button>
                    <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                      取消
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* 筛选器 */}
      <div className="flex gap-4 mb-6">
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="所有分类" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">所有分类</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterUsageType} onValueChange={setFilterUsageType}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="所有用途" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">所有用途</SelectItem>
            {usageTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 图片网格 */}
      {loading && images.length === 0 ? (
        <div className="text-center py-8">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">加载中...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {images.map((image) => (
            <Card key={image.id} className="overflow-hidden">
              <div className="aspect-video relative bg-gray-100">
                {image.file_url ? (
                  <Image
                    src={image.file_url}
                    alt={image.alt_text || image.title || '图片'}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = '/placeholder.svg'
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ImageIcon className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium truncate mb-2">{image.title || image.filename}</h3>
                <div className="flex gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {categories.find(c => c.value === image.category)?.label || image.category}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {usageTypes.find(t => t.value === image.usage_type)?.label || image.usage_type}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  {formatFileSize(image.file_size)} • {image.width}×{image.height}
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => startEdit(image)}>
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => window.open(image.file_url, '_blank')}>
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => deleteImage(image.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {images.length === 0 && !loading && (
        <div className="text-center py-8">
          <ImageIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-muted-foreground">暂无图片，点击"添加图片"开始管理您的图片资源</p>
        </div>
      )}

      {/* 编辑对话框 */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑图片信息</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit_title">标题</Label>
              <Input
                id="edit_title"
                value={editForm.title}
                onChange={(e) => setEditForm({...editForm, title: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit_alt_text">替代文字</Label>
              <Input
                id="edit_alt_text"
                value={editForm.alt_text}
                onChange={(e) => setEditForm({...editForm, alt_text: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit_description">描述</Label>
              <Textarea
                id="edit_description"
                value={editForm.description}
                onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="edit_tags">标签 (用逗号分隔)</Label>
              <Input
                id="edit_tags"
                value={editForm.tags}
                onChange={(e) => setEditForm({...editForm, tags: e.target.value})}
                placeholder="标签1, 标签2, 标签3"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit_category">分类</Label>
                <Select value={editForm.category} onValueChange={(value) => setEditForm({...editForm, category: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit_usage_type">用途</Label>
                <Select value={editForm.usage_type} onValueChange={(value) => setEditForm({...editForm, usage_type: value as any})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {usageTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={updateImage} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                保存
              </Button>
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                <X className="h-4 w-4 mr-2" />
                取消
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 