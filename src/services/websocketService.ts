interface WebSocketMessage {
  id: string
  type: string
  data?: any
}

interface WebSocketConfig {
  url: string
  reconnectDelay?: number
  maxReconnectAttempts?: number
}

export class WebSocketService {
  private ws: WebSocket | null = null
  private config: WebSocketConfig
  private reconnectTimer: NodeJS.Timeout | null = null
  private reconnectAttempts = 0
  private messageIdCounter = 0
  private listeners: Map<string, (data: any) => void> = new Map()
  private connectionListeners: Set<(connected: boolean) => void> = new Set()

  constructor(config: WebSocketConfig) {
    this.config = {
      reconnectDelay: 3000,
      maxReconnectAttempts: 10,
      ...config
    }
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        resolve()
        return
      }

      try {
        this.ws = new WebSocket(this.config.url)
        
        this.ws.onopen = () => {
          this.reconnectAttempts = 0
          this.notifyConnectionListeners(true)
          resolve()
        }

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data)
            this.handleMessage(message)
          } catch (error) {
            console.error('Error parsing WebSocket message:', error)
          }
        }

        this.ws.onclose = (event) => {
          this.notifyConnectionListeners(false)
          
          if (this.reconnectAttempts < this.config.maxReconnectAttempts!) {
            this.scheduleReconnect()
          }
        }

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error)
          this.notifyConnectionListeners(false)
          reject(error)
        }
      } catch (error) {
        console.error('Error connecting to WebSocket:', error)
        reject(error)
      }
    })
  }

  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
    
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    
    this.reconnectAttempts = 0
    this.notifyConnectionListeners(false)
  }

  send(message: Omit<WebSocketMessage, 'id'>): string {
    const messageId = `msg_${++this.messageIdCounter}`
    const fullMessage: WebSocketMessage = {
      id: messageId,
      ...message
    }

    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(fullMessage))
    } else {
      console.warn('WebSocket is not connected')
    }

    return messageId
  }

  sendToolCall(request: string, userId?: number, userToken?: string): string {
    return this.send({
      type: 'tool_call',
      data: {
        args: {
          request,
          userId,
          currentUserId: userId
        },
        userId,
        userToken
      }
    })
  }

  on(event: string, callback: (data: any) => void) {
    this.listeners.set(event, callback)
  }

  off(event: string) {
    this.listeners.delete(event)
  }

  onConnection(callback: (connected: boolean) => void) {
    this.connectionListeners.add(callback)
    return () => this.connectionListeners.delete(callback)
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }

  getReconnectAttempts(): number {
    return this.reconnectAttempts
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) return

    this.reconnectAttempts++
    const delay = Math.min(
      this.config.reconnectDelay! * Math.pow(2, this.reconnectAttempts - 1),
      30000
    )

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null
      this.connect().catch(console.error)
    }, delay)
  }

  private handleMessage(message: WebSocketMessage) {
    const callback = this.listeners.get(message.type)
    if (callback) {
      callback(message.data)
    }
    
    // Also emit to generic message listener
    const genericCallback = this.listeners.get('message')
    if (genericCallback) {
      genericCallback(message)
    }
  }

  private notifyConnectionListeners(connected: boolean) {
    this.connectionListeners.forEach(callback => callback(connected))
  }
}

// Singleton instance
let websocketService: WebSocketService | null = null

export const getWebSocketService = (): WebSocketService => {
  if (!websocketService) {
    const wsUrl = process.env.NEXT_PUBLIC_TENNIS_ASSISTANT_WS_URL || 'ws://localhost:3001'
    websocketService = new WebSocketService({
      url: wsUrl
    })
  }
  return websocketService
}