"use client"

import { createContext, useContext, useState } from "react"

type Language = "zh" | "en"

type LanguageContextType = {
  language: Language
  toggleLanguage: () => void
  t: (key: string) => string
}

const translations = {
  zh: {
    "nav.home": "首页",
    "nav.articles": "文章",
    "nav.portfolio": "作品集",
    "theme.toggle": "切换主题",
    "language.toggle": "切换语言",
    "featured.works": "精选作品",
    "latest.articles": "最新文章",
    "featured.projects": "项目展示",
    "read.more": "阅读更多",
    "search.placeholder": "搜索内容...",
    categories: "分类",
    "categories.web": "网页开发",
    "categories.ai": "人工智能",
    "categories.data": "数据科学",
    "categories.security": "网络安全",
    "profile.description": "技术爱好者和软件开发者，专注于人工智能和网络技术",
    "article.readTime": "{0}分钟阅读",
    "portfolio.view": "查看项目",
    "portfolio.visit": "访问链接",
    "category.programming": "编程技术",
    "category.photography": "摄影分享",
    "category.tutorial": "文字教程",
    "category.project": "项目展示",
    "admin.category": "分类",
    "admin.select.category": "选择分类",
    "admin.upload.image": "上传图片",
    "admin.article.title": "文章标题",
    "admin.article.content": "文章内容",
    "admin.article.save": "保存",
    "admin.article.cancel": "取消",
    "admin.article.publish": "发布",
    "admin.article.draft": "草稿",
    "admin.article.published": "已发布",
  },
  en: {
    "nav.home": "Home",
    "nav.articles": "Articles",
    "nav.portfolio": "Portfolio",
    "theme.toggle": "Toggle Theme",
    "language.toggle": "Toggle Language",
    "featured.works": "Featured Works",
    "latest.articles": "Latest Articles",
    "featured.projects": "Featured Projects",
    "read.more": "Read More",
    "search.placeholder": "Search...",
    categories: "Categories",
    "categories.web": "Web Development",
    "categories.ai": "Artificial Intelligence",
    "categories.data": "Data Science",
    "categories.security": "Cybersecurity",
    "profile.description": "Tech enthusiast and software developer passionate about AI and web technologies",
    "article.readTime": "{0} min read",
    "portfolio.view": "View Project",
    "portfolio.visit": "Visit Link",
    "category.programming": "Programming",
    "category.photography": "Photography",
    "category.tutorial": "Tutorials",
    "category.project": "Projects",
    "admin.category": "Category",
    "admin.select.category": "Select Category",
    "admin.upload.image": "Upload Image",
    "admin.article.title": "Article Title",
    "admin.article.content": "Article Content",
    "admin.article.save": "Save",
    "admin.article.cancel": "Cancel",
    "admin.article.publish": "Publish",
    "admin.article.draft": "Draft",
    "admin.article.published": "Published",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("zh")

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "zh" ? "en" : "zh"))
  }

  const t = (key: string) => {
    return translations[language][key as keyof (typeof translations)["zh"]] || key
  }

  return <LanguageContext.Provider value={{ language, toggleLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
