export interface Live2DState {
  isLoading: boolean
  isInitialized: boolean
  error: string | null
  currentModel: ModelConfig | null
  availableModels: ModelConfig[]
  isDialogueVisible: boolean
  currentDialogue: string | null
  isControlPanelVisible: boolean
  userPreferences: UserPreferences
  conversationHistory: ConversationMessage[]
}

export interface ModelConfig {
  id: string
  name: string
  path: string
  preview?: string
  description?: string
  size?: number
  author?: string
  version?: string
  emotions?: EmotionState[]
  motions?: MotionConfig[]
}

export interface UserPreferences {
  conversationStyle: 'casual' | 'formal' | 'friendly' | 'professional'
  interactionFrequency: 'low' | 'medium' | 'high'
  enableVoice: boolean
  enableMotions: boolean
  preferredTopics: string[]
  language: 'zh' | 'en' | 'ja'
}

export interface ConversationMessage {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: number
  emotion?: EmotionState
}

export type EmotionState = 
  | 'neutral'
  | 'happy'
  | 'sad'
  | 'angry'
  | 'surprised'
  | 'confused'
  | 'excited'
  | 'thinking'
  | 'sleepy'

export interface MotionConfig {
  name: string
  file: string
  duration?: number
  priority?: number
}

export interface Live2DDialogue {
  text: string
  emotion?: EmotionState
  duration?: number
}

export interface Live2DModelStatus {
  loaded: boolean
  error?: string
  progress?: number
} 