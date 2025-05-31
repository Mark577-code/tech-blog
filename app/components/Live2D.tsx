"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { useMediaQuery } from "@/hooks/use-media-query"
import dynamic from "next/dynamic"

declare global {
  interface Window {
    L2Dwidget: any
    difyChatbotConfig: any
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
                "tap body": "点击我旁边的聊天按钮和我对话吧！",
                "tap face": "我是你的AI助手，有什么可以帮你的吗？",
              },
            },
          })

          // 添加自定义聊天按钮
          setTimeout(() => {
            addChatButton()
          }, 2000)
        } catch (error) {
          console.error("Failed to initialize Live2D:", error)
        }
      }
    }

    const addChatButton = () => {
      // 移除现有的聊天按钮
      const existingButton = document.getElementById('live2d-chat-button')
      if (existingButton) {
        existingButton.remove()
      }

      // 创建聊天按钮容器
      const chatButtonContainer = document.createElement('div')
      chatButtonContainer.id = 'live2d-chat-button'
      chatButtonContainer.style.cssText = `
        position: fixed;
        right: ${isMobile ? '130px' : '180px'};
        bottom: ${isMobile ? '120px' : '70px'};
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        z-index: 9999;
        transition: all 0.3s ease;
        animation: pulse 2s infinite;
      `

      // 添加悬停效果
      chatButtonContainer.onmouseenter = () => {
        chatButtonContainer.style.transform = 'scale(1.1)'
      }
      chatButtonContainer.onmouseleave = () => {
        chatButtonContainer.style.transform = 'scale(1)'
      }

      // 添加SVG图标
      chatButtonContainer.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `

      // 添加CSS动画
      if (!document.getElementById('live2d-chat-styles')) {
        const style = document.createElement('style')
        style.id = 'live2d-chat-styles'
        style.textContent = `
          @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(102, 126, 234, 0); }
            100% { box-shadow: 0 0 0 0 rgba(102, 126, 234, 0); }
          }
        `
        document.head.appendChild(style)
      }
      
      // 添加点击事件 - 触发Dify聊天窗口
      chatButtonContainer.addEventListener('click', () => {
        // 等待Dify加载完成后触发聊天窗口
        const checkDifyAndOpen = () => {
          const difyButton = document.getElementById('dify-chatbot-bubble-button')
          if (difyButton) {
            difyButton.click()
          } else {
            // 如果Dify还没加载完成，显示提示
            alert('AI聊天助手正在加载中，请稍后再试...')
          }
        }
        
        // 延迟一下确保Dify已经加载
        setTimeout(checkDifyAndOpen, 100)
      })
      
      document.body.appendChild(chatButtonContainer)
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
      // 清理聊天按钮
      const chatButton = document.getElementById('live2d-chat-button')
      if (chatButton) {
        chatButton.remove()
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
