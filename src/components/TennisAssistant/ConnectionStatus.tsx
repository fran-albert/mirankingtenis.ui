'use client'

import { Wifi, WifiOff, RefreshCw, CheckCircle, AlertCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ConnectionStatusProps {
  isConnected: boolean
  connectionAttempts: number
  isAuthenticating: boolean
  onReconnect?: () => void
}

export default function ConnectionStatus({ 
  isConnected, 
  connectionAttempts, 
  isAuthenticating,
  onReconnect 
}: ConnectionStatusProps) {
  const getStatusConfig = () => {
    if (isConnected) {
      return {
        icon: CheckCircle,
        text: 'Conectado al asistente',
        subtext: 'Todo funcionando correctamente',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        iconBg: 'bg-green-100'
      }
    }
    
    if (isAuthenticating) {
      return {
        icon: RefreshCw,
        text: 'Autenticando...',
        subtext: 'Validando credenciales',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        iconBg: 'bg-yellow-100',
        spinning: true
      }
    }
    
    if (connectionAttempts > 0) {
      return {
        icon: AlertCircle,
        text: 'Reconectando...',
        subtext: `Intento ${connectionAttempts}/10`,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        iconBg: 'bg-yellow-100'
      }
    }
    
    return {
      icon: XCircle,
      text: 'Sin conexión',
      subtext: 'No se puede conectar al servidor',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconBg: 'bg-red-100'
    }
  }
  
  const status = getStatusConfig()
  const StatusIcon = status.icon
  
  return (
    <div className={`
      m-4 max-sm:m-3 p-3 max-sm:p-2 rounded-xl border-2 transition-all duration-300
      ${status.bgColor} ${status.borderColor}
    `}>
      <div className="flex items-center gap-3 max-sm:gap-2">
        <div className={`
          p-2 max-sm:p-1.5 rounded-full ${status.iconBg}
        `}>
          <StatusIcon 
            className={`
              w-4 h-4 max-sm:w-3 max-sm:h-3 ${status.color}
              ${status.spinning ? 'animate-spin' : ''}
            `} 
          />
        </div>
        
        <div className="flex-1">
          <p className={`text-sm max-sm:text-xs font-medium ${status.color}`}>
            {status.text}
          </p>
          <p className="text-xs max-sm:text-[10px] text-gray-600 mt-0.5">
            {status.subtext}
          </p>
        </div>
        
        {!isConnected && !isAuthenticating && onReconnect && (
          <Button
            onClick={onReconnect}
            size="sm"
            variant="outline"
            className="text-xs max-sm:text-[10px] h-8 max-sm:h-7 px-3 max-sm:px-2"
          >
            <RefreshCw className="w-3 h-3 max-sm:w-2 max-sm:h-2 mr-1" />
            Reintentar
          </Button>
        )}
      </div>
      
      {/* Progress bar for reconnection attempts */}
      {connectionAttempts > 0 && connectionAttempts <= 10 && (
        <div className="mt-3 max-sm:mt-2">
          <div className="w-full bg-gray-200 rounded-full h-1.5 max-sm:h-1">
            <div 
              className="bg-yellow-500 h-1.5 max-sm:h-1 rounded-full transition-all duration-300"
              style={{ width: `${(connectionAttempts / 10) * 100}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  )
}