'use client'

import { Calendar, Trophy, Users, Clock, MapPin, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface QuickActionsProps {
  onActionClick: (message: string) => void
  disabled?: boolean
}

const quickActions = [
  {
    id: 'my-matches',
    icon: Trophy,
    label: 'Mis Partidos',
    message: 'Mostrame mis partidos',
    color: 'from-slate-500 to-slate-600',
    hoverColor: 'from-slate-600 to-slate-700'
  },
  {
    id: 'reserve-court',
    icon: Calendar,
    label: 'Reservar Turno',
    message: 'Quiero reservar un turno',
    color: 'from-slate-600 to-slate-700',
    hoverColor: 'from-slate-700 to-slate-800'
  },
  {
    id: 'find-players',
    icon: Users,
    label: 'Buscar Jugadores',
    message: 'Buscar jugadores',
    color: 'from-slate-500 to-slate-600',
    hoverColor: 'from-slate-600 to-slate-700'
  },
  {
    id: 'report-result',
    icon: Target,
    label: 'Reportar Resultado',
    message: 'Quiero reportar el resultado de un partido',
    color: 'from-slate-500 to-slate-600',
    hoverColor: 'from-slate-600 to-slate-700'
  },
  {
    id: 'court-availability',
    icon: MapPin,
    label: 'Disponibilidad',
    message: 'Ver disponibilidad de canchas',
    color: 'from-slate-600 to-slate-700',
    hoverColor: 'from-slate-700 to-slate-800'
  }
]

export default function QuickActions({ onActionClick, disabled = false }: QuickActionsProps) {
  return (
    <div className="p-4 max-sm:p-3 bg-gradient-to-r from-slate-50 to-slate-100 border-t border-slate-100">
      <p className="text-xs max-sm:text-[10px] font-medium text-slate-600 mb-3 max-sm:mb-2 text-center">
        🎾 Acciones Rápidas
      </p>
      
      <div className="grid grid-cols-2 gap-2 max-sm:gap-1.5">
        {quickActions.map((action) => {
          const IconComponent = action.icon
          
          return (
            <Button
              key={action.id}
              onClick={() => onActionClick(action.message)}
              disabled={disabled}
              variant="ghost"
              className={`
                h-12 max-sm:h-10 p-2 max-sm:p-1.5 text-xs max-sm:text-[10px] font-medium transition-all duration-200 
                bg-gradient-to-r ${action.color} text-white rounded-xl 
                hover:${action.hoverColor} hover:shadow-md hover:scale-105 max-sm:hover:scale-102
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                group
              `}
            >
              <div className="flex flex-col items-center gap-1 max-sm:gap-0.5">
                <IconComponent className="w-4 h-4 max-sm:w-3 max-sm:h-3 group-hover:scale-110 transition-transform duration-200" />
                <span className="leading-tight max-sm:leading-none">{action.label}</span>
              </div>
            </Button>
          )
        })}
      </div>
      
      <div className="mt-3 max-sm:mt-2 text-center">
        <p className="text-xs max-sm:text-[10px] text-slate-500">
          💡 También puedes escribir cualquier pregunta
        </p>
      </div>
    </div>
  )
}