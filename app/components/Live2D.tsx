"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { useMediaQuery } from "@/hooks/use-media-query"
import dynamic from "next/dynamic"

declare global {
  interface Window {
    L2Dwidget: any
  }
}

const Live2D = () => {
  const initialized = useRef(false)
  const scriptRef = useRef<HTMLScriptElement | null>(null)
  const pathname = usePathname()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [isVisible, setIsVisible] = useState(true)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    const initWidget = () => {
      if (window.L2Dwidget) {
        try {
          window.L2Dwidget.init({
            model: {
              jsonPath:
                "https://fastly.jsdelivr.net/gh/stevenjoezhang/live2d-widget-models@latest/assets/z16.model.json",
              scale: isMobile ? 0.5 : 1,
            },
            display: {
              position: "right",
              width: isMobile ? 100 : 150,
              height: isMobile ? 200 : 300,
              hOffset: 20,
              vOffset: isMobile ? 100 : 50,
            },
            mobile: {
              show: true,
              scale: 0.5,
            },
            react: {
              opacityDefault: 0.7,
              opacityOnHover: 0.9,
            },
            dialog: {
              enable: true,
              script: {
                "tap body": "我是Live2D看板娘，点击右下角的蓝色按钮可以和AI助手聊天哦！",
                "tap face": "想要聊天的话，请使用页面右下角的AI助手～",
              },
            },
          })
        } catch (error) {
          console.error("Failed to initialize Live2D:", error)
        }
      }
    }

    const loadScript = () => {
      if (!scriptRef.current) {
        const script = document.createElement("script")
        script.src = "https://fastly.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/autoload.js"
        script.async = true
        script.crossOrigin = "anonymous"

        script.onload = () => {
          if (window.L2Dwidget) {
            initialized.current = true
            initWidget()
          }
        }

        script.onerror = (error) => {
          console.error("Failed to load Live2D script:", error)
        }

        scriptRef.current = script
        document.body.appendChild(script)
      }
    }

    // 当路由变化时，确保Live2D可见
    setIsVisible(true)

    // 初始化Live2D
    if (!initialized.current) {
      loadScript()
    } else {
      initWidget()
    }

    return () => {
      if (window.L2Dwidget && window.L2Dwidget.clearWidget) {
        window.L2Dwidget.clearWidget()
      }
    }
  }, [pathname, isMobile, isClient])

  if (!isClient || !isVisible) return null

  return null // 不需要返回任何JSX，所有内容都通过DOM操作添加
}

// 使用动态导入防止SSR问题
export default dynamic(() => Promise.resolve(Live2D), {
  ssr: false,
})
