'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { PlusCircle, Edit, Trash2, Eye, Save, X, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import MarkdownEditor from '@/components/MarkdownEditor'

interface Article {
  id: string
  title: string
  slug: string
  content: string
  summary: string
  category: string
  tags: string[]
  status: 'draft' | 'published'
  created_at: string
  updated_at: string
  published_at: string
  author: string
  featured_image: string
  read_time: number
}

const categories = [
  { value: 'programming', label: '编程技术' },
  { value: 'photography', label: '摄影分享' },
  { value: 'tutorial', label: '文字教程' },
  { value: 'project', label: '项目展示' }
]

export default function ArticlesAdmin() {
  const [articles, setArticles] = useState<Article[]>([])
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('list')
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    summary: '',
    category: '',
    tags: '',
    status: 'draft' as 'draft' | 'published',
    featured_image: ''
  })

  // 加载文章数据
  useEffect(() => {
    loadArticles()
  }, [])

  const loadArticles = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/articles?status=all')
      const result = await response.json()
      
      if (result.success) {
        setArticles(result.data || [])
      } else {
        toast.error(`加载文章失败: ${result.error}`)
        console.error('加载文章失败:', result)
      }
    } catch (error) {
      toast.error('网络错误，无法加载文章')
      console.error('加载文章失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 创建新文章
  const createArticle = async () => {
    if (!formData.title || !formData.content) {
      toast.error('请填写标题和内容')
      return
    }

    try {
      setLoading(true)
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          summary: formData.summary,
          category: formData.category || 'programming',
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
          status: formData.status,
          featured_image: formData.featured_image
        })
      })

      const result = await response.json()
      
      if (result.success) {
        toast.success('文章创建成功！')
        resetForm()
        setActiveTab('list')
        await loadArticles() // 重新加载文章列表
      } else {
        toast.error(`创建失败: ${result.error}`)
        console.error('创建文章失败:', result)
      }
    } catch (error) {
      toast.error('网络错误，创建失败')
      console.error('创建文章失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 更新文章
  const updateArticle = async () => {
    if (!editingArticle || !formData.title || !formData.content) {
      toast.error('请填写标题和内容')
      return
    }

    try {
      setLoading(true)
      const response = await fetch('/api/articles', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
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
        setActiveTab('list')
        await loadArticles() // 重新加载文章列表
      } else {
        toast.error(`更新失败: ${result.error}`)
        console.error('更新文章失败:', result)
      }
    } catch (error) {
      toast.error('网络错误，更新失败')
      console.error('更新文章失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 删除文章
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
        await loadArticles() // 重新加载文章列表
      } else {
        toast.error(`删除失败: ${result.error}`)
        console.error('删除文章失败:', result)
      }
    } catch (error) {
      toast.error('网络错误，删除失败')
      console.error('删除文章失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 编辑文章
  const editArticle = (article: Article) => {
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
    setActiveTab('edit')
  }

  // 重置表单
  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      summary: '',
      category: '',
      tags: '',
      status: 'draft',
      featured_image: ''
    })
    setIsCreating(false)
    setEditingArticle(null)
  }

  // 开始创建新文章
  const startCreating = () => {
    resetForm()
    setIsCreating(true)
    setActiveTab('edit')
  }

  // 快速创建示例文章
  const createSampleArticle = (type: string) => {
    const samples = {
      tech: {
        title: 'TypeScript 高级技巧分享',
        content: `# TypeScript 高级技巧分享

TypeScript 作为 JavaScript 的超集，提供了强大的类型系统。本文分享一些实用的高级技巧。

## 条件类型

\`\`\`typescript
type IsArray<T> = T extends any[] ? true : false;

type Test1 = IsArray<string[]>; // true
type Test2 = IsArray<string>;   // false
\`\`\`

## 工具类型

\`\`\`typescript
// 深度只读
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

// 可选属性
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
\`\`\`

## 装饰器模式

\`\`\`typescript
function log(target: any, propertyName: string, descriptor: PropertyDescriptor) {
  const method = descriptor.value;
  descriptor.value = function (...args: any[]) {
    console.log(\`调用方法: \${propertyName}\`);
    return method.apply(this, args);
  };
}
\`\`\`

掌握这些技巧可以让你的 TypeScript 代码更加健壮和优雅！`,
        summary: '分享 TypeScript 的高级使用技巧，包括条件类型、工具类型和装饰器模式等实用内容。',
        category: 'programming',
        tags: 'TypeScript, JavaScript, 前端开发, 类型系统'
      },
      photo: {
        title: '夜景摄影技巧与后期处理',
        content: `# 夜景摄影技巧与后期处理

夜景摄影是摄影中的一个重要分支，需要掌握特殊的技巧和设备。

## 器材准备

### 必备设备
- **稳固三脚架**：长曝光的基础
- **快门线**：减少机震
- **大光圈镜头**：增加进光量
- **ND滤镜**：控制曝光时间

## 拍摄技巧

### 1. 参数设置
- ISO: 100-800（根据环境调整）
- 光圈: f/8-f/11（最佳画质）
- 快门: 根据效果需要调整

### 2. 构图要点
- 利用城市灯光作为主要光源
- 寻找有趣的前景和背景
- 注意光比平衡

### 3. 对焦技巧
- 使用手动对焦
- 利用无穷远标记
- 用实时取景放大确认

## 后期处理

### 降噪处理
使用专业软件如 Lightroom 或 Photoshop 进行降噪。

### 色彩调整
- 调整白平衡
- 增强对比度
- 饱和度适度提升

### 细节优化
- 锐化处理
- 暗部提亮
- 高光压制

通过这些技巧，你可以拍出令人印象深刻的夜景作品！`,
        summary: '详细介绍夜景摄影的器材准备、拍摄技巧和后期处理方法，帮助摄影爱好者提升夜拍水平。',
        category: 'photography',
        tags: '夜景摄影, 摄影技巧, 后期处理, 器材推荐'
      },
      tutorial: {
        title: 'Git 工作流最佳实践',
        content: `# Git 工作流最佳实践

掌握 Git 工作流对团队协作至关重要。本文介绍几种常用的 Git 工作流模式。

## Git Flow

### 分支结构
- **master**: 生产环境代码
- **develop**: 开发主分支
- **feature**: 功能开发分支
- **release**: 预发布分支
- **hotfix**: 紧急修复分支

### 工作流程

\`\`\`bash
# 创建功能分支
git checkout -b feature/new-feature develop

# 开发完成后合并
git checkout develop
git merge --no-ff feature/new-feature
git branch -d feature/new-feature
\`\`\`

## GitHub Flow

更简单的工作流，适合持续部署：

\`\`\`bash
# 从 main 创建分支
git checkout -b feature-branch

# 提交更改
git add .
git commit -m "Add new feature"

# 推送并创建 PR
git push origin feature-branch
\`\`\`

## 最佳实践

### 提交信息规范
\`\`\`
feat: 添加新功能
fix: 修复Bug
docs: 更新文档
style: 代码格式化
refactor: 重构代码
test: 添加测试
chore: 其他修改
\`\`\`

### 分支命名
- feature/用户登录
- bugfix/修复支付问题
- hotfix/紧急修复

遵循这些最佳实践可以让团队协作更加高效！`,
        summary: '介绍 Git Flow 和 GitHub Flow 等工作流模式，以及分支管理和提交规范的最佳实践。',
        category: 'tutorial',
        tags: 'Git, 版本控制, 团队协作, 工作流'
      }
    }

    const sample = samples[type as keyof typeof samples]
    if (sample) {
      setFormData({
        title: sample.title,
        content: sample.content,
        summary: sample.summary,
        category: sample.category,
        tags: sample.tags,
        status: 'published',
        featured_image: ''
      })
      setIsCreating(true)
      setEditingArticle(null)
      setActiveTab('edit')
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-4">文章管理</h1>
            <p className="text-muted-foreground">创建和管理你的博客文章</p>
          </div>
          <Button 
            onClick={loadArticles}
            disabled={loading}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            刷新
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list">文章列表 ({articles.length})</TabsTrigger>
          <TabsTrigger value="edit">
            {editingArticle ? '编辑文章' : isCreating ? '创建文章' : '创建文章'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <div className="flex gap-2 mb-4 flex-wrap">
            <Button 
              onClick={startCreating}
              className="flex items-center gap-2"
              disabled={loading}
            >
              <PlusCircle className="h-4 w-4" />
              新建文章
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => createSampleArticle('tech')}
              disabled={loading}
            >
              技术文章示例
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => createSampleArticle('photo')}
              disabled={loading}
            >
              摄影文章示例
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => createSampleArticle('tutorial')}
              disabled={loading}
            >
              教程文章示例
            </Button>
          </div>

          {loading && articles.length === 0 ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">加载中...</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {articles.map((article) => (
                <Card key={article.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{article.title}</CardTitle>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="secondary">{categories.find(c => c.value === article.category)?.label}</Badge>
                          <Badge variant={article.status === 'published' ? 'default' : 'outline'}>
                            {article.status === 'published' ? '已发布' : '草稿'}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => editArticle(article)}
                          disabled={loading}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`/articles/${article.slug}`, '_blank')}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteArticle(article.id)}
                          disabled={loading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">{article.summary}</p>
                    <div className="flex gap-2 text-xs text-muted-foreground">
                      <span>阅读时间: {article.read_time}分钟</span>
                      <span>•</span>
                      <span>创建于: {new Date(article.created_at).toLocaleDateString()}</span>
                      {article.updated_at !== article.created_at && (
                        <>
                          <span>•</span>
                          <span>更新于: {new Date(article.updated_at).toLocaleDateString()}</span>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {articles.length === 0 && !loading && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">暂无文章，点击上方按钮创建第一篇文章吧！</p>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="edit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {editingArticle ? '编辑文章' : '创建新文章'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                  height={500}
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
                  <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value as 'draft' | 'published'})} disabled={loading}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">草稿</SelectItem>
                      <SelectItem value="published">发布</SelectItem>
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
                <Button variant="outline" onClick={resetForm} disabled={loading}>
                  <X className="h-4 w-4 mr-2" />
                  取消
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 