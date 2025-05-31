"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Plus, Pencil, Trash, Star, ExternalLink, Github, Code } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import type { Project, CreateProjectData } from "@/types/project"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const categories = [
  { value: "web", label: "Web开发" },
  { value: "ai", label: "人工智能" },
  { value: "miniprogram", label: "小程序" },
  { value: "visualization", label: "数据可视化" },
  { value: "mobile", label: "移动开发" },
  { value: "backend", label: "后端开发" },
  { value: "tools", label: "工具软件" },
  { value: "design", label: "设计" },
]

interface ProjectFormData {
  title: string
  description: string
  content: string
  category: string
  tags: string[]
  technologies: string[]
  status: 'draft' | 'published'
  featured: boolean
  featuredImage: string
  demoUrl: string
  githubUrl: string
}

const defaultFormData: ProjectFormData = {
  title: "",
  description: "",
  content: "",
  category: "web",
  tags: [],
  technologies: [],
  status: "draft",
  featured: false,
  featuredImage: "",
  demoUrl: "",
  githubUrl: ""
}

export default function ProjectsManagement() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<ProjectFormData>(defaultFormData)
  const [tagInput, setTagInput] = useState("")
  const [techInput, setTechInput] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // 获取项目列表
  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/projects?status=all&limit=100', {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setProjects(data.data.projects)
        }
      }
    } catch (error) {
      console.error('获取项目失败:', error)
      toast.error('获取项目失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  // 保存项目
  const handleSave = async () => {
    try {
      if (!formData.title.trim()) {
        toast.error("请输入项目标题")
        return
      }
      if (!formData.description.trim()) {
        toast.error("请输入项目描述")
        return
      }
      if (!formData.content.trim()) {
        toast.error("请输入项目内容")
        return
      }

      const projectData: CreateProjectData = {
        title: formData.title,
        description: formData.description,
        content: formData.content,
        category: formData.category,
        tags: formData.tags,
        technologies: formData.technologies,
        status: formData.status,
        featured: formData.featured,
        featuredImage: formData.featuredImage,
        demoUrl: formData.demoUrl,
        githubUrl: formData.githubUrl
      }

      let response
      if (editingId) {
        // 更新项目
        response = await fetch(`/api/projects/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ id: editingId, ...projectData }),
        })
      } else {
        // 创建新项目
        response = await fetch('/api/projects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(projectData),
        })
      }

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          toast.success(editingId ? '项目更新成功' : '项目创建成功')
          setIsDialogOpen(false)
          setIsEditing(false)
          setEditingId(null)
          setFormData(defaultFormData)
          fetchProjects()
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

  // 删除项目
  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个项目吗？')) {
      return
    }

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          toast.success('项目删除成功')
          fetchProjects()
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

  // 编辑项目
  const handleEdit = (project: Project) => {
    setFormData({
      title: project.title,
      description: project.description,
      content: project.content,
      category: project.category,
      tags: project.tags,
      technologies: project.technologies,
      status: project.status,
      featured: project.featured,
      featuredImage: project.featuredImage || "",
      demoUrl: project.demoUrl || "",
      githubUrl: project.githubUrl || ""
    })
    setEditingId(project.id)
    setIsEditing(true)
    setIsDialogOpen(true)
  }

  // 新建项目
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

  // 添加技术栈
  const addTech = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, techInput.trim()]
      })
      setTechInput("")
    }
  }

  // 移除技术栈
  const removeTech = (tech: string) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter(t => t !== tech)
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
        <h1 className="text-2xl font-bold">项目管理</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          新建项目
        </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{isEditing ? '编辑项目' : '新建项目'}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                  <label className="text-sm font-medium">项目标题 *</label>
              <Input
                    placeholder="请输入项目标题"
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
                <label className="text-sm font-medium">项目描述 *</label>
              <Textarea
                  placeholder="请输入项目描述"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
              />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">项目内容 *</label>
                <Textarea
                  placeholder="请输入项目详细内容（支持Markdown格式）"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={8}
                />
            </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">演示地址</label>
                  <Input
                    placeholder="https://demo.example.com"
                    value={formData.demoUrl}
                    onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                  />
            </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">GitHub地址</label>
                  <Input
                    placeholder="https://github.com/username/repo"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  />
                </div>
            </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">特色图片URL</label>
                <Input
                  placeholder="https://example.com/image.jpg"
                  value={formData.featuredImage}
                  onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                />
                {formData.featuredImage && (
                  <div className="relative w-full h-32 border rounded-lg overflow-hidden">
                    <Image
                      src={formData.featuredImage}
                      alt="预览"
                      fill
                      className="object-cover"
                      onError={() => toast.error('图片加载失败，请检查URL')}
                    />
                  </div>
                )}
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
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 hover:bg-transparent"
                        onClick={() => removeTag(tag)}
                      >
                        ×
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">技术栈</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="输入技术栈后按回车"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addTech()
                      }
                    }}
                  />
                  <Button type="button" onClick={addTech}>添加</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.technologies.map((tech) => (
                    <Badge key={tech} variant="outline" className="flex items-center gap-1">
                      {tech}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 hover:bg-transparent"
                        onClick={() => removeTech(tech)}
                      >
                        ×
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">状态</label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: 'draft' | 'published') => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">草稿</SelectItem>
                      <SelectItem value="published">已发布</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                  />
                  <label className="text-sm font-medium">设为精选</label>
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
        ) : projects.length > 0 ? (
          projects.map((project) => (
            <Card key={project.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {project.featuredImage && (
                    <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg">
                      <Image
                        src={project.featuredImage}
                        alt={project.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                          {project.title}
                          {project.featured && (
                            <Badge className="bg-primary">
                              <Star className="h-3 w-3 mr-1" />
                              精选
                            </Badge>
                          )}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <Badge variant={project.status === 'published' ? 'default' : 'secondary'}>
                            {project.status === 'published' ? '已发布' : '草稿'}
                          </Badge>
                          <Badge variant="outline">
                            {categories.find((c) => c.value === project.category)?.label || project.category}
                          </Badge>
                          <span>{formatDate(project.createdAt)}</span>
                          <span>{project.viewCount} 浏览</span>
                          <span>{project.likes} 点赞</span>
                        </div>
                        {(project.tags.length > 0 || project.technologies.length > 0) && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {project.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                            {project.technologies.map((tech) => (
                              <Badge key={tech} variant="outline" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <p className="text-muted-foreground line-clamp-2 mb-3">{project.description}</p>
                        {(project.demoUrl || project.githubUrl) && (
                          <div className="flex gap-2">
                            {project.demoUrl && (
                              <Button variant="outline" size="sm" asChild>
                                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  演示
                                </a>
                              </Button>
                            )}
                            {project.githubUrl && (
                              <Button variant="outline" size="sm" asChild>
                                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                  <Github className="h-3 w-3 mr-1" />
                                  代码
                                </a>
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(project)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(project.id)}>
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
              <Code className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">暂无项目</h3>
              <p className="text-muted-foreground mb-4">点击"新建项目"按钮开始添加项目内容</p>
              <Button onClick={handleCreate}>
                <Plus className="h-4 w-4 mr-2" />
                新建项目
              </Button>
                </CardContent>
              </Card>
        )}
        </div>
    </div>
  )
}
