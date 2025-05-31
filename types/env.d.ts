declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_APP_NAME?: string
    NEXT_PUBLIC_APP_URL?: string
    NODE_ENV: 'development' | 'production' | 'test'
    
    // AI助手配置
    OPENAI_API_KEY?: string
    AI_MODEL?: string
    
    // 社交媒体
    NEXT_PUBLIC_GITHUB_URL?: string
    NEXT_PUBLIC_LINKEDIN_URL?: string
    NEXT_PUBLIC_TWITTER_URL?: string
    NEXT_PUBLIC_EMAIL?: string
    
    // CDN配置
    CDN_URL?: string
    
    // Live2D配置
    NEXT_PUBLIC_LIVE2D_MODEL_URL?: string
    
    // 开发工具
    DEBUG?: string
    
    // 数据库 (可选)
    DATABASE_URL?: string
    
    // 分析工具
    GOOGLE_ANALYTICS_ID?: string
    NEXT_PUBLIC_GOOGLE_ANALYTICS_ID?: string
    
    // 部署相关
    VERCEL_URL?: string
    DEPLOYMENT_ENV?: string
    
    // 文章管理系统
    ADMIN_PASSWORD?: string
    JWT_SECRET?: string
    JWT_EXPIRES_IN?: string
  }
} 