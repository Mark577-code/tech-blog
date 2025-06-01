import { useState, useCallback, useRef } from 'react'
import { ChatMessage, DifyStreamResponse } from '@/types/chat'

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return

    setIsLoading(true)
    setError(null)

    // 添加用户消息
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content: content.trim(),
      role: 'user',
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])

    // 创建AI响应消息占位符
    const aiMessage: ChatMessage = {
      id: `ai-${Date.now()}`,
      content: '',
      role: 'assistant',
      timestamp: new Date(),
      isStreaming: true,
    }

    setMessages(prev => [...prev, aiMessage])

    try {
      // 创建AbortController用于取消请求
      abortControllerRef.current = new AbortController()

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content.trim(),
          conversationId,
        }),
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to send message')
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('Failed to read response stream')
      }

      let accumulatedContent = ''

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = new TextDecoder().decode(value)
          const lines = chunk.split('\n').filter(line => line.trim())

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') continue

              try {
                const parsed: DifyStreamResponse = JSON.parse(data)
                
                if (parsed.event === 'agent_message' && parsed.answer) {
                  accumulatedContent += parsed.answer
                  
                  // 更新AI消息内容
                  setMessages(prev => prev.map(msg => 
                    msg.id === aiMessage.id 
                      ? { ...msg, content: accumulatedContent }
                      : msg
                  ))
                } else if (parsed.event === 'message_end') {
                  // 保存conversation_id用于后续对话
                  if (parsed.conversation_id && !conversationId) {
                    setConversationId(parsed.conversation_id)
                  }
                  
                  // 标记流式传输结束
                  setMessages(prev => prev.map(msg => 
                    msg.id === aiMessage.id 
                      ? { ...msg, isStreaming: false }
                      : msg
                  ))
                }
              } catch (e) {
                console.warn('Failed to parse SSE data:', data)
              }
            }
          }
        }
      } finally {
        reader.releaseLock()
      }

    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Request was aborted')
        return
      }

      console.error('Chat error:', error)
      setError(error.message || 'Failed to send message')
      
      // 移除失败的AI消息
      setMessages(prev => prev.filter(msg => msg.id !== aiMessage.id))
    } finally {
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }, [conversationId, isLoading])

  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      setIsLoading(false)
    }
  }, [])

  const clearMessages = useCallback(() => {
    setMessages([])
    setConversationId(null)
    setError(null)
  }, [])

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    stopGeneration,
    clearMessages,
  }
} 