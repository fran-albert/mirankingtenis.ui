# Tennis Assistant UI - Componente Mejorado 🎾

## Descripción

El **Tennis Assistant Widget** es un chat inteligente completamente rediseñado con una interfaz moderna y profesional para la plataforma de tenis. Incluye integración con OpenAI, WebSocket en tiempo real y múltiples características avanzadas.

## ✨ Características Principales

### 🎨 Diseño Moderno
- **Gradientes tennísticos**: Colores verde y azul que evocan la cancha de tenis
- **Animaciones fluidas**: Transiciones suaves y efectos visuales elegantes
- **Patrón de cancha de tenis**: Fondo temático en el header
- **Sombras y efectos glassmorphism**: Para un look premium

### 📱 Responsive Design
- **Adaptable a móviles**: Se ajusta automáticamente a pantallas pequeñas
- **Máxima altura responsiva**: `max-h-[calc(100vh-6rem)]`
- **Ancho adaptable**: `max-w-[calc(100vw-2rem)]`
- **Soporte para orientación**: Funciona en portrait y landscape

### 🔥 Funcionalidades Avanzadas

#### 🚀 Acciones Rápidas
- **Mis Partidos**: Acceso directo a partidos del usuario
- **Reservar Turno**: Inicio rápido para reservas
- **Buscar Jugadores**: Encontrar oponentes
- **Ver Disponibilidad**: Consultar canchas disponibles

#### 🔄 Estado de Conexión Inteligente
- **Indicador visual**: Luz verde/roja en tiempo real
- **Reconexión automática**: Con backoff progresivo
- **Contador de intentos**: Muestra progreso de reconexión
- **Estados detallados**: Conectado, Reconectando, Autenticando, Desconectado

#### 🔊 Notificaciones Sonoras
- **Audio personalizable**: Se puede activar/desactivar
- **Fallback con Web Audio API**: Si no hay archivos de sonido
- **Volumen controlado**: No molesta al usuario

#### ⏰ Gestión de Actividad
- **Auto-minimizado**: Se minimiza después de 5 minutos de inactividad
- **Tracking de actividad**: Rastrea interacciones del usuario
- **Modo ahorro**: Reduce uso de recursos cuando no está activo

### 🎯 Animaciones y Efectos

#### 📨 Animaciones de Mensajes
- **Slide-in desde abajo**: Los mensajes aparecen suavemente
- **Delay escalonado**: Cada mensaje con su propio timing
- **Hover effects**: Los mensajes se elevan al pasar el mouse

#### 🏀 Botón Flotante Animado
- **Patrón de pelota de tenis**: Puntos blancos decorativos
- **Animación de flotación**: Movimiento vertical suave
- **Efectos hover**: Escala y brillo al pasar el mouse
- **Indicador de conexión**: Luz pulsante en la esquina

#### ⚡ Indicador de Escritura
- **Puntos animados**: Tres puntos con diferentes colores
- **Timing perfecto**: Cada punto con delay individual
- **Spinner personalizado**: En el botón de envío mientras carga

## 📁 Estructura de Archivos

```
TennisAssistant/
├── TennisAssistantWidget.tsx     # Componente principal
├── QuickActions.tsx              # Acciones rápidas
├── ConnectionStatus.tsx          # Estado de conexión
├── TennisAssistant.module.css   # Estilos personalizados
└── README.md                    # Esta documentación
```

## 🔧 Props del Componente

```typescript
interface TennisAssistantWidgetProps {
  userToken?: string    // Token JWT del usuario
  userId?: number      // ID del usuario logueado
}
```

## 🎪 Estados del Componente

### 💬 Estados de UI
- `isOpen`: Chat abierto/cerrado
- `isMinimized`: Chat minimizado
- `messages`: Array de mensajes
- `inputValue`: Valor del campo de texto

### 🌐 Estados de Conexión
- `isConnected`: WebSocket conectado
- `isAuthenticating`: En proceso de autenticación
- `isLoading`: Esperando respuesta del servidor
- `connectionAttempts`: Número de intentos de reconexión

### ⚙️ Estados de Configuración
- `soundEnabled`: Sonidos activados
- `lastActivity`: Última actividad del usuario

## 🎨 Clases CSS Personalizadas

### Animaciones Principales
- `.messageSlideIn`: Animación de entrada de mensajes
- `.floatingButton`: Animación de flotación del botón
- `.messageHover`: Efecto hover en mensajes
- `.connectionIndicator.connected`: Pulsación del indicador

### Responsive Classes
- `.chatContainer`: Container principal responsive
- Media queries para móviles (`@media (max-width: 480px)`)

### Accesibilidad
- Soporte para `prefers-reduced-motion`
- Soporte para `prefers-contrast: high`
- Focus styles para navegación por teclado

## 🚀 Uso del Componente

```tsx
import TennisAssistantWidget from '@/components/TennisAssistant/TennisAssistantWidget'

export default function MyPage() {
  return (
    <div>
      {/* Tu contenido */}
      
      <TennisAssistantWidget 
        userId={user.id}
        userToken={user.token}
      />
    </div>
  )
}
```

## 🔄 Flujo de Funcionamiento

1. **Inicialización**: Se carga el componente con usuario y token
2. **Conexión WebSocket**: Se conecta automáticamente al servidor
3. **Autenticación**: Se valida el token del usuario
4. **Estado Ready**: El chat está listo para usar
5. **Interacción**: Usuario puede usar acciones rápidas o escribir
6. **Respuestas IA**: OpenAI procesa y responde inteligentemente
7. **Gestión de Estado**: Auto-reconexión y gestión de actividad

## 🎯 Características de Accesibilidad

- **Navegación por teclado**: Tab y Enter funcionan correctamente
- **Lectores de pantalla**: ARIAs y semantic HTML
- **Alto contraste**: Soporte para usuarios con necesidades visuales
- **Reducción de movimiento**: Respeta preferencias del sistema
- **Focus visible**: Indicadores claros de foco

## 🔧 Personalización

### Colores del Tema
```css
:root {
  --tennis-blue: #0ea5e9;
  --tennis-green: #10b981;
  --tennis-court: #059669;
}
```

### Duración de Animaciones
```css
:root {
  --animation-fast: 0.2s;
  --animation-normal: 0.3s;
  --animation-slow: 0.5s;
}
```

## 📝 Notas de Desarrollo

- **Performance**: Usa `useCallback` y `useMemo` para optimización
- **Memory Management**: Cleanup de timers y WebSockets
- **Error Handling**: Gestión robusta de errores de conexión
- **TypeScript**: Fuertemente tipado para mejor DX

## 🐛 Debugging

Para debuggear el componente:

1. Abre DevTools
2. Ve a la pestaña Console
3. Busca logs prefijados con 🟢, 🔴, 🏓
4. Verifica el estado de WebSocket en Network tab

## 🚀 Próximas Mejoras

- [ ] Soporte para archivos adjuntos
- [ ] Historial de conversaciones persistente
- [ ] Temas personalizables
- [ ] Modo oscuro
- [ ] Integración con notificaciones del sistema
- [ ] Soporte para múltiples idiomas

---

*Desarrollado con ❤️ para la plataforma Mi Ranking Tenis*