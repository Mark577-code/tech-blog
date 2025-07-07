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
import { PlusCircle, Edit, Trash2, Eye, Save, X } from 'lucide-react'
import { toast } from 'sonner'

interface Article {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  category: string
  tags: string[]
  status: 'draft' | 'published'
  createdAt: string
  updatedAt: string
  author: string
  featuredImage: string
  readingTime: number
  viewCount: number
  likes: number
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
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: '',
    status: 'draft' as 'draft' | 'published',
    featuredImage: ''
  })

  // 从localStorage加载文章
  useEffect(() => {
    const saved = localStorage.getItem('blog_articles')
    if (saved) {
      setArticles(JSON.parse(saved))
    } else {
      // 如果没有本地数据，加载默认文章
      loadDefaultArticles()
    }
  }, [])

  const loadDefaultArticles = async () => {
    try {
      const response = await fetch('/data/articles.json')
      const defaultArticles = await response.json()
      setArticles(defaultArticles)
      localStorage.setItem('blog_articles', JSON.stringify(defaultArticles))
    } catch (error) {
      console.error('加载默认文章失败:', error)
    }
  }

  // 保存文章到localStorage
  const saveArticles = (newArticles: Article[]) => {
    setArticles(newArticles)
    localStorage.setItem('blog_articles', JSON.stringify(newArticles))
  }

  // 生成文章ID和slug
  const generateId = () => Math.random().toString(36).substr(2, 15)
  const generateSlug = (title: string) => 
    title.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-').replace(/^-|-$/g, '')

  // 创建新文章
  const createArticle = () => {
    if (!formData.title || !formData.content) {
      toast.error('请填写标题和内容')
      return
    }

    const newArticle: Article = {
      id: generateId(),
      title: formData.title,
      slug: generateSlug(formData.title),
      content: formData.content,
      excerpt: formData.excerpt || formData.content.substring(0, 100) + '...',
      category: formData.category || 'programming',
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      status: formData.status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: 'Mark-李',
      featuredImage: formData.featuredImage || '/placeholder.svg',
      readingTime: Math.ceil(formData.content.length / 500), // 估算阅读时间
      viewCount: 0,
      likes: 0
    }

    const newArticles = [newArticle, ...articles]
    saveArticles(newArticles)
    
    // 重置表单
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      category: '',
      tags: '',
      status: 'draft',
      featuredImage: ''
    })
    setIsCreating(false)
    toast.success('文章创建成功！')
  }

  // 更新文章
  const updateArticle = () => {
    if (!editingArticle || !formData.title || !formData.content) {
      toast.error('请填写标题和内容')
      return
    }

    const updatedArticle: Article = {
      ...editingArticle,
      title: formData.title,
      slug: generateSlug(formData.title),
      content: formData.content,
      excerpt: formData.excerpt || formData.content.substring(0, 100) + '...',
      category: formData.category || 'programming',
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      status: formData.status,
      updatedAt: new Date().toISOString(),
      featuredImage: formData.featuredImage || '/placeholder.svg',
      readingTime: Math.ceil(formData.content.length / 500)
    }

    const newArticles = articles.map(article => 
      article.id === editingArticle.id ? updatedArticle : article
    )
    saveArticles(newArticles)
    
    setEditingArticle(null)
    resetForm()
    toast.success('文章更新成功！')
  }

  // 删除文章
  const deleteArticle = (id: string) => {
    if (confirm('确定要删除这篇文章吗？')) {
      const newArticles = articles.filter(article => article.id !== id)
      saveArticles(newArticles)
      toast.success('文章删除成功！')
    }
  }

  // 编辑文章
  const editArticle = (article: Article) => {
    setEditingArticle(article)
    setFormData({
      title: article.title,
      content: article.content,
      excerpt: article.excerpt,
      category: article.category,
      tags: article.tags.join(', '),
      status: article.status,
      featuredImage: article.featuredImage
    })
    setIsCreating(false)
  }

  // 重置表单
  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      category: '',
      tags: '',
      status: 'draft',
      featuredImage: ''
    })
    setIsCreating(false)
    setEditingArticle(null)
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
        excerpt: '分享 TypeScript 的高级使用技巧，包括条件类型、工具类型和装饰器模式等实用内容。',
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
        excerpt: '详细介绍夜景摄影的器材准备、拍摄技巧和后期处理方法，帮助摄影爱好者提升夜拍水平。',
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
        excerpt: '介绍 Git Flow 和 GitHub Flow 等工作流模式，以及分支管理和提交规范的最佳实践。',
        category: 'tutorial',
        tags: 'Git, 版本控制, 团队协作, 工作流'
      }
    }

    const sample = samples[type as keyof typeof samples]
    if (sample) {
      setFormData({
        title: sample.title,
        content: sample.content,
        excerpt: sample.excerpt,
        category: sample.category,
        tags: sample.tags,
        status: 'published',
        featuredImage: '/placeholder.svg'
      })
      setIsCreating(true)
      setEditingArticle(null)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">文章管理</h1>
        <p className="text-muted-foreground">创建和管理你的博客文章</p>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list">文章列表</TabsTrigger>
          <TabsTrigger value="edit">
            {editingArticle ? '编辑文章' : isCreating ? '创建文章' : '创建文章'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <div className="flex gap-2 mb-4">
            <Button 
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              新建文章
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => createSampleArticle('tech')}
            >
              技术文章示例
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => createSampleArticle('photo')}
            >
              摄影文章示例
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => createSampleArticle('tutorial')}
            >
              教程文章示例
            </Button>
          </div>

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
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">{article.excerpt}</p>
                  <div className="flex gap-2 text-xs text-muted-foreground">
                    <span>阅读时间: {article.readingTime}分钟</span>
                    <span>•</span>
                    <span>创建于: {new Date(article.createdAt).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
                  <Label htmlFor="title">标题</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="输入文章标题"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">分类</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
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
                <Label htmlFor="excerpt">摘要</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                  placeholder="文章摘要（可选，不填写将自动生成）"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">内容 (支持 Markdown)</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  placeholder="输入文章内容，支持 Markdown 语法"
                  rows={15}
                  className="font-mono text-sm"
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
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">状态</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value as 'draft' | 'published'})}>
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
                <Label htmlFor="featuredImage">特色图片 URL</Label>
                <Input
                  id="featuredImage"
                  value={formData.featuredImage}
                  onChange={(e) => setFormData({...formData, featuredImage: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={editingArticle ? updateArticle : createArticle}>
                  <Save className="h-4 w-4 mr-2" />
                  {editingArticle ? '更新文章' : '创建文章'}
                </Button>
                <Button variant="outline" onClick={resetForm}>
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