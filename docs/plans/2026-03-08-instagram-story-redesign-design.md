# Instagram Story Redesign (Torneo Equipos Admin)

Date: 2026-03-08

## Context
Se rediseña la imagen exportable de Instagram Story en Torneo Equipos Admin para:
- usar contenido 100% dinamico
- destacar el torneo "Copa 9 Games" (u otro torneo) con titulo y descripcion dinamicos
- aumentar protagonismo visual con estilo deportivo tipo ESPN

## Objetivos
1. Titulo del torneo dinamico
2. Descripcion dinamica
3. Logo principal mas grande
4. Jugadores en formato hero (imagenes grandes)
5. Mantener resultado de serie y detalle de partidos legible

## Enfoque elegido
Enfoque recomendado y aprobado: "hero editorial deportivo"
- Header con logo ampliado y tipografia de alto impacto
- Titulo (eventName) y descripcion (eventDescription/categoria/fase) dinamicos
- Dos paneles hero con jugadores destacados (uno por equipo)
- Marcador central grande y nombres de equipos
- Bloque de partidos en parte inferior con avatares aumentados

## Campos dinamicos usados
- eventName
- eventDescription
- categoryName
- phase/matchday/round desde `series`
- equipos, ganador y partidos desde `series`

## Impacto tecnico
- `ResultsTab` recibe y pasa metadata del evento/categoria al dialogo
- `StoryPreviewDialog` pasa metadata a `MatchStoryCard`
- `MatchStoryCard` se redisenia por completo manteniendo export 1080x1920

## Riesgos y mitigacion
- Riesgo: textos largos pueden desbordar
  - Mitigacion: truncado visual en titulo/equipos
- Riesgo: fotos de baja calidad
  - Mitigacion: transformacion Cloudinary con tamanos mas altos para hero

## Criterio de aceptacion
- Export PNG funciona
- Story se ve con logo grande
- Titulo y descripcion son dinamicos
- Jugadores se ven grandes y protagonistas
