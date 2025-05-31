"use client"

import { useState, useEffect, useRef } from "react"
import { FaTimes } from "react-icons/fa"
import { Card } from "@/components/ui/card"
import Live2D from "./Live2D"

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([])
  const [input, setInput] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, isUser: true }])
      setInput("")
      // 简单的AI回复逻辑
      setTimeout(() => {
        let response = "抱歉，我不太明白你的问题。"
        if (input.includes("你是谁")) {
          response = "我是这个技术博客网站的AI助手，可以回答一些关于网站内容的基本问题。"
        } else if (input.includes("你会什么")) {
          response = "我可以回答关于这个网站的基本问题，比如网站的主要内容、功能等。如果你有具体的问题，可以直接问我。"
        }
        setMessages((prev) => [...prev, { text: response, isUser: false }])
      }, 1000)
    }
  }

  return (
    <>
      <Live2D />
      <div ref={containerRef} className="fixed bottom-4 right-4 z-50">
        {isOpen && (
          <Card className="mb-4 w-80 overflow-hidden bg-background/95 backdrop-blur-sm border-primary/20">
            <div className="bg-primary/10 p-4 flex justify-between items-center">
              <h3 className="text-primary font-bold">AI助手</h3>
              <button onClick={() => setIsOpen(false)} className="text-primary hover:text-primary/80">
                <FaTimes />
              </button>
            </div>
            <div className="h-80 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`rounded-lg p-2 max-w-[80%] ${
                      msg.isUser ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-border">
              <div className="flex">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="输入消息..."
                  className="flex-1 bg-background text-foreground px-4 py-2 rounded-l-full focus:outline-none"
                />
                <button
                  onClick={handleSend}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-r-full hover:bg-primary/90 transition-colors"
                >
                  发送
                </button>
              </div>
            </div>
          </Card>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
          style={{ position: "absolute", right: "170px", bottom: "0" }}
        >
          <span className="sr-only">打开AI助手</span>
          {!isOpen && "💬"}
        </button>
      </div>
    </>
  )
}

export default AIAssistant
