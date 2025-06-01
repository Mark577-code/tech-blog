export interface ChatMessage {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  isStreaming?: boolean
}

export interface ChatConversation {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: Date
  updatedAt: Date
}

export interface DifyStreamResponse {
  event: string
  task_id?: string
  id?: string
  message_id?: string
  conversation_id?: string
  answer?: string
  created_at?: number
}

export interface ChatError {
  message: string
  code?: string
} 