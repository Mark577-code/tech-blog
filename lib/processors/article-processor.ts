import { Article } from '@/types/article'
import crypto from 'crypto'

interface ArticleDocument {
  title: string
  content: string
  metadata: {
    id: string
    category: string
    tags: string[]
    author: string
    publishedAt: string
    url: string
    summary?: string
  }
}

class ArticleProcessor {
  // 将文章转换为知识库文档格式
  static formatForKnowledgeBase(article: Article): ArticleDocument {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'
    
    const formattedContent = `
# ${article.title}

## 📋 文章信息
- **分类**: ${article.category}
- **标签**: ${article.tags.join(', ')}
- **作者**: ${article.author || '博客作者'}
- **发布时间**: ${article.updatedAt}
- **文章链接**: ${baseUrl}/articles/${article.slug}

## 📝 摘要
${article.excerpt || '这是一篇关于' + article.category + '的技术文章。'}

## 📖 正文内容

${article.content}

## 🏷️ 相关标签
${article.tags.map(tag => `#${tag}`).join(' ')}

---
*本文档来自技术博客系统，供AI助手参考回答相关问题*
    `.trim()
    
    return {
      title: article.title,
      content: formattedContent,
      metadata: {
        id: article.id,
        category: article.category,
        tags: article.tags,
        author: article.author || '博客作者',
        publishedAt: article.updatedAt,
        url: `${baseUrl}/articles/${article.slug}`,
        summary: article.excerpt
      }
    }
  }

  // 生成文章内容哈希值，用于检测变更
  static generateContentHash(article: Article): string {
    const content = `${article.title}${article.content}${article.tags.join('')}${article.category}`
    return crypto.createHash('md5').update(content, 'utf8').digest('hex')
  }

  // 创建Dify文档请求对象
  static createDifyDocumentRequest(articleDoc: ArticleDocument) {
    return {
      name: articleDoc.title,
      text: articleDoc.content,
      indexing_technique: 'high_quality' as const,
      process_rule: {
        rules: {
          pre_processing_rules: [
            { id: 'remove_extra_spaces', enabled: true },
            { id: 'remove_urls_emails', enabled: false } // 保留链接信息
          ],
          segmentation: {
            separator: '\n\n',
            max_tokens: 1000
          }
        }
      }
    }
  }

  // 验证文章是否适合同步到知识库
  static shouldSyncArticle(article: Article): boolean {
    // 只同步已发布的文章
    if (article.status !== 'published') return false
    
    // 内容不能为空
    if (!article.content || article.content.trim().length < 100) return false
    
    // 标题不能为空
    if (!article.title || article.title.trim().length === 0) return false
    
    return true
  }
}

export { ArticleProcessor, type ArticleDocument } 