# GitHub静态网站文章在线更新指南

## 📋 问题描述

你的博客部署在GitHub + Vercel上，属于静态网站，无法通过传统的数据库方式实现在线文章更新。

## 🎯 解决方案

### 方案一：GitHub API集成（推荐）

#### 优势：
- ✅ 保持现有项目结构
- ✅ 直接操作GitHub仓库
- ✅ 自动触发Vercel重新部署
- ✅ 版本控制天然支持

#### 配置步骤：

1. **生成GitHub Personal Access Token**
   - 访问：https://github.com/settings/tokens
   - 点击"Generate new token (classic)"
   - 选择权限：`repo`（完整仓库访问权限）
   - 复制生成的token

2. **配置环境变量**
   在Vercel控制台 → 项目设置 → Environment Variables 中添加：
   ```env
   GITHUB_OWNER=your-github-username
   GITHUB_REPO=tech-blog
   GITHUB_TOKEN=your-personal-access-token
   GITHUB_BRANCH=main
   ```

3. **使用方式**
   - 在管理后台创建/编辑文章
   - 文章保存时自动提交到GitHub
   - Vercel检测到变更自动重新部署
   - 3-5分钟后网站更新

#### 实现原理：
```typescript
// 创建或更新文章
await githubAPI.updateFile({
  path: 'data/articles/new-article.json',
  content: JSON.stringify(articleData),
  message: '发布新文章：文章标题',
  sha: existingFileSha // 更新时需要
})
```

### 方案二：Netlify CMS

#### 优势：
- ✅ 完全可视化管理界面
- ✅ 支持媒体文件管理
- ✅ 多用户权限控制

#### 劣势：
- ⚠️ 需要重构数据结构（JSON → Markdown）
- ⚠️ 需要适配现有API
- ⚠️ 学习成本较高

#### 配置步骤：
1. 创建 `admin/config.yml`
2. 设置GitHub OAuth应用
3. 配置文件集合和字段
4. 部署管理界面

### 方案三：GitHub Actions工作流

#### 优势：
- ✅ 完全自动化
- ✅ 支持复杂预处理
- ✅ 可以集成其他服务

#### 实现方式：
```yaml
# .github/workflows/update-articles.yml
name: Update Articles
on:
  repository_dispatch:
    types: [update-article]
jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Update article
        run: |
          echo '${{ github.event.client_payload.content }}' > data/articles/${{ github.event.client_payload.filename }}
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add .
          git commit -m "Update article: ${{ github.event.client_payload.title }}"
          git push
```

## 🚀 推荐实施

**建议使用方案一（GitHub API集成）**，因为：

1. **最小改动**：保持现有项目结构
2. **最佳体验**：使用现有Vditor编辑器
3. **最高效率**：3-5分钟完成文章发布
4. **最安全**：GitHub版本控制 + Vercel部署

## 📝 实施清单

- [x] ✅ 创建GitHub API工具类
- [x] ✅ 配置环境变量示例
- [ ] 🔄 获取GitHub Personal Access Token
- [ ] 🔄 在Vercel配置环境变量
- [ ] 🔄 测试文章发布流程
- [ ] 🔄 监控部署状态

## ⚠️ 注意事项

1. **Token安全**：Personal Access Token具有完整仓库权限，请妥善保管
2. **部署延迟**：Vercel重新部署需要3-5分钟
3. **并发冲突**：避免同时编辑同一文章
4. **备份策略**：GitHub自动保存所有版本历史

## 🔧 故障排除

### 文章更新失败
1. 检查GitHub Token是否有效
2. 确认仓库权限设置
3. 查看Vercel部署日志

### 部署不触发
1. 检查GitHub Webhook设置
2. 确认Vercel项目关联正确
3. 手动触发重新部署

## 📞 技术支持

如需帮助，请查看：
- [GitHub API文档](https://docs.github.com/en/rest)
- [Vercel部署文档](https://vercel.com/docs)
- [项目Issue列表](https://github.com/your-repo/issues) 