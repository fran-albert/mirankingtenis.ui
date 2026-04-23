## Contexto

En `admin/torneo-dobles/[id]` hoy existen dos limitaciones operativas:

- `Vista Previa` muestra la grilla de horarios, pero no permite abrir ni editar el partido desde la celda programada.
- `Crear/Editar Partido` muestra sólo el nombre del equipo y, en fase de zona, obliga a elegir la zona antes de poder seleccionar equipos.

El flujo pedido por negocio es:

- hacer click en un partido pendiente desde `Vista Previa`;
- abrir un modal para editar ese partido;
- desde ese modal poder reemplazarlo por otro partido pendiente de cualquier categoría del mismo torneo;
- si el partido elegido ya tiene programación, intercambiar los slots;
- si no la tiene, mover la programación al nuevo partido y dejar el original sin turno/sede/cancha;
- en el formulario de partido, mostrar directamente cada equipo con los nombres de sus jugadores;
- en fase de zona, inferir la zona a partir del equipo elegido, en lugar de forzar la zona como paso previo.

## Objetivo

Permitir edición y reprogramación real desde `Vista Previa` sin duplicar formularios ni dejar inconsistencias entre:

- grilla de horarios;
- pestaña `Partidos`;
- turnos digitalizados;
- standings;
- categorías distintas dentro del mismo torneo.

## Enfoque recomendado

Se usará un editor de partido compartido entre `Partidos` y `Vista Previa`, más una acción backend atómica de reemplazo.

Este enfoque se elige porque:

- evita mantener dos modales distintos para el mismo partido;
- permite editar y reemplazar desde la grilla sin lógica duplicada;
- soporta reemplazo entre categorías distintas del mismo evento;
- evita estados intermedios rotos cuando el reemplazo requiere mover o intercambiar slots;
- mantiene sincronizadas `matches`, `schedule`, `turns` y `standings`.

## Cambios de datos y API

### Schedule

El payload de `schedule` debe incluir `categoryId` dentro de cada `ScheduleMatch`.

Hoy la grilla conoce `categoryName`, pero no el identificador real de la categoría. Para abrir el editor correcto desde `Vista Previa` y refrescar las queries afectadas sin depender del nombre, hace falta incluir:

- `categoryId`
- `categoryName`

### Acción de reemplazo

Se agrega un endpoint atómico para reemplazar partidos programados, por ejemplo:

- `POST /doubles-matches/:id/replace`

Body:

- `replacementMatchId`

Semántica:

- `:id` es el partido abierto en el modal;
- `replacementMatchId` es el partido pendiente elegido para ocupar ese lugar.

Reglas:

- ambos partidos deben existir;
- deben ser distintos;
- ambos deben estar en estado `pending`;
- deben pertenecer al mismo evento, aunque puedan ser de categorías distintas;
- el partido origen debe tener slot asignado;
- el reemplazo mueve sólo programación:
  - `turnId`
  - `turnNumber`
  - `startTime`
  - `endTime`
  - `venue`
  - `courtName`
- no modifica:
  - equipos
  - zona
  - ronda
  - posición de bracket
  - sets
  - winner
  - estado

Casos:

- si el partido destino ya tiene slot, se hace swap completo;
- si el partido destino no tiene slot, toma la programación del origen y el origen queda desprogramado con esos campos en `null`.

### Consistencia backend

La acción de reemplazo debe ejecutarse dentro de una transacción para garantizar atomicidad.

Si una validación falla o el guardado de uno de los partidos no se completa, no debe persistirse ningún cambio parcial.

## Comportamiento frontend

### Modal compartido

Se extrae el formulario actual de `MatchesTab` a un componente reutilizable, por ejemplo `MatchEditorDialog`.

Ese componente soporta:

- creación de partido desde la pestaña `Partidos`;
- edición de partido desde la pestaña `Partidos`;
- edición de partido desde `Vista Previa`.

El modal conserva la edición normal de:

- fase;
- zona;
- equipos;
- turno;
- sede;
- cancha;
- ronda y posición si es playoff.

### Vista Previa

En `ScheduleGrid`:

- sólo los partidos `pending` se renderizan como clickeables;
- al hacer click en una celda con partido pendiente se abre `MatchEditorDialog`;
- el modal se inicializa con el partido completo correspondiente a ese slot.

Para eso, la página admin debe poder resolver el partido desde la grilla hacia la colección de partidos ya cargada o, si hace falta, apoyarse en el `categoryId` agregado al `schedule`.

### Reemplazar partido

Dentro del modal, sólo para partidos `pending`, aparece un botón:

- `Reemplazar partido`

Al activarlo:

- se muestra un selector/buscador con todos los partidos `pending` del torneo;
- se excluye el partido actual;
- se permite elegir partidos de cualquier categoría del mismo evento.

Cada opción debe mostrar contexto suficiente para evitar errores operativos, por ejemplo:

- `Categoría · Zona o ronda · Equipo 1 vs Equipo 2 · Turno actual o "Sin programar"`

Al confirmar:

- se ejecuta la acción backend atómica de reemplazo;
- el modal se cierra sólo si la operación termina bien;
- si falla, el modal permanece abierto y muestra el error devuelto por backend.

### Formulario de equipos

Las opciones de equipos pasan a mostrarse como:

- `Nombre del equipo · Jugador 1 / Jugador 2`

Para partidos de zona:

- ya no se bloquea la selección de equipos hasta elegir una zona;
- al elegir un equipo, la `zoneName` del formulario se completa con la zona del equipo;
- el segundo selector se filtra automáticamente a equipos de esa misma zona;
- si el usuario cambia el primer equipo por otro de distinta zona, el formulario actualiza la zona y limpia el segundo equipo si ya no es válido;
- al abrir un partido existente, el formulario respeta la zona y equipos ya definidos.

Para playoffs:

- se siguen mostrando todos los equipos;
- la visualización también usa `equipo + jugadores`.

## Invalidación y sincronización

Después de guardar o reemplazar un partido, el frontend debe invalidar:

- `doubles-schedule`
- `doubles-matches`
- `doubles-standings`
- `doubles-turns`

Si el reemplazo cruza categorías, la invalidación no debe depender sólo de la categoría activa, porque la grilla y la otra categoría también cambian.

## Riesgos

- El admin de dobles hoy concentra mucha lógica en una sola página; extraer el modal sin romper el flujo actual requiere aislar bien estado y callbacks.
- El reemplazo entre categorías distintas exige refresco amplio de queries para no dejar datos viejos en tabs que ya estaban abiertos.
- La grilla de `schedule` hoy no fue pensada como superficie interactiva; hay que agregar click y estados de hover sin romper la legibilidad.
- Si la lógica de zona se deriva mal al cambiar equipos, puede quedar un partido con equipos de zonas distintas.

## Plan de implementación

1. Extender DTOs/tipos de schedule para incluir `categoryId`.
2. Agregar endpoint backend transaccional para reemplazo atómico entre partidos pendientes del mismo evento.
3. Extender API/hooks del frontend para consumir el reemplazo e invalidar queries relacionadas.
4. Extraer el formulario actual a un modal compartido reutilizable por `Partidos` y `Vista Previa`.
5. Hacer clickeables los partidos pendientes dentro de `ScheduleGrid`.
6. Mejorar el selector de equipos para mostrar `equipo + jugadores` y derivar zona desde el equipo en fase de zona.
7. Verificar edición normal, movimiento a partido sin slot e intercambio entre partidos programados.
