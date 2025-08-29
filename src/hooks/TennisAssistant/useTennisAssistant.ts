import { useState, useEffect, useCallback, useRef } from 'react'
import { getWebSocketService } from '@/services/websocketService'

export interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  isTyping?: boolean
}

interface TennisAssistantConfig {
  userToken?: string
  userId?: number
  soundEnabled?: boolean
}

export const useTennisAssistant = (config: TennisAssistantConfig = {}) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(config.soundEnabled ?? true)
  const [connectionAttempts, setConnectionAttempts] = useState(0)
  const [lastActivity, setLastActivity] = useState<Date>(new Date())

  const wsService = useRef(getWebSocketService())
  const activityTimer = useRef<NodeJS.Timeout | null>(null)

  // Audio notifications
  const playNotificationSound = useCallback(() => {
    if (!soundEnabled) return
    
    try {
      const audio = new Audio('/sounds/notification.mp3')
      audio.volume = 0.3
      audio.play().catch(() => {
        // Fallback: create a simple beep using Web Audio API
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        
        oscillator.frequency.value = 800
        oscillator.type = 'sine'
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)
        
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.1)
      })
    } catch (error) {
      console.log('Could not play notification sound:', error)
    }
  }, [soundEnabled])

  const addMessage = useCallback((type: 'user' | 'assistant', content: string) => {
    const message: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, message])
  }, [])

  const handleWebSocketMessage = useCallback((data: any) => {
    setLastActivity(new Date())
    
    switch (data.type) {
      case 'tool_response':
        setIsLoading(false)
        setIsAuthenticating(false)
        
        if (data.success) {
          let messageContent = ''
          
          // Handle welcome message
          if (data.data?.message?.includes('conectado')) {
            messageContent = data.data.message + '\n\n🎾 ¿En qué puedo ayudarte hoy?'
          }
          // Handle tool results
          else if (data.data?.result) {
            const result = data.data.result
            if (result.success && result.data) {
              messageContent = result.message || 'Aquí tienes la información:'
            } else {
              messageContent = result.message || 'Operación completada'
            }
          } else {
            messageContent = data.data?.message || 'Operación completada'
          }
          
          addMessage('assistant', messageContent)
          playNotificationSound()
        } else {
          addMessage('assistant', `❌ ${data.data?.error || 'Error en la operación'}`)
        }
        break

      case 'pong':
        console.log('🏓 Pong received')
        break

      case 'error':
        setIsLoading(false)
        setIsAuthenticating(false)
        addMessage('assistant', `❌ Error: ${data.data?.error || data.message || 'Error desconocido'}`)
        break

      default:
        console.log('Unknown message type:', data.type, data)
    }
  }, [addMessage, playNotificationSound])

  const sendMessage = useCallback((message: string) => {
    if (!message.trim() || !wsService.current.isConnected()) return

    addMessage('user', message)
    setIsLoading(true)
    setLastActivity(new Date())

    wsService.current.sendToolCall(
      message,
      config.userId,
      config.userToken
    )
  }, [config.userId, config.userToken, addMessage])

  const connect = useCallback(async () => {
    try {
      await wsService.current.connect()
    } catch (error) {
      console.error('Failed to connect:', error)
    }
  }, [])

  const disconnect = useCallback(() => {
    wsService.current.disconnect()
  }, [])

  // Setup WebSocket listeners
  useEffect(() => {
    const ws = wsService.current

    ws.on('tool_response', handleWebSocketMessage)
    ws.on('error', handleWebSocketMessage)
    ws.on('pong', handleWebSocketMessage)
    ws.on('message', handleWebSocketMessage)

    const unsubscribeConnection = ws.onConnection((connected) => {
      setIsConnected(connected)
      setConnectionAttempts(ws.getReconnectAttempts())
    })

    return () => {
      ws.off('tool_response')
      ws.off('error')
      ws.off('pong')
      ws.off('message')
      unsubscribeConnection()
    }
  }, [handleWebSocketMessage])

  // Auto-disconnect cleanup
  useEffect(() => {
    const timer = activityTimer.current
    return () => {
      if (timer) {
        clearTimeout(timer)
      }
    }
  }, [])

  return {
    // State
    messages,
    isConnected,
    isLoading,
    isAuthenticating,
    soundEnabled,
    connectionAttempts,
    lastActivity,

    // Actions
    sendMessage,
    addMessage,
    connect,
    disconnect,
    setSoundEnabled,
    playNotificationSound,

    // Utils
    clearMessages: () => setMessages([])
  }
}