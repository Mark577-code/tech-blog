"use client"

import { createContext, useContext, useReducer, ReactNode } from 'react'
import type { 
  Live2DState, 
  ModelConfig, 
  UserPreferences, 
  ConversationMessage,
  EmotionState 
} from '@/types/live2d'

const defaultUserPreferences: UserPreferences = {
  conversationStyle: 'casual',
  interactionFrequency: 'medium',
  enableVoice: true,
  enableMotions: true,
  preferredTopics: [],
  language: 'zh'
}

const initialState: Live2DState = {
  isLoading: false,
  isInitialized: false,
  error: null,
  currentModel: null,
  availableModels: [],
  isDialogueVisible: false,
  currentDialogue: null,
  isControlPanelVisible: false,
  userPreferences: defaultUserPreferences,
  conversationHistory: []
}

type Live2DAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_INITIALIZED'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CURRENT_MODEL'; payload: ModelConfig | null }
  | { type: 'SET_AVAILABLE_MODELS'; payload: ModelConfig[] }
  | { type: 'SET_DIALOGUE_VISIBLE'; payload: boolean }
  | { type: 'SET_CURRENT_DIALOGUE'; payload: string | null }
  | { type: 'SET_CONTROL_PANEL_VISIBLE'; payload: boolean }
  | { type: 'UPDATE_USER_PREFERENCES'; payload: Partial<UserPreferences> }
  | { type: 'ADD_CONVERSATION_MESSAGE'; payload: ConversationMessage }
  | { type: 'CLEAR_CONVERSATION_HISTORY' }
  | { type: 'SWITCH_MODEL'; payload: string }
  | { type: 'SHOW_MESSAGE'; payload: { text: string; emotion?: EmotionState; duration?: number } }
  | { type: 'HIDE_MESSAGE' }
  | { type: 'TOGGLE_CONTROL_PANEL' }

function live2dReducer(state: Live2DState, action: Live2DAction): Live2DState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_INITIALIZED':
      return { ...state, isInitialized: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    case 'SET_CURRENT_MODEL':
      return { ...state, currentModel: action.payload }
    case 'SET_AVAILABLE_MODELS':
      return { ...state, availableModels: action.payload }
    case 'SET_DIALOGUE_VISIBLE':
      return { ...state, isDialogueVisible: action.payload }
    case 'SET_CURRENT_DIALOGUE':
      return { ...state, currentDialogue: action.payload }
    case 'SET_CONTROL_PANEL_VISIBLE':
      return { ...state, isControlPanelVisible: action.payload }
    case 'UPDATE_USER_PREFERENCES':
      return { 
        ...state, 
        userPreferences: { ...state.userPreferences, ...action.payload }
      }
    case 'ADD_CONVERSATION_MESSAGE':
      return { 
        ...state, 
        conversationHistory: [...state.conversationHistory, action.payload]
      }
    case 'CLEAR_CONVERSATION_HISTORY':
      return { ...state, conversationHistory: [] }
    case 'SWITCH_MODEL':
      const model = state.availableModels.find(m => m.id === action.payload)
      return model ? { ...state, currentModel: model } : state
    case 'SHOW_MESSAGE':
      return { 
        ...state, 
        currentDialogue: action.payload.text,
        isDialogueVisible: true 
      }
    case 'HIDE_MESSAGE':
      return { 
        ...state, 
        isDialogueVisible: false,
        currentDialogue: null 
      }
    case 'TOGGLE_CONTROL_PANEL':
      return { 
        ...state, 
        isControlPanelVisible: !state.isControlPanelVisible 
      }
    default:
      return state
  }
}

interface Live2DContextType {
  state: Live2DState
  dispatch: React.Dispatch<Live2DAction>
}

const Live2DContext = createContext<Live2DContextType | undefined>(undefined)

export function Live2DProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(live2dReducer, initialState)

  return (
    <Live2DContext.Provider value={{state, dispatch}}>
      {children}
    </Live2DContext.Provider>
  )
}

export function useLive2DStore() {
  const context = useContext(Live2DContext)
  if (!context) {
    throw new Error('useLive2DStore must be used within a Live2DProvider')
  }

  const { state, dispatch } = context

  return {
    ...state,
    setLoading: (loading: boolean) => dispatch({ type: 'SET_LOADING', payload: loading }),
    setInitialized: (initialized: boolean) => dispatch({ type: 'SET_INITIALIZED', payload: initialized }),
    setError: (error: string | null) => dispatch({ type: 'SET_ERROR', payload: error }),
    setCurrentModel: (model: ModelConfig | null) => dispatch({ type: 'SET_CURRENT_MODEL', payload: model }),
    setAvailableModels: (models: ModelConfig[]) => dispatch({ type: 'SET_AVAILABLE_MODELS', payload: models }),
    setDialogueVisible: (visible: boolean) => dispatch({ type: 'SET_DIALOGUE_VISIBLE', payload: visible }),
    setCurrentDialogue: (dialogue: string | null) => dispatch({ type: 'SET_CURRENT_DIALOGUE', payload: dialogue }),
    setControlPanelVisible: (visible: boolean) => dispatch({ type: 'SET_CONTROL_PANEL_VISIBLE', payload: visible }),
    updateUserPreferences: (preferences: Partial<UserPreferences>) => dispatch({ type: 'UPDATE_USER_PREFERENCES', payload: preferences }),
    addConversationMessage: (message: ConversationMessage) => dispatch({ type: 'ADD_CONVERSATION_MESSAGE', payload: message }),
    clearConversationHistory: () => dispatch({ type: 'CLEAR_CONVERSATION_HISTORY' }),
    switchModel: (modelId: string) => dispatch({ type: 'SWITCH_MODEL', payload: modelId }),
    showMessage: (text: string, emotion?: EmotionState, duration = 3000) => {
      dispatch({ type: 'SHOW_MESSAGE', payload: { text, emotion, duration } })
      
      // 自动隐藏消息
      if (duration > 0) {
        setTimeout(() => {
          dispatch({ type: 'HIDE_MESSAGE' })
        }, duration)
      }
    },
    hideMessage: () => dispatch({ type: 'HIDE_MESSAGE' }),
    toggleControlPanel: () => dispatch({ type: 'TOGGLE_CONTROL_PANEL' })
  }
}

// 选择器hooks
export const useLive2DModel = () => {
  const { state } = useContext(Live2DContext) || { state: initialState }
  return state.currentModel
}

export const useLive2DDialogue = () => {
  const { state } = useContext(Live2DContext) || { state: initialState }
  return {
    isVisible: state.isDialogueVisible,
    text: state.currentDialogue
  }
}

export const useLive2DPreferences = () => {
  const { state } = useContext(Live2DContext) || { state: initialState }
  return state.userPreferences
}

export const useLive2DHistory = () => {
  const { state } = useContext(Live2DContext) || { state: initialState }
  return state.conversationHistory
} 