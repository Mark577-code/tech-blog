declare namespace NodeJS {
  interface ProcessEnv {
    // 应用基础配置
    NEXT_PUBLIC_APP_NAME: string
    NEXT_PUBLIC_APP_URL: string
    NEXT_PUBLIC_APP_VERSION: string
    NEXT_PUBLIC_EMAIL: string
    NEXT_PUBLIC_DESCRIPTION: string
    
    // AI助手配置
    OPENAI_API_KEY: string
    AI_MODEL: string
    
    // Dify AI助手配置
    DIFY_API_KEY: string
    DIFY_API_BASE_URL: string
    
    // 社交媒体链接
    NEXT_PUBLIC_GITHUB_URL: string
    NEXT_PUBLIC_TWITTER_URL: string
    NEXT_PUBLIC_LINKEDIN_URL: string
    NEXT_PUBLIC_EMAIL_CONTACT: string
    
    // Live2D配置
    NEXT_PUBLIC_LIVE2D_MODEL_URL: string
    NEXT_PUBLIC_LIVE2D_ENABLE: string
    
    // 分析和监控
    NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: string
    NEXT_PUBLIC_VERCEL_ANALYTICS_ID: string
    
    // 文章管理系统认证
    ADMIN_PASSWORD: string
    JWT_SECRET: string
    
    // 其他API密钥
    DATABASE_URL?: string
    REDIS_URL?: string
  }
} 