import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message, conversationId } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      )
    }

    // 使用硬编码的配置，直到环境变量正确设置
    const apiKey = process.env.DIFY_API_KEY || "app-VgehRhENF80ypB3ogmhneojk"
    const baseUrl = "http://localhost"

    console.log('API Key exists:', !!apiKey)
    console.log('Base URL:', baseUrl)

    // 构建请求体
    const requestBody: any = {
      inputs: {},
      query: message,
      response_mode: 'streaming',
      user: 'web-user'
    }

    // 如果有对话ID，则添加到请求中
    if (conversationId) {
      requestBody.conversation_id = conversationId
    }

    console.log('Request body:', JSON.stringify(requestBody, null, 2))

    // 调用Dify API
    const apiUrl = `${baseUrl}/v1/chat-messages`
    console.log('Calling API:', apiUrl)

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    console.log('API Response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Dify API error:', response.status, errorText)
      return NextResponse.json(
        { error: `AI service error: ${response.status} ${errorText || 'Unknown error'}` },
        { status: response.status }
      )
    }

    // 处理流式响应
    const reader = response.body?.getReader()
    if (!reader) {
      return NextResponse.json(
        { error: 'Failed to read response stream' },
        { status: 500 }
      )
    }

    // 创建流式响应
    const stream = new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = new TextDecoder().decode(value)
            const lines = chunk.split('\n').filter(line => line.trim())

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6)
                if (data === '[DONE]') {
                  controller.close()
                  return
                }

                try {
                  const parsed = JSON.parse(data)
                  controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(parsed)}\n\n`))
                } catch (e) {
                  // 忽略解析错误的行
                  console.warn('Failed to parse SSE data:', data)
                }
              }
            }
          }
        } catch (error) {
          console.error('Stream processing error:', error)
          controller.error(error)
        } finally {
          reader.releaseLock()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 