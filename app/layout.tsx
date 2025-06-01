import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/contexts/theme-context"
import { LanguageProvider } from "@/contexts/language-context"
import Navbar from "./components/Navbar"
import Sidebar from "./components/Sidebar"
import ParticleBackground from "./components/ParticleBackground"
import Live2D from "./components/Live2D"
import ChatWidget from "./components/Chat/ChatWidget"
import { Toaster } from "sonner"
import type { Metadata } from 'next'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "现代化技术博客 | Tech Blog",
    template: "%s | Tech Blog"
  },
  description: "一个基于Next.js 15构建的现代化个人技术博客，分享编程经验、技术文章、项目作品和摄影作品。集成AI助手、Live2D虚拟角色等特色功能。",
  keywords: [
    "技术博客", "前端开发", "Next.js", "React", "TypeScript", 
    "编程", "Web开发", "个人博客", "作品集", "摄影"
  ],
  authors: [{ name: "Tech Blog Author" }],
  creator: "Tech Blog Author",
  publisher: "Tech Blog",
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
    title: '现代化技术博客',
    description: '分享编程经验、技术文章、项目作品和摄影作品的个人技术博客',
    siteName: 'Tech Blog',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Tech Blog - 现代化技术博客',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '现代化技术博客',
    description: '分享编程经验、技术文章、项目作品和摄影作品',
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
  applicationName: 'Tech Blog',
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
        <meta name="apple-mobile-web-app-title" content="Tech Blog" />
        
        {/* 结构化数据 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Blog",
              "name": "现代化技术博客",
              "description": "分享编程经验、技术文章、项目作品和摄影作品的个人技术博客",
              "url": process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
              "author": {
                "@type": "Person",
                "name": "Tech Blog Author"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Tech Blog",
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
              <div className="flex flex-col md:flex-row">
                <Sidebar />
                <main className="flex-1 p-4 md:ml-64 mt-16">
                  <div className="gradient-window p-6">{children}</div>
                </main>
              </div>
            </div>
            <Live2D />
            <ChatWidget />
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
