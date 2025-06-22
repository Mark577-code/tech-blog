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
          // 查找Live2D容器
          const container = document.getElementById('live2d-container')
          if (!container) {
            console.warn('Live2D container not found')
            return
          }

          window.L2Dwidget.init({
            model: {
              jsonPath:
                "https://fastly.jsdelivr.net/gh/stevenjoezhang/live2d-widget-models@latest/assets/z16.model.json",
              scale: 0.7,
            },
            display: {
              superSample: 2,
              width: 112,
              height: 112,
              position: "fixed",
              hOffset: 0,
              vOffset: 0,
            },
            mobile: {
              show: true,
              scale: 0.7,
            },
            react: {
              opacityDefault: 0.8,
              opacityOnHover: 1.0,
            },
            dialog: {
              enable: true,
              script: {
                "tap body": "我是Live2D看板娘，欢迎来到这个技术博客！",
                "tap face": "很高兴见到你～ 希望你在这里能学到有用的知识！",
                "tap idle": "你要干嘛呀？",
              },
            },
          })

          // 等待Live2D加载完成后，将其移动到指定容器
          setTimeout(() => {
            const canvas = document.querySelector('#L2Dwidget')
            if (canvas && container) {
              console.log('Moving Live2D to container...')
              // 清空容器
              container.innerHTML = ''
              // 移动canvas到容器内
              container.appendChild(canvas)
              // 调整样式，确保最高z-index
              const canvasElement = canvas as HTMLElement
              canvasElement.style.position = 'relative'
              canvasElement.style.left = '0'
              canvasElement.style.top = '0'
              canvasElement.style.transform = 'none'
              canvasElement.style.width = '112px'
              canvasElement.style.height = '112px'
              canvasElement.style.zIndex = '999999' // 进一步提高z-index
              canvasElement.style.pointerEvents = 'auto'
              canvasElement.style.display = 'block'
              canvasElement.style.visibility = 'visible'
              // 确保容器也有正确的z-index
              container.style.zIndex = '999999'
              container.style.position = 'relative'
              // 确保父容器不遮挡
              const parentCard = container.closest('.fixed')
              if (parentCard) {
                (parentCard as HTMLElement).style.zIndex = '100000'
              }
              
              // 确保Live2D对话框样式正确
              setTimeout(() => {
                const messageElements = document.querySelectorAll('.message-wrap, .tip-wrap, #waifu-message, #waifu-tool')
                messageElements.forEach(el => {
                  const element = el as HTMLElement
                  element.style.zIndex = '999999'
                  element.style.position = 'fixed'
                })
              }, 2000)
              
              console.log('Live2D moved successfully, z-index:', canvasElement.style.zIndex)
            } else {
              console.warn('Live2D canvas or container not found')
            }
          }, 1000)

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
