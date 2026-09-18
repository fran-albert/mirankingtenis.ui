# Llaves previa — diseño

## Contexto

En `admin/torneo-dobles/[id]`, pestaña `Partidos`, un partido de llave exige elegir las dos parejas. Antes de que terminen las zonas no se sabe quién clasifica, así que hoy no se puede armar el cuadro ni programar día, turno y cancha de cuartos, semis y final.

El pedido es un paso previo: armar el cuadro con etiquetas de texto libre ("1° Zona 1 vs 2° Zona 2") y programarlo, para que la gente vea cuándo y dónde se juega cada cruce. Cuando se conocen las parejas, se cargan a mano sobre el mismo partido.

## Decisiones

- **Un solo partido de principio a fin.** Cada lado del partido tiene una pareja real o una etiqueta. No hay una entidad aparte de borrador: la programación que se carga en la llave previa es la misma que después se juega.
- **Resolución manual, lado por lado.** Al terminar una zona se elige la pareja real en el partido; el otro lado puede seguir por definir.
- **Vistas.** `Llaves previa` lista los partidos de llave con algún lado por definir. `Llaves` lista el cuadro completo, con las etiquetas en gris donde falta la pareja.
- **Pase de ganadores automático, partido a partido.** Al cargar un resultado de llave, el ganador entra en el partido ya armado de la ronda siguiente.
- **Migración aplicada por la API al arrancar**, registrando solo esta migración en la config de producción.
- **Deploy apenas pasen los tests**, primero API y después UI.

## Datos (API)

Tabla `doubles_match`:

- `team1Id` pasa a ser nullable.
- Nuevas columnas nullable `team1Label varchar(60)` y `team2Label varchar(60)`.

Un lado está **resuelto** cuando tiene `teamXId`. Está **por definir** cuando no tiene `teamXId` pero sí `teamXLabel`. El lado 2 sin pareja ni etiqueta sigue significando "Libre" (bye), como hoy.

Al resolver un lado, la etiqueta se conserva como referencia; para mostrar se prioriza el nombre de la pareja.

### Migración

`AddDoublesMatchPlaceholderLabels`, idempotente:

- `up`: `ALTER COLUMN "team1Id" DROP NOT NULL`, `ADD COLUMN IF NOT EXISTS "team1Label"` y `"team2Label"`.
- `down`: borra los partidos sin `team1Id`, elimina las columnas y restaura `NOT NULL`.

Es compatible hacia atrás: la API actual sigue funcionando con la tabla migrada, porque TypeORM solo selecciona las columnas mapeadas.

Hoy la config `production` tiene `migrationsRun: true` pero ninguna migración registrada, así que no corre nada. Se registra **solo** esta migración (import explícito de la clase, no un glob) para que se aplique una vez al arrancar y quede anotada en la tabla `migrations`. Las migraciones anteriores no se tocan.

## Reglas (API)

Al crear y al editar, validadas sobre el estado resultante (partido actual + cambios):

1. Las etiquetas solo se aceptan en fase `playoff`. En fase `zone` se exigen `team1Id` y `team2Id` como hoy.
2. El lado 1 necesita `team1Id` o `team1Label`.
3. Un partido de llave con algún lado por definir necesita `round` y `positionInBracket`.
4. Las etiquetas se recortan (`trim`), tienen como máximo 60 caracteres y una etiqueta vacía se trata como ausente.

Resultados (`PATCH /doubles-matches/:id/result`): si algún lado está por definir, responde `400` con "No se puede cargar el resultado: falta definir una pareja".

## Pase de ganadores

Al cargar el resultado de un partido de llave con `round`, `positionInBracket` y `winnerId`:

- Ronda siguiente: `getNextPlayoffRound(round)`. Si no hay (final o tercer puesto), termina.
- Posición destino `ceil(p / 2)`. Lado destino: pareja 1 si `p` es impar, pareja 2 si es par.
- Si existe el partido destino (misma categoría, fase playoff, ronda siguiente, posición destino):
  - si el lado destino está vacío o por definir → se asigna el ganador;
  - si el lado destino tiene al **ganador anterior** de este partido (corrección de resultado) y el partido destino sigue `pending` → se reemplaza por el nuevo ganador;
  - en cualquier otro caso (pareja cargada a mano, partido destino ya jugado) → no se toca.
