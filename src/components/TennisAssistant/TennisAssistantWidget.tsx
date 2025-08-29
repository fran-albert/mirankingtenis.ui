'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { MessageCircle, X, Send, Bot, User, Zap, Wifi, WifiOff, Volume2, VolumeX, Minimize2, Maximize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import QuickActions from './QuickActions'
import ConnectionStatus from './ConnectionStatus'
import { useTennisAssistant } from '@/hooks/TennisAssistant/useTennisAssistant'
import styles from './TennisAssistant.module.css'

interface TennisAssistantWidgetProps {
  userToken?: string
  userId?: number
}

export default function TennisAssistantWidget({ userToken, userId }: TennisAssistantWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [inputValue, setInputValue] = useState('')
  
  const {
    messages,
    isConnected,
    isLoading,
    isAuthenticating,
    soundEnabled,
    connectionAttempts,
    lastActivity,
    sendMessage: sendMessageToAssistant,
    connect,
    disconnect,
    setSoundEnabled
  } = useTennisAssistant({
    userToken,
    userId,
    soundEnabled: true
  })
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const activityTimer = useRef<NodeJS.Timeout | null>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'end'
    })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Auto-hide after inactivity
  useEffect(() => {
    if (activityTimer.current) {
      clearTimeout(activityTimer.current)
    }
    
    if (isOpen && !isLoading) {
      activityTimer.current = setTimeout(() => {
        setIsMinimized(true)
      }, 5 * 60 * 1000) // 5 minutes
    }
    
    return () => {
      if (activityTimer.current) {
        clearTimeout(activityTimer.current)
      }
    }
  }, [lastActivity, isOpen, isLoading])

  const sendMessage = useCallback(() => {
    if (!inputValue.trim()) return
    
    sendMessageToAssistant(inputValue.trim())
    setInputValue('')
  }, [inputValue, sendMessageToAssistant])

  const handleQuickAction = useCallback((message: string) => {
    sendMessageToAssistant(message)
  }, [sendMessageToAssistant])

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }, [sendMessage])

  const toggleWidget = useCallback(() => {
    setIsOpen(!isOpen)
    setIsMinimized(false)
    if (!isOpen && !isConnected) {
      connect()
    }
  }, [isOpen, isConnected, connect])

  const toggleMinimize = useCallback(() => {
    setIsMinimized(!isMinimized)
  }, [isMinimized])

  const getConnectionStatus = useCallback(() => {
    if (!isConnected) {
      if (connectionAttempts > 0) {
        return { text: '🔄 Reconectando...', color: 'text-yellow-400' }
      }
      return { text: '🔴 Desconectado', color: 'text-red-400' }
    }
    if (isAuthenticating) return { text: '🟡 Autenticando...', color: 'text-yellow-400' }
    return { text: '🟢 Conectado', color: 'text-green-400' }
  }, [isConnected, isAuthenticating, connectionAttempts])

  const status = getConnectionStatus()

  return (
    <div className="fixed bottom-4 right-4 sm:right-4 sm:bottom-4 max-sm:bottom-2 max-sm:right-2 z-50 font-sans">
      {/* Chat Window */}
      {isOpen && (
        <div className={`transition-all duration-500 ease-out mb-4 max-sm:mb-2 ${
          isMinimized ? 'scale-95 opacity-0 pointer-events-none' : 'scale-100 opacity-100'
        } ${styles.chatContainer}`}>
          <Card className="w-96 max-w-[calc(100vw-1rem)] sm:max-w-[calc(100vw-2rem)] h-[32rem] max-h-[calc(100vh-4rem)] sm:max-h-[calc(100vh-6rem)] max-sm:w-[calc(100vw-1rem)] shadow-2xl border-0 bg-gradient-to-br from-white via-slate-50 to-slate-100 backdrop-blur-sm overflow-hidden flex flex-col">
            {/* Header */}
            <div className="relative">
              {/* Tennis court pattern background */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-700 via-slate-800 to-slate-700"></div>
              <div className="absolute inset-0" style={{
                backgroundImage: `repeating-linear-gradient(
                  90deg,
                  transparent,
                  transparent 2px,
                  rgba(255,255,255,0.1) 2px,
                  rgba(255,255,255,0.1) 4px
                )`
              }}></div>
              
              <div className="relative flex items-center justify-between p-4 max-sm:p-3 text-white">
                <div className="flex items-center gap-3 max-sm:gap-2">
                  <div className="relative">
                    <div className="w-10 h-10 max-sm:w-8 max-sm:h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <Bot className="h-5 w-5 max-sm:h-4 max-sm:w-4 text-white" />
                    </div>
                    {isConnected && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 max-sm:w-3 max-sm:h-3 bg-green-500 rounded-full animate-pulse border-2 border-white"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg max-sm:text-base">MRTenis Bot</h3>
                    <p className={`text-sm max-sm:text-xs ${status.color} font-medium flex items-center gap-1`}>
                      {isConnected ? <Wifi className="w-3 h-3 max-sm:w-2 max-sm:h-2" /> : <WifiOff className="w-3 h-3 max-sm:w-2 max-sm:h-2" />}
                      {status.text}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 max-sm:gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="text-white hover:bg-white hover:bg-opacity-20 h-8 w-8 max-sm:h-7 max-sm:w-7 p-0 controlButton"
                    title={soundEnabled ? 'Silenciar notificaciones' : 'Activar notificaciones'}
                  >
                    {soundEnabled ? <Volume2 className="h-4 w-4 max-sm:h-3 max-sm:w-3" /> : <VolumeX className="h-4 w-4 max-sm:h-3 max-sm:w-3" />}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleMinimize}
                    className="text-white hover:bg-white hover:bg-opacity-20 h-8 w-8 max-sm:h-7 max-sm:w-7 p-0"
                    title="Minimizar"
                  >
                    <Minimize2 className="h-4 w-4 max-sm:h-3 max-sm:w-3" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-white hover:bg-opacity-20 h-8 w-8 max-sm:h-7 max-sm:w-7 p-0"
                    title="Cerrar"
                  >
                    <X className="h-4 w-4 max-sm:h-3 max-sm:w-3" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4 max-sm:p-3 bg-gradient-to-b from-transparent to-white/50">
              <div className="space-y-4 max-sm:space-y-3">
                {messages.length === 0 && (
                  <div className="text-center py-8 max-sm:py-6 text-slate-500">
                    <Bot className="h-12 w-12 max-sm:h-10 max-sm:w-10 mx-auto mb-3 text-slate-400" />
                    <p className="text-sm max-sm:text-xs font-medium">¡Hola! Soy tu asistente de tenis 🎾</p>
                    <p className="text-xs max-sm:text-[10px] mt-1">Pregúntame por tus partidos, reserva turnos y más</p>
                  </div>
                )}
                
                {messages.map((message, index) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${styles.messageSlideIn} ${
                      message.type === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {message.type === 'assistant' && (
                      <div className="w-9 h-9 max-sm:w-7 max-sm:h-7 bg-gradient-to-br from-slate-500 to-slate-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                        <Bot className="h-4 w-4 max-sm:h-3 max-sm:w-3 text-white" />
                      </div>
                    )}
                    
                    <div className="max-w-xs max-sm:max-w-[70%] group">
                      <div
                        className={`px-4 py-3 max-sm:px-3 max-sm:py-2 rounded-2xl text-sm max-sm:text-xs shadow-sm ${styles.messageHover} ${
                          message.type === 'user'
                            ? 'bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-br-md shadow-slate-200 messageUser'
                            : 'bg-white text-slate-800 rounded-bl-md shadow-slate-200 border border-slate-100 messageAssistant'
                        }`}
                      >
                        <p className="whitespace-pre-wrap leading-relaxed max-sm:leading-normal">{message.content}</p>
                      </div>
                      
                      <p className={`text-xs max-sm:text-[10px] opacity-70 mt-1 px-1 ${
                        message.type === 'user' ? 'text-right' : 'text-left'
                      }`}>
                        {message.timestamp.toLocaleTimeString('es-AR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>

                    {message.type === 'user' && (
                      <div className="w-9 h-9 max-sm:w-7 max-sm:h-7 bg-gradient-to-br from-slate-400 to-slate-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                        <User className="h-4 w-4 max-sm:h-3 max-sm:w-3 text-white" />
                      </div>
                    )}
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex gap-3 animate-in slide-in-from-bottom duration-300">
                    <div className="w-9 h-9 bg-gradient-to-br from-slate-500 to-slate-600 rounded-full flex items-center justify-center shadow-md">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow-sm border border-slate-100">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>

            {/* Quick Actions - Only show when no messages and connected */}
            {messages.length === 0 && isConnected && (
              <QuickActions 
                onActionClick={handleQuickAction}
                disabled={!isConnected || isLoading}
              />
            )}

            {/* Connection Status - Only show when disconnected and no messages */}
            {!isConnected && messages.length === 0 && (
              <ConnectionStatus 
                isConnected={isConnected}
                connectionAttempts={connectionAttempts}
                isAuthenticating={isAuthenticating}
                onReconnect={connect}
              />
            )}

            {/* Input Area */}
            <div className="p-4 max-sm:p-3 bg-white/80 backdrop-blur-sm border-t border-slate-100">
              {/* Subtle connection status when there are messages */}
              {messages.length > 0 && !isConnected && (
                <div className="flex items-center gap-2 mb-3 max-sm:mb-2 p-2 max-sm:p-1.5 bg-red-50 text-red-600 rounded-lg text-xs max-sm:text-[10px]">
                  <WifiOff className="w-4 h-4 max-sm:w-3 max-sm:h-3" />
                  <span>Sin conexión - Los mensajes no se enviarán</span>
                </div>
              )}
              
              <div className="flex gap-3 max-sm:gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe tu mensaje..."
                  disabled={!isConnected || isLoading}
                  className="flex-1 border-slate-200 focus:border-slate-400 focus:ring-slate-400 rounded-xl messageInput text-sm max-sm:text-xs max-sm:h-9"
                />
                <Button 
                  onClick={sendMessage}
                  disabled={!inputValue.trim() || !isConnected || isLoading}
                  size="sm"
                  className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 rounded-xl px-4 max-sm:px-3 max-sm:h-9 shadow-md hover:shadow-lg transition-all duration-200"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 max-sm:w-3 max-sm:h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Send className="h-4 w-4 max-sm:h-3 max-sm:w-3" />
                  )}
                </Button>
              </div>
              
              {!isConnected && messages.length === 0 && (
                <div className="flex items-center gap-2 mt-3 p-2 bg-red-50 text-red-600 rounded-lg text-xs">
                  <WifiOff className="w-4 h-4" />
                  <span>
                    {connectionAttempts > 0 
                      ? `Reintentando conexión... (${connectionAttempts}/10)`
                      : 'Conectando al servidor...'
                    }
                  </span>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Floating Button */}
      <Button
        onClick={toggleWidget}
        className={`relative h-12 w-12 max-sm:h-10 max-sm:w-10 rounded-full shadow-xl transition-all duration-300 transform hover:scale-110 max-sm:hover:scale-105 group assistantButton ${
          isOpen 
            ? 'bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800' 
            : `bg-gradient-to-r from-slate-600 via-slate-700 to-slate-600 hover:from-slate-700 hover:via-slate-800 hover:to-slate-700 ${styles.floatingButton}`
        }`}
        title={isOpen ? 'Cerrar chat' : 'Abrir asistente de tenis'}
      >
        {/* Tennis ball pattern background */}
        {!isOpen && (
          <div className="absolute inset-0 rounded-full opacity-20" style={{
            backgroundImage: `radial-gradient(circle at 30% 30%, white 2px, transparent 2px),
                             radial-gradient(circle at 70% 30%, white 2px, transparent 2px),
                             radial-gradient(circle at 50% 70%, white 2px, transparent 2px)`
          }}></div>
        )}
        
        <div className="relative z-10 transition-transform duration-300 group-hover:scale-110">
          {isOpen ? (
            <X className="h-5 w-5 max-sm:h-4 max-sm:w-4 text-white" />
          ) : (
            <MessageCircle className="h-5 w-5 max-sm:h-4 max-sm:w-4 text-white" />
          )}
        </div>
        
        {/* Connection indicator */}
        {!isOpen && (
          <div className={`absolute -top-1 -right-1 w-4 h-4 max-sm:w-3 max-sm:h-3 rounded-full border-2 border-white transition-colors duration-300 ${
            isConnected ? 'bg-green-500' : 'bg-red-500'
          }`}>
            {isConnected && <div className="w-full h-full bg-green-500 rounded-full animate-ping absolute"></div>}
          </div>
        )}
      </Button>
    </div>
  )
}