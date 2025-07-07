# Supabase 数据库集成指南

本文档将指导你完成博客系统与 Supabase 数据库的集成。

## 🎯 集成概述

我们已经为你的博客系统配置了完整的 Supabase 集成：

- ✅ **数据库客户端配置** - `lib/supabase.ts`
- ✅ **数据库表结构** - `database/schema.sql`
- ✅ **数据迁移脚本** - `scripts/migrate-data.ts`
- ✅ **API 路由更新** - 使用 Supabase 替代 JSON 文件
- ✅ **管理界面** - `/admin/migrate` 页面

## 📋 完成步骤

### 1. 创建数据库表

在 Supabase 项目中执行 SQL 脚本：

1. 访问 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目 `tech-blog`
3. 进入 **SQL Editor**
4. 复制并执行 `database/schema.sql` 中的所有 SQL 语句
5. 确认所有表创建成功

### 2. 环境变量配置

创建 `.env.local` 文件并添加以下配置：

```bash
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL="https://aieatfsfsbhrjhjdnlhb.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpZWF0ZnNmc2JocmpoamRubGhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1NTA5MDQsImV4cCI6MjA2NzEyNjkwNH0.pGXO09CnMm5b0-rdZEUVXyER0GcDTovOhFPEh-v65-I"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpZWF0ZnNmc2JocmpoamRubGhiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTU1MDkwNCwiZXhwIjoyMDY3MTI2OTA0fQ.ShTudi_JcKiEYIwTfhRfpuKNbFZTVzMgDYaPUYUx0wc"

# PostgreSQL 配置  
POSTGRES_URL="postgres://postgres.aieatfsfsbhrjhjdnlhb:CpfwCHpHiNV2SNSs@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x"
POSTGRES_PRISMA_URL="postgres://postgres.aieatfsfsbhrjhjdnlhb:CpfwCHpHiNV2SNSs@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true"
POSTGRES_URL_NON_POOLING="postgres://postgres.aieatfsfsbhrjhjdnlhb:CpfwCHpHiNV2SNSs@aws-0-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require"
```

### 3. 数据迁移

选择以下任一方式进行数据迁移：

#### 方式一：使用管理界面（推荐）

1. 启动开发服务器：`npm run dev`
2. 访问 `/admin/migrate` 页面
3. 点击 "开始迁移数据" 按钮
4. 等待迁移完成

#### 方式二：使用命令行

```bash
npm run db:migrate
```

### 4. 验证集成

1. 访问博客首页，确认文章正常显示
2. 检查分类和标签是否正确加载
3. 测试文章搜索功能
4. 确认项目页面数据完整

## 🗂️ 数据结构说明

### 主要数据表

| 表名 | 说明 | 主要字段 |
|------|------|----------|
| `articles` | 文章 | title, slug, content, category, tags |
| `categories` | 分类 | name, slug, description, color, icon |
| `tags` | 标签 | name, slug, description, color |
| `projects` | 项目 | title, slug, description, tech_stack |
| `gallery_images` | 图片库 | title, url, category, tags |
| `users` | 用户 | email, name, role (可选) |
| `comments` | 评论 | content, article_id, user_id (可选) |

### 数据关系

- 文章通过 `category` 字段关联分类的 `slug`
- 文章通过 `tags` 数组字段关联多个标签
- 所有表都有 `created_at` 和 `updated_at` 时间戳
- 支持软删除和状态管理

## 🔧 API 路由更新

以下 API 路由已更新为使用 Supabase：

- ✅ `GET /api/articles` - 获取文章列表
- ✅ `POST /api/articles` - 创建新文章
- ✅ `GET /api/articles/[slug]` - 获取单篇文章
- ✅ `PUT /api/articles/[slug]` - 更新文章
- ✅ `DELETE /api/articles/[slug]` - 删除文章
- ✅ `GET /api/categories` - 获取分类列表
- ✅ `POST /api/categories` - 创建新分类
- ✅ `GET /api/projects` - 获取项目列表
- ✅ `POST /api/projects` - 创建新项目

## 🚀 部署注意事项

### Vercel 环境变量

在 Vercel 项目设置中添加以下环境变量：

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
POSTGRES_URL
POSTGRES_PRISMA_URL
POSTGRES_URL_NON_POOLING
```

### 安全设置

1. **行级安全 (RLS)**：已启用，只有已发布内容对公众可见
2. **API 密钥管理**：服务端密钥仅用于管理员操作
3. **数据验证**：所有输入都经过验证和清理

## 📊 监控和维护

### 数据库监控

- 使用 Supabase Dashboard 监控数据库性能
- 定期检查存储空间使用情况
- 监控 API 请求量和响应时间

### 备份策略

- Supabase 自动提供数据备份
- 建议定期导出重要数据
- 保留 JSON 文件作为备份

## 🆘 故障排除

### 常见问题

1. **连接失败**
   - 检查环境变量是否正确配置
   - 确认 Supabase 项目状态正常

2. **迁移失败**
   - 确认数据库表已创建
   - 检查服务端密钥权限

3. **数据不显示**
   - 验证 RLS 策略配置
   - 检查 API 路由错误日志

### 调试步骤

1. 检查浏览器控制台错误
2. 查看 Supabase 日志
3. 验证 API 响应格式
4. 确认数据库表结构

## ✨ 下一步

现在你的博客已经成功集成 Supabase！接下来可以：

- 🎨 **自定义管理界面** - 添加更多管理功能
- 👥 **用户系统** - 实现用户注册和评论功能
- 📈 **数据分析** - 添加访问统计和分析
- 🔍 **搜索优化** - 实现全文搜索功能
- 📱 **性能优化** - 添加缓存和CDN

祝你使用愉快！🎉 