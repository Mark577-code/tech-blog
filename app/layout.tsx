"use client"

import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/contexts/theme-context"
import { LanguageProvider } from "@/contexts/language-context"
import Navbar from "./components/Navbar"
import ParticleBackground from "./components/ParticleBackground"
import Live2D from "./components/Live2D"
import { Toaster } from "sonner"
import { usePathname } from "next/navigation"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <title>Mark-李的博客 | 技术分享与编程经验</title>
        <meta name="description" content="Mark-李的个人技术博客，基于Next.js 15构建。分享前端开发、后端技术、编程经验、项目作品和生活感悟。专注于React、TypeScript、Node.js等现代Web技术栈。" />
        <meta name="keywords" content="Mark-李, 技术博客, 前端开发, Next.js, React, TypeScript, 编程, Web开发, 个人博客, 作品集, 摄影, 全栈开发" />
        <meta name="author" content="Mark-李" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#0070f3" />
        <meta name="msapplication-TileColor" content="#0070f3" />
        <meta name="theme-color" content="#0070f3" />
        <meta name="color-scheme" content="light dark" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Mark-李的博客" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider>
          <LanguageProvider>
            {!isHomePage && <ParticleBackground />}
            <div className="min-h-screen">
              {!isHomePage && <Navbar />}
              <main className={`main-content relative ${!isHomePage ? 'pt-16' : ''}`}>
                {children}
              </main>
            </div>
            {!isHomePage && <Live2D />}
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
