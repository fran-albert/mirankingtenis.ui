# Tennis Assistant Sound Files

Para mejorar la experiencia del usuario, puedes agregar archivos de sonido para las notificaciones del chat.

## Archivos Requeridos

Coloca los siguientes archivos en esta carpeta:

- `notification.mp3` - Sonido de notificación cuando llega un mensaje
- `connect.mp3` - Sonido cuando se establece conexión (opcional)
- `error.mp3` - Sonido de error (opcional)

## Características de los Archivos

- **Formato**: MP3 o WAV
- **Duración**: Máximo 2 segundos
- **Volumen**: Moderado (el código ajusta a 30%)
- **Tamaño**: Máximo 50KB por archivo

## Sonidos Sugeridos

- **Notificación**: Sonido suave tipo "ding" o "ping"
- **Conexión**: Sonido positivo tipo "conectado"
- **Error**: Sonido discreto de alerta

## Fallback

Si los archivos no están disponibles, el sistema usará la Web Audio API para generar tonos simples.

## Nota

Los archivos de sonido son opcionales. El chat funcionará perfectamente sin ellos.