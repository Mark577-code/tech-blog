import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/contexts/theme-context"
import { LanguageProvider } from "@/contexts/language-context"
import Navbar from "./components/Navbar"

import ParticleBackground from "./components/ParticleBackground"
import Live2D from "./components/Live2D"
import { Toaster } from "sonner"
import type { Metadata } from 'next'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Mark-李的博客 | 技术分享与编程经验",
    template: "%s | Mark-李的博客"
  },
  description: "Mark-李的个人技术博客，基于Next.js 15构建。分享前端开发、后端技术、编程经验、项目作品和生活感悟。专注于React、TypeScript、Node.js等现代Web技术栈。",
  keywords: [
    "Mark-李", "技术博客", "前端开发", "Next.js", "React", "TypeScript", 
    "编程", "Web开发", "个人博客", "作品集", "摄影", "全栈开发"
  ],
  authors: [{ name: "Mark-李" }],
  creator: "Mark-李",
  publisher: "Mark-李的博客",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    title: 'Mark-李的博客',
    description: 'Mark-李的个人技术博客，分享编程经验、技术文章、项目作品和生活感悟',
    siteName: 'Mark-李的博客',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Mark-李的博客 - 技术分享与编程经验',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mark-李的博客',
    description: 'Mark-李的个人技术博客，分享编程经验、技术文章、项目作品和生活感悟',
    images: ['/og-image.jpg'],
    creator: '@your_twitter_handle',
  },
  verification: {
    google: 'your_google_verification_code',
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    languages: {
      'zh-CN': '/zh',
      'en-US': '/en',
    },
  },
  category: 'technology',
  generator: 'Next.js',
  applicationName: 'Mark-李的博客',
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <head>
        {/* 预加载关键资源 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fastly.jsdelivr.net" />
        
        {/* 性能优化 */}
        <meta name="theme-color" content="#0070f3" />
        <meta name="color-scheme" content="light dark" />
        
        {/* PWA配置 */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Mark-李的博客" />
        
        {/* 结构化数据 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Blog",
              "name": "Mark-李的博客",
              "description": "Mark-李的个人技术博客，分享编程经验、技术文章、项目作品和生活感悟",
              "url": process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
              "author": {
                "@type": "Person",
                "name": "Mark-李"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Mark-李的博客",
                "logo": {
                  "@type": "ImageObject",
                  "url": "/logo.png"
                }
              }
            })
          }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider>
          <LanguageProvider>
            <ParticleBackground />
            <div className="min-h-screen">
              <Navbar />
              <main className="main-content pt-16 relative">
                {children}
              </main>
            </div>
            <Live2D />
            <Toaster
              position="top-right"
              expand={false}
              richColors
              toastOptions={{
                duration: 3000,
              }}
            />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
