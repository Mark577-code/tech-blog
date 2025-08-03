"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

// 粒子背景组件
const ParticleBackground = () => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    opacity: number;
  }>>([])

  useEffect(() => {
    const createParticles = () => {
      const newParticles = []
      for (let i = 0; i < 100; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 3 + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          opacity: Math.random() * 0.8 + 0.2,
        })
      }
      setParticles(newParticles)
    }

    createParticles()

    const animateParticles = () => {
      setParticles(prev => prev.map(particle => {
        let newX = particle.x + particle.speedX
        let newY = particle.y + particle.speedY

        if (newX < 0 || newX > window.innerWidth) particle.speedX *= -1
        if (newY < 0 || newY > window.innerHeight) particle.speedY *= -1

        return {
          ...particle,
          x: Math.max(0, Math.min(window.innerWidth, newX)),
          y: Math.max(0, Math.min(window.innerHeight, newY)),
        }
      }))
    }

    const interval = setInterval(animateParticles, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute bg-blue-400/60 rounded-full animate-pulse"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity,
            boxShadow: `0 0 ${particle.size * 2}px rgba(59, 130, 246, 0.4)`,
          }}
        />
      ))}
    </div>
  )
}

// 打字机效果组件
const TypewriterText = ({ text, speed = 100, delay = 0 }: {
  text: string;
  speed?: number;
  delay?: number;
}) => {
  const [displayText, setDisplayText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentIndex < text.length) {
        setDisplayText(text.slice(0, currentIndex + 1))
        setCurrentIndex(currentIndex + 1)
      }
    }, currentIndex === 0 ? delay : speed)

    return () => clearTimeout(timer)
  }, [currentIndex, text, speed, delay])

  return (
    <span>
      {displayText}
      <span className="animate-pulse text-blue-400">|</span>
    </span>
  )
}

// 闪烁文本组件
const BlinkingText = ({ text, className = "" }: { text: string; className?: string }) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(prev => !prev)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'} ${className}`}>
      {text}
    </div>
  )
}

export default function Welcome() {
  const [mounted, setMounted] = useState(false)
  const [showSecondaryText, setShowSecondaryText] = useState(false)

  useEffect(() => {
    setMounted(true)
    // 设置简洁的页面标题
    document.title = "Mark-李的博客"
    
    const timer = setTimeout(() => {
      setShowSecondaryText(true)
    }, 3000) // 3秒后显示副标题

    return () => clearTimeout(timer)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-400"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 渐变背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900" />
      
      {/* 网格背景 */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* 粒子背景 */}
      <ParticleBackground />

      {/* 主要内容 */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center space-y-12 max-w-4xl mx-auto">
          {/* 主标题 - 打字机效果 */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent leading-tight whitespace-nowrap">
            <TypewriterText text="欢迎来到我的博客空间" speed={120} />
          </h1>

          {/* 副标题 - 闪烁效果 */}
          {showSecondaryText && (
            <BlinkingText 
              text="世界很大，不妨去看看"
              className="text-xl md:text-3xl text-gray-300 font-light whitespace-nowrap"
            />
          )}

          {/* 进入按钮 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Link href="/blog">
              <Button 
                size="lg"
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <span className="flex items-center gap-2">
                  进入博客
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              </Button>
            </Link>

            <Link href="/about">
              <Button 
                variant="outline"
                size="lg"
                className="px-8 py-4 border-2 border-blue-400/50 text-blue-400 hover:bg-blue-400/10 hover:border-blue-400 rounded-full transition-all duration-300 hover:scale-105"
              >
                了解更多
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