- Si no existe el partido destino → se mantiene el comportamiento actual: cuando la ronda completa está jugada y **no existe ningún** partido de la ronda siguiente, se crea la ronda entera emparejando ganadores.

Si en la ronda siguiente existen algunos partidos pero no el destino, el ganador no se ubica solo; ese partido se crea a mano. Es un caso borde de un cuadro armado a medias.

## Grilla, vista pública y PDF

`toScheduleMatch` arma los nombres como `teamX?.teamName || teamXLabel || ''`. Con eso las etiquetas aparecen en Vista Previa, la grilla pública y los PDF sin más cambios.

## Front

### Tipos

`DoublesMatch.team1` pasa a `DoublesTeam | null` y se agregan `team1Label` / `team2Label: string | null`. `CreateDoublesMatchRequest` suma las etiquetas y `team1Id` pasa a opcional. El compilador marca cada lugar que asumía `team1` presente.

### Nombre de cada lado

Una sola función `getMatchSideName(match, side, fallback)` → pareja, si no etiqueta, si no el fallback. Se usa en la lista de partidos, el cuadro (`PlayoffMatchCard`, admin y público), el selector de reemplazo del modal y Resultados. `isMatchSidePending(match, side)` indica si un lado está por definir.

En `PlayoffMatchCard`, hoy un lado 2 sin pareja muestra "Libre"; con etiqueta debe mostrar la etiqueta.

### Pestaña Partidos

Botones `Zonas | Llaves previa | Llaves`.

- `Llaves previa`: partidos `playoff` con algún lado por definir. `Crear Partido` abre el modal en modo previa.
- `Llaves`: todos los partidos `playoff`; los lados por definir se muestran en gris.
- El buscador también matchea etiquetas.

### Modal (`MatchEditorDialog`)

Nuevo modo previa, activo al crear desde `Llaves previa` o al editar un partido por definir desde esa vista:

- `Equipo 1` y `Equipo 2` son inputs de texto (placeholder `Ej: 1° Zona 1`). Si un lado ya está resuelto, se muestra el nombre de la pareja, no editable.
- Ronda y posición en el bracket obligatorias.
- Turno, sede y cancha sin cambios.
- `Crear Partido` habilitado con las dos etiquetas (o lados resueltos), ronda y posición.

Modo normal desde `Llaves`, sobre un partido con lados por definir:

- El selector de pareja muestra la etiqueta como placeholder: `1° Zona 1 — elegir pareja`.
- Se puede guardar con un lado resuelto y el otro por definir.

### Resultados

Un partido con algún lado por definir no permite cargar resultado: la acción aparece deshabilitada con el motivo.

## Verificación

- **API, tests unitarios** del servicio con repositorios mockeados: validación de lados, bloqueo de resultado, pase impar/par, no pisar parejas manuales, corrección de ganador, fallback de creación de ronda.
- **API, e2e** contra Postgres en Docker, recorriendo el flujo completo por HTTP: crear evento, categoría y parejas; armar cuartos, semis y final con etiquetas; ver etiquetas en `/schedule`; bloqueo de resultado; resolver lados; cargar resultados y verificar el pase a semis y final.
- **Migración** probada contra un Postgres con el esquema actual de producción: `up` dos veces (idempotencia), la API vieja sigue leyendo, `down` revierte.
- **UI, e2e con Playwright** contra la API local: crear una llave previa desde el modal, verla en `Llaves previa` y en `Llaves`, resolver un lado y verla salir de `Llaves previa`.
- `build` y `lint` en los dos repos.

## Deploy

1. PR de la API a `main` → Railway deploya y la API aplica la migración al arrancar. Verificar que `/doubles-events` responda y que el partido traiga `team1Label`.
2. PR de la UI a `main` → Vercel deploya.

El CI de GitHub Actions de la API ya falla en `main` antes de este cambio; se revisa y se informa, pero no bloquea el deploy de Railway.

## Fuera de alcance

- Resolución automática desde las posiciones de zona.
- Partido por el tercer puesto alimentado por los perdedores de semis.
- Armado automático del cuadro completo a partir de una cantidad de clasificados.
