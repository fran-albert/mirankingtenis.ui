## Contexto

El cliente cambió el formato de los partidos de dobles en `torneo-equipos` mientras un torneo ya está en curso.

Reglas confirmadas:

- Singles no cambia.
- Dobles nuevo se juega al mejor de 2 sets.
- Cada set se juega a 6 games con diferencia de 2.
- Si reparten sets, se define con super tiebreak.
- El super tiebreak define el ganador del partido, pero no suma a games a favor ni a diferencia de games.
- Ya existen dobles cargados con el formato anterior.
- Los dobles viejos deben conservarse como están y quedar solo lectura.
- Los próximos dobles que se carguen deben usar el formato nuevo.

Esto obliga a soportar formatos mixtos dentro del mismo torneo y de la misma categoría.

## Objetivo

Permitir convivencia entre dobles legacy y dobles nuevos sin romper:

- resultados ya cargados;
- tabla de posiciones;
- diferencia de games;
- flujo operativo del admin;
- vistas públicas e historial visual de partidos.

## Enfoque recomendado

Se usará un modelo híbrido por partido de dobles.

Cada `team_event_match` tendrá un discriminador de formato de score:

- `legacy_games`
- `sets_super_tb`

Este enfoque se elige porque:

- soporta convivencia real dentro del mismo torneo;
- evita reglas implícitas por fecha o por evento;
- mantiene trazabilidad histórica;
- permite que los partidos viejos sigan intactos;
- deja abierta la posibilidad de futuros formatos.

## Modelo de datos

Se extiende `team_event_match` con campos específicos para dobles por sets.

Campos nuevos:

- `scoreFormat`
- `homeSet1Games`
- `awaySet1Games`
- `homeSet2Games`
- `awaySet2Games`
- `hasSuperTiebreak`
- `homeSuperTiebreakScore`
- `awaySuperTiebreakScore`

Decisiones:

- Los campos actuales `homeGames` y `awayGames` se conservan.
- En dobles nuevos, `homeGames` y `awayGames` representarán la suma de games de los sets regulares.
- El super tiebreak no se suma a esos totales.
- El ganador del doble nuevo se define por sets y, si corresponde, por super tiebreak.
- Los dobles ya existentes se marcarán como `legacy_games`.
- Singles sigue usando el esquema actual.

Ejemplo:

- Resultado: `6-4, 3-6, ST 10-7`
- Persistencia:
  - `homeSet1Games = 6`
  - `awaySet1Games = 4`
  - `homeSet2Games = 3`
  - `awaySet2Games = 6`
  - `hasSuperTiebreak = true`
  - `homeSuperTiebreakScore = 10`
  - `awaySuperTiebreakScore = 7`
  - `homeGames = 9`
  - `awayGames = 10`
  - ganador local

## Compatibilidad y migración

Debe aplicarse a torneos existentes.

Estrategia:

- migración de schema para agregar columnas nuevas nullable;
- backfill de dobles ya existentes como `legacy_games`;
- singles se mantiene compatible con la lógica actual;
- no se alteran scores ya cargados.

Regla operativa:

- dobles legacy cargados: solo lectura;
- dobles nuevos: editables con formato por sets;
- singles: sin cambios.

## Comportamiento backend

### Validación de scores

Singles:

- se mantiene la validación actual.

Dobles legacy:

- se mantiene la validación actual solo para resultados históricos ya persistidos;
- no se deben crear nuevos dobles con este formato.

Dobles nuevo:

- se valida `set1` y `set2`;
- un set se gana con 6 y diferencia de 2, o continúa hasta mantener diferencia de 2;
- si un equipo gana ambos sets, no hay super tiebreak;
- si quedan 1-1 en sets, el super tiebreak es obligatorio;
- el super tiebreak se gana con diferencia de 2;
- el ganador del partido se define por sets, no por suma de games.

### Cálculo de winner y standings

Se ajusta la lógica para que:

- el ganador de dobles nuevo salga del resultado por sets;
- `homeGames` y `awayGames` sigan alimentando `gamesFor`, `gamesAgainst` y `gamesDiff`;
- el super tiebreak no afecte diferencia de games;
- los standings sigan mezclando partidos viejos y nuevos sin romper desempates.

## Comportamiento frontend

### Admin

En `ResultsTab`:

- singles sigue igual;
- dobles legacy completado se muestra solo lectura;
- dobles nuevo usa formulario por sets:
  - set 1 local/visitante
  - set 2 local/visitante
  - super tiebreak condicional cuando queda 1-1

Edición:

- dobles legacy no editable;
- dobles nuevo editable con el mismo formulario;
- singles conserva edición actual.

### Vistas públicas y tarjetas

Los dobles nuevos deben renderizarse con formato legible:

- `6-4, 3-6, ST 10-7`

Los partidos legacy se siguen mostrando como hoy.

Se recomienda centralizar el render del score en helpers para no duplicar lógica entre:

- admin;
- vista pública;
- tarjetas de serie;
- export de story si usa ese dato.

## Riesgos

- Hay lógica actual que asume que todos los partidos se resumen a `homeGames` y `awayGames`.
- Hay que impedir que un doble legacy entre accidentalmente al editor nuevo.
- Hay que mantener consistente el ganador del partido cuando los games totales no coinciden con el equipo ganador por sets.
- Las vistas deben soportar series con mezcla de singles legacy y dobles nuevos sin inconsistencias visuales.

## Plan de implementación

1. Extender entidad, DTOs, enums y migración para formatos de score.
2. Ajustar validaciones y cálculo de winner en backend.
3. Marcar dobles legacy existentes y bloquear edición legacy.
4. Adaptar `ResultsTab` para carga y edición de dobles por sets.
5. Actualizar componentes de visualización de score en admin y público.
6. Verificar standings, games diff y compatibilidad con datos mixtos.
