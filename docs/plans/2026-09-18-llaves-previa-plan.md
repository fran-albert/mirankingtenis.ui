# Llaves previa — plan de implementación

> **Para agentes:** SUB-SKILL REQUERIDA: usar superpowers:executing-plans para implementar este plan tarea por tarea. Los pasos usan checkboxes (`- [ ]`).

**Objetivo:** permitir armar y programar partidos de llave con etiquetas de texto libre ("1° Zona 1") antes de conocer a los clasificados, y resolverlos después sobre el mismo partido.

**Arquitectura:** cada lado de `doubles_match` tiene una pareja (`teamXId`) o una etiqueta (`teamXLabel`). La API valida los lados, bloquea resultados con lados por definir y ubica a cada ganador en el partido ya armado de la ronda siguiente. La UI suma la vista `Llaves previa` y un modo previa del modal con inputs de texto.

**Stack:** API NestJS 10 + TypeORM + Postgres (Jest, supertest). UI Next.js 15 + React Query + shadcn/ui (Playwright para e2e).

Diseño: `docs/plans/2026-09-18-llaves-previa-design.md`.

## Restricciones globales

- Sin `any` en TypeScript (regla del usuario). En tests, castear con `as unknown as Tipo`.
- Commits en español con Conventional Commits y la línea `Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>`.
- Ramas `feat/llaves-previa` en ambos repos, basadas en `origin/main`. PRs a `main`.
- Etiquetas: `trim`, máximo 60 caracteres, vacía = ausente.
- Nombre de la migración: `AddDoublesMatchPlaceholderLabels1789689600000`.
- Mensaje de bloqueo de resultado: `No se puede cargar el resultado: falta definir una pareja`.
- Deploy: primero API, después UI.

## Archivos

API (`mirankingtenis.API`):

- Crear `data/migrations/1789689600000-add-doubles-match-placeholder-labels.ts`: migración idempotente.
- Modificar `src/doubles-event/entities/doubles-match.entity.ts`: `team1` nullable, columnas de etiqueta.
- Modificar `src/config/data-source.ts`: registrar la migración en `production`.
- Modificar `src/doubles-event/dto/create-doubles-match.dto.ts`: `team1Id` opcional, etiquetas.
- Modificar `src/doubles-event/services/doubles-match.service.ts`: reglas, bloqueo de resultado, nombres de grilla y pase de ganadores.
- Modificar `jest.config.ts`: mapear `src/*` para los tests unitarios.
- Crear `src/doubles-event/services/doubles-match.service.spec.ts`: tests unitarios.
- Crear `test/doubles-llaves-previa.e2e-spec.ts`: e2e por HTTP.

UI (`mirankingtenis.ui`):

- Modificar `src/types/Doubles-Event/DoublesEvent.ts`: tipos.
- Modificar `src/common/constants/doubles-event.constants.ts`: helpers de lados.
- Modificar `src/sections/Doubles-Tournament/Admin/MatchEditorDialog.tsx`: modo previa.
- Modificar `src/app/admin/torneo-dobles/[id]/page.tsx`: estado del modal, vista `Llaves previa`, marcador, BYE y Resultados.
- Modificar `src/sections/Doubles-Tournament/Playoffs/PlayoffMatchCard.tsx`: nombres y etiquetas en el cuadro.

---

### Tarea 1: migración, entidad y registro en producción (API)

**Archivos:**
- Crear: `data/migrations/1789689600000-add-doubles-match-placeholder-labels.ts`
- Modificar: `src/doubles-event/entities/doubles-match.entity.ts`
- Modificar: `src/config/data-source.ts`

**Interfaces:**
- Produce: columnas `team1Label`, `team2Label` (`varchar(60)`, nullable) y `team1Id` nullable en `DoublesMatch`.

- [ ] **Paso 1: crear la migración**

```ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDoublesMatchPlaceholderLabels1789689600000
  implements MigrationInterface
{
  name = 'AddDoublesMatchPlaceholderLabels1789689600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "doubles_match"
      ALTER COLUMN "team1Id" DROP NOT NULL
    `);

    await queryRunner.query(`
      ALTER TABLE "doubles_match"
      ADD COLUMN IF NOT EXISTS "team1Label" character varying(60)
    `);

    await queryRunner.query(`
      ALTER TABLE "doubles_match"
      ADD COLUMN IF NOT EXISTS "team2Label" character varying(60)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM "doubles_match"
      WHERE "team1Id" IS NULL
    `);

    await queryRunner.query(`
      ALTER TABLE "doubles_match"
      DROP COLUMN IF EXISTS "team2Label"
    `);

    await queryRunner.query(`
      ALTER TABLE "doubles_match"
      DROP COLUMN IF EXISTS "team1Label"
    `);

    await queryRunner.query(`
      ALTER TABLE "doubles_match"
      ALTER COLUMN "team1Id" SET NOT NULL
    `);
  }
}
```

- [ ] **Paso 2: actualizar la entidad**

Reemplazar el bloque de `team1`/`team2` por:

```ts
  @ManyToOne(() => DoublesTeam, { nullable: true, eager: true })
  @JoinColumn({ name: 'team1Id' })
  team1: DoublesTeam;

  @Column({ nullable: true })
  team1Id: number;

  @ManyToOne(() => DoublesTeam, { nullable: true, eager: true })
  @JoinColumn({ name: 'team2Id' })
  team2: DoublesTeam;

  @Column({ nullable: true })
  team2Id: number;

  @ApiProperty({
    description: 'Etiqueta del equipo 1 mientras la pareja no está definida',
    example: '1° Zona 1',
    nullable: true,
  })
  @Column({ type: 'varchar', length: 60, nullable: true })
  team1Label: string;

  @ApiProperty({
    description: 'Etiqueta del equipo 2 mientras la pareja no está definida',
    example: '2° Zona 2',
    nullable: true,
  })
  @Column({ type: 'varchar', length: 60, nullable: true })
  team2Label: string;
```

- [ ] **Paso 3: registrar solo esta migración en producción**

En `src/config/data-source.ts`, agregar el import y la clave `migrations` al objeto `production`:

```ts
import { AddDoublesMatchPlaceholderLabels1789689600000 } from '../../data/migrations/1789689600000-add-doubles-match-placeholder-labels';
```

```ts
  synchronize: false,
  migrationsRun: true,
  migrations: [AddDoublesMatchPlaceholderLabels1789689600000],
```

El `DataSource` exportado por defecto (CLI) sigue sobrescribiendo `migrations` con el glob, así que `pnpm migration:run` no cambia.

- [ ] **Paso 4: compilar**

Run: `npm run build`
Expected: exit 0, y `dist/data/migrations/1789689600000-add-doubles-match-placeholder-labels.js` existe.

- [ ] **Paso 5: probar la migración contra el esquema actual de producción**

Levantar Postgres y crear el esquema con el código de `origin/main` (worktree), aplicarlo con la API nueva en modo `production` y verificar:

```bash
docker run -d --name mrt-pg -e POSTGRES_PASSWORD=postgres -p 55432:5432 postgres:14.1-alpine
docker exec mrt-pg sh -c 'until pg_isready -U postgres; do sleep 1; done; createdb -U postgres mrt_legacy'
git worktree add /tmp/mrt-api-main origin/main
ln -s "$PWD/node_modules" /tmp/mrt-api-main/node_modules
```

Script `old-schema.ts` (scratchpad), ejecutado desde `/tmp/mrt-api-main` con `npx ts-node -r tsconfig-paths/register <script> <modo>`:

```ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { join } from 'path';

const mode = process.argv[2];

const dataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 55432,
  username: 'postgres',
  password: 'postgres',
  database: 'mrt_legacy',
  synchronize: mode === 'create',
  entities: [join(process.cwd(), 'src/**/*.entity.ts')],
});

async function main() {
  await dataSource.initialize();
  const rows = await dataSource.getRepository('DoublesMatch').find();
  const columns = await dataSource.query(
    `SELECT column_name, is_nullable FROM information_schema.columns
     WHERE table_name = 'doubles_match'
       AND column_name IN ('team1Id', 'team1Label', 'team2Label')
     ORDER BY column_name`,
  );
  console.log(JSON.stringify({ mode, rows: rows.length, columns }));
  await dataSource.destroy();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
```

1. `old-schema.ts create` → Expected: `team1Id` con `is_nullable: "NO"` y sin columnas de etiqueta.
2. Arrancar la API nueva compilada en modo producción contra `mrt_legacy` y cortarla cuando levante:

```bash
NODE_ENV=production POSTGRES_HOST=localhost POSTGRES_PORT=55432 POSTGRES_USERNAME=postgres \
POSTGRES_PASSWORD=postgres POSTGRES_DATABASE=mrt_legacy POSTGRES_SSL=false JWT_SECRET=test PORT=3199 \
node dist/src/main.js
```

Expected: arranca y en la tabla `migrations` queda `AddDoublesMatchPlaceholderLabels1789689600000`.

3. `old-schema.ts read` (API vieja leyendo la tabla migrada) → Expected: no falla, `team1Id` con `is_nullable: "YES"` y las dos etiquetas presentes.
4. Idempotencia: volver a arrancar la API nueva → Expected: arranca sin errores y la migración sigue registrada una sola vez.
5. `down`: correr `new AddDoublesMatchPlaceholderLabels1789689600000().down(queryRunner)` con un `DataSource` sin entidades → Expected: columnas eliminadas y `team1Id` de nuevo `NO`.

- [ ] **Paso 6: commit**

```bash
git add data/migrations/1789689600000-add-doubles-match-placeholder-labels.ts src/doubles-event/entities/doubles-match.entity.ts src/config/data-source.ts
git commit -m "feat: permitir etiquetas en lugar de parejas en partidos de dobles"
```

---

### Tarea 2: reglas de lados, bloqueo de resultado y nombres de grilla (API)

**Archivos:**
- Modificar: `jest.config.ts`
- Modificar: `src/doubles-event/dto/create-doubles-match.dto.ts`
- Modificar: `src/doubles-event/services/doubles-match.service.ts`
- Crear: `src/doubles-event/services/doubles-match.service.spec.ts`

**Interfaces:**
- Consume: columnas de la Tarea 1.
- Produce: `CreateDoublesMatchDto.team1Id?`, `team1Label?`, `team2Label?`; `DoublesMatchService.hasPendingSide(match)` (privado); `updateResult` captura `previousWinnerId` y llama a `tryAdvancePlayoffRound(match, previousWinnerId)`.

- [ ] **Paso 1: mapear `src/*` en Jest**

En `jest.config.ts`, dentro de `moduleNameMapper`, agregar como primera entrada:

```ts
      '^src/(.*)$': '<rootDir>/$1',
```

- [ ] **Paso 2: escribir los tests que fallan**

`src/doubles-event/services/doubles-match.service.spec.ts`:

```ts
import { BadRequestException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { DoublesMatchService } from './doubles-match.service';
import { DoublesMatch } from '../entities/doubles-match.entity';
import { DoublesMatchSet } from '../entities/doubles-match-set.entity';
import { DoublesTeam } from '../entities/doubles-team.entity';
import { DoublesEventCategory } from '../entities/doubles-event-category.entity';
import { DoublesTurn } from '../entities/doubles-turn.entity';
import {
  DoublesMatchPhase,
  DoublesMatchStatus,
  DoublesPlayoffRound,
} from 'src/common/enums/doubles-event.enum';

type MatchRow = Partial<DoublesMatch> & { id: number };
type Where = Partial<Record<keyof DoublesMatch, unknown>>;

function matchesWhere(row: MatchRow, where: Where = {}) {
  return Object.entries(where).every(
    ([key, value]) => row[key as keyof MatchRow] === value,
  );
}

function createMatchStore(initialRows: MatchRow[] = []) {
  const rows: MatchRow[] = initialRows.map((row) => ({
    categoryId: 1,
    phase: DoublesMatchPhase.playoff,
    status: DoublesMatchStatus.pending,
    team1Id: null,
    team2Id: null,
    team1Label: null,
    team2Label: null,
    winnerId: null,
    sets: [],
    ...row,
  }));
  let nextId = rows.reduce((max, row) => Math.max(max, row.id), 0) + 1;

  const repository = {
    findOne: jest.fn(
      async ({ where }: { where: Where }) =>
        rows.find((row) => matchesWhere(row, where)) ?? null,
    ),
    find: jest.fn(async ({ where }: { where?: Where } = {}) =>
      rows.filter((row) => matchesWhere(row, where)),
    ),
    create: jest.fn((data: Partial<DoublesMatch>) => ({ ...data })),
    save: jest.fn(async (data: Partial<DoublesMatch>) => {
      const row: MatchRow = {
        status: DoublesMatchStatus.pending,
        team1Id: null,
        team2Id: null,
        team1Label: null,
        team2Label: null,
        winnerId: null,
        sets: [],
        ...data,
        id: nextId++,
      };
      rows.push(row);
      return row;
    }),
    update: jest.fn(async (id: number, data: Partial<DoublesMatch>) => {
      const row = rows.find((item) => item.id === id);
      Object.assign(row, data);
    }),
  };

  const byId = (id: number) => rows.find((row) => row.id === id);

  return { rows, repository, byId };
}

function createService(store: ReturnType<typeof createMatchStore>) {
  const setRepository = { delete: jest.fn(), insert: jest.fn() };
  const unusedRepository = { findOne: jest.fn(), find: jest.fn() };

  const service = new DoublesMatchService(
    store.repository as unknown as Repository<DoublesMatch>,
    setRepository as unknown as Repository<DoublesMatchSet>,
    unusedRepository as unknown as Repository<DoublesTeam>,
    unusedRepository as unknown as Repository<DoublesEventCategory>,
    unusedRepository as unknown as Repository<DoublesTurn>,
    {} as DataSource,
  );

  return { service, setRepository };
}

const previewQuarter = {
  phase: DoublesMatchPhase.playoff,
  team1Label: '1° Zona 1',
  team2Label: '2° Zona 2',
  round: DoublesPlayoffRound.quarterFinals,
  positionInBracket: 1,
};

describe('DoublesMatchService - llaves previas', () => {
  describe('create', () => {
    it('rechaza etiquetas en partidos de zona', async () => {
      const store = createMatchStore();
      const { service } = createService(store);

      await expect(
        service.create(1, { ...previewQuarter, phase: DoublesMatchPhase.zone }),
      ).rejects.toThrow(BadRequestException);
      expect(store.repository.save).not.toHaveBeenCalled();
    });

    it('rechaza un equipo 1 sin pareja ni etiqueta', async () => {
      const store = createMatchStore();
      const { service } = createService(store);

      await expect(
        service.create(1, { ...previewQuarter, team1Label: undefined }),
      ).rejects.toThrow('El equipo 1 necesita una pareja o una etiqueta');
    });

    it('trata una etiqueta vacía como ausente', async () => {
      const store = createMatchStore();
      const { service } = createService(store);

      await expect(
        service.create(1, { ...previewQuarter, team1Label: '   ' }),
      ).rejects.toThrow('El equipo 1 necesita una pareja o una etiqueta');
    });

    it('exige ronda y posición en una llave por definir', async () => {
      const store = createMatchStore();
      const { service } = createService(store);

      await expect(
        service.create(1, { ...previewQuarter, positionInBracket: undefined }),
      ).rejects.toThrow(
        'Una llave con parejas por definir necesita ronda y posición en el bracket',
      );
    });

    it('crea una llave previa con las etiquetas recortadas', async () => {
      const store = createMatchStore();
      const { service } = createService(store);

      const created = await service.create(1, {
        ...previewQuarter,
        team1Label: '  1° Zona 1 ',
      });

      expect(created.team1Id).toBeNull();
      expect(created.team1Label).toBe('1° Zona 1');
      expect(created.team2Label).toBe('2° Zona 2');
    });
  });

  describe('update', () => {
    it('resuelve un lado y conserva su etiqueta', async () => {
      const store = createMatchStore([{ id: 10, ...previewQuarter }]);
      const { service } = createService(store);

      const updated = await service.update(10, { team1Id: 5 });

      expect(updated.team1Id).toBe(5);
      expect(updated.team1Label).toBe('1° Zona 1');
      expect(updated.team2Id).toBeNull();
    });

    it('no deja un lado sin pareja ni etiqueta', async () => {
      const store = createMatchStore([{ id: 10, ...previewQuarter }]);
      const { service } = createService(store);

      await expect(service.update(10, { team1Label: '' })).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('updateResult', () => {
    it('bloquea el resultado mientras un lado siga por definir', async () => {
      const store = createMatchStore([
        { id: 10, ...previewQuarter, team1Id: 5 },
      ]);
      const { service, setRepository } = createService(store);

      await expect(
        service.updateResult(10, { sets: [], winnerId: 5 }),
      ).rejects.toThrow(
        'No se puede cargar el resultado: falta definir una pareja',
      );
      expect(setRepository.delete).not.toHaveBeenCalled();
    });
  });
});
```

- [ ] **Paso 3: correr y ver que fallan**

Run: `npx jest src/doubles-event/services/doubles-match.service.spec.ts`
Expected: FAIL. Las validaciones no existen (`create` guarda sin error) y TypeScript marca `team1Label` como propiedad desconocida del DTO.

- [ ] **Paso 4: DTO**

En `create-doubles-match.dto.ts`, sumar `MaxLength` al import de `class-validator` y reemplazar `team1Id`:

```ts
  @ApiPropertyOptional({
    description: 'ID del equipo 1 (opcional si se usa team1Label en una llave)',
  })
  @IsOptional()
  @IsNumber()
  team1Id?: number;
```

Después de `team2Id`, agregar:

```ts
  @ApiPropertyOptional({
    description: 'Etiqueta del equipo 1 mientras la pareja no está definida',
    example: '1° Zona 1',
  })
  @IsOptional()
  @IsString()
  @MaxLength(60)
  team1Label?: string | null;

  @ApiPropertyOptional({
    description: 'Etiqueta del equipo 2 mientras la pareja no está definida',
    example: '2° Zona 2',
  })
  @IsOptional()
  @IsString()
  @MaxLength(60)
  team2Label?: string | null;
```

`UpdateDoublesMatchDto` extiende `PartialType(CreateDoublesMatchDto)`, así que hereda los campos.

- [ ] **Paso 5: servicio**

Debajo de `type ScheduleGroup`, agregar:

```ts
type MatchSides = {
  phase?: DoublesMatchPhase;
  team1Id?: number | null;
  team2Id?: number | null;
  team1Label?: string | null;
  team2Label?: string | null;
  round?: string | null;
  positionInBracket?: number | null;
};
```

En `create`:

```ts
  async create(
    categoryId: number,
    dto: CreateDoublesMatchDto,
  ): Promise<DoublesMatch> {
    const normalizedDto = this.normalizeSideLabels(dto);
    this.assertValidSides(normalizedDto);
    const matchData = await this.applyTurnAssignment(normalizedDto);
```

(el resto de `create` sin cambios).

En `update`, reemplazar las dos primeras líneas por:

```ts
    const currentMatch = await this.findOne(id);
    const normalizedDto = this.normalizeSideLabels(dto);
    this.assertValidSides({ ...currentMatch, ...normalizedDto });
    const matchData = await this.applyTurnAssignment(normalizedDto, id);
```

En `updateResult`, después del `NotFoundException` y antes de borrar los sets:

```ts
    if (this.hasPendingSide(match)) {
      throw new BadRequestException(
        'No se puede cargar el resultado: falta definir una pareja',
      );
    }

    const previousWinnerId = match.winnerId ?? null;
```

y al final:

```ts
    if (updatedMatch.phase === DoublesMatchPhase.playoff && updatedMatch.round) {
      await this.tryAdvancePlayoffRound(updatedMatch, previousWinnerId);
    }
```

con la firma `private async tryAdvancePlayoffRound(match: DoublesMatch, previousWinnerId: number | null)` (el parámetro se usa en la Tarea 3).

En `toScheduleMatch`:

```ts
      team1Name: match.team1?.teamName || match.team1Label || '',
      team2Name: match.team2?.teamName || match.team2Label || '',
```

Métodos privados nuevos, antes de `toScheduleMatch`:

```ts
  private normalizeSideLabels<
    T extends CreateDoublesMatchDto | UpdateDoublesMatchDto,
  >(dto: T): T {
    const normalized = { ...dto };

    if ('team1Label' in dto) {
      normalized.team1Label = this.normalizeLabel(dto.team1Label);
    }

    if ('team2Label' in dto) {
      normalized.team2Label = this.normalizeLabel(dto.team2Label);
    }

    return normalized;
  }

  private normalizeLabel(label: string | null | undefined): string | null {
    const trimmed = label?.trim();
    return trimmed ? trimmed : null;
  }

  private assertValidSides(match: MatchSides): void {
    const hasLabel = !!match.team1Label || !!match.team2Label;

    if (match.phase !== DoublesMatchPhase.playoff && hasLabel) {
      throw new BadRequestException(
        'Las etiquetas solo se pueden usar en partidos de llave',
      );
    }

    if (!match.team1Id && !match.team1Label) {
      throw new BadRequestException(
        'El equipo 1 necesita una pareja o una etiqueta',
      );
    }

    if (
      this.hasPendingSide(match) &&
      (!match.round || !match.positionInBracket)
    ) {
      throw new BadRequestException(
        'Una llave con parejas por definir necesita ronda y posición en el bracket',
      );
    }
  }

  private hasPendingSide(match: MatchSides): boolean {
    return !match.team1Id || (!match.team2Id && !!match.team2Label);
  }
```

- [ ] **Paso 6: correr los tests**

Run: `npx jest src/doubles-event/services/doubles-match.service.spec.ts`
Expected: PASS (8 tests).

- [ ] **Paso 7: commit**

```bash
git add jest.config.ts src/doubles-event/dto/create-doubles-match.dto.ts src/doubles-event/services/doubles-match.service.ts src/doubles-event/services/doubles-match.service.spec.ts
git commit -m "feat: validar etiquetas de llave y bloquear resultados con parejas por definir"
```

---

### Tarea 3: pase de ganadores a partidos ya armados (API)

**Archivos:**
- Modificar: `src/doubles-event/services/doubles-match.service.ts` (`tryAdvancePlayoffRound`)
- Modificar: `src/doubles-event/services/doubles-match.service.spec.ts`

**Interfaces:**
- Consume: `tryAdvancePlayoffRound(match, previousWinnerId)` de la Tarea 2.
- Produce: `placeWinnerInNextMatch(match, nextMatch, previousWinnerId)` (privado).

- [ ] **Paso 1: tests que fallan**

Agregar dentro del `describe` principal:

```ts
  describe('pase de ganadores', () => {
    const quarter = (id: number, positionInBracket: number) => ({
      id,
      round: DoublesPlayoffRound.quarterFinals,
      positionInBracket,
      team1Id: id * 10 + 1,
      team2Id: id * 10 + 2,
    });

    const semi = (id: number, positionInBracket: number) => ({
      id,
      round: DoublesPlayoffRound.semiFinals,
      positionInBracket,
      team1Label: `Ganador C${positionInBracket * 2 - 1}`,
      team2Label: `Ganador C${positionInBracket * 2}`,
    });

    it('una posición impar entra como equipo 1 de la ronda siguiente', async () => {
      const store = createMatchStore([quarter(1, 1), semi(5, 1)]);
      const { service } = createService(store);

      await service.updateResult(1, { sets: [], winnerId: 11 });

      expect(store.byId(5).team1Id).toBe(11);
      expect(store.byId(5).team2Id).toBeNull();
    });

    it('una posición par entra como equipo 2', async () => {
      const store = createMatchStore([quarter(2, 2), semi(5, 1)]);
      const { service } = createService(store);

      await service.updateResult(2, { sets: [], winnerId: 22 });

      expect(store.byId(5).team2Id).toBe(22);
      expect(store.byId(5).team1Id).toBeNull();
    });

    it('los cuartos 3 y 4 alimentan la semi 2', async () => {
      const store = createMatchStore([quarter(3, 3), semi(5, 1), semi(6, 2)]);
      const { service } = createService(store);

      await service.updateResult(3, { sets: [], winnerId: 31 });

      expect(store.byId(6).team1Id).toBe(31);
      expect(store.byId(5).team1Id).toBeNull();
    });

    it('no pisa una pareja cargada a mano', async () => {
      const store = createMatchStore([
        quarter(1, 1),
        { ...semi(5, 1), team1Id: 99 },
      ]);
      const { service } = createService(store);

      await service.updateResult(1, { sets: [], winnerId: 11 });

      expect(store.byId(5).team1Id).toBe(99);
    });

    it('corrige el ganador si el partido siguiente sigue pendiente', async () => {
      const store = createMatchStore([
        { ...quarter(1, 1), status: DoublesMatchStatus.played, winnerId: 11 },
        { ...semi(5, 1), team1Id: 11 },
      ]);
      const { service } = createService(store);

      await service.updateResult(1, { sets: [], winnerId: 12 });

      expect(store.byId(5).team1Id).toBe(12);
    });

    it('no corrige si el partido siguiente ya se jugó', async () => {
      const store = createMatchStore([
        { ...quarter(1, 1), status: DoublesMatchStatus.played, winnerId: 11 },
        {
          ...semi(5, 1),
          team1Id: 11,
          team2Id: 21,
          status: DoublesMatchStatus.played,
          winnerId: 11,
        },
      ]);
      const { service } = createService(store);

      await service.updateResult(1, { sets: [], winnerId: 12 });

      expect(store.byId(5).team1Id).toBe(11);
    });

    it('sin la ronda siguiente armada, la crea al terminar la ronda', async () => {
      const store = createMatchStore([
        {
          id: 1,
          round: DoublesPlayoffRound.semiFinals,
          positionInBracket: 1,
          team1Id: 11,
          team2Id: 12,
          status: DoublesMatchStatus.played,
          winnerId: 11,
        },
        {
          id: 2,
          round: DoublesPlayoffRound.semiFinals,
          positionInBracket: 2,
          team1Id: 21,
          team2Id: 22,
        },
      ]);
      const { service } = createService(store);

      await service.updateResult(2, { sets: [], winnerId: 22 });

      const final = store.rows.find(
        (row) => row.round === DoublesPlayoffRound.final,
      );
      expect(final).toMatchObject({
        team1Id: 11,
        team2Id: 22,
        positionInBracket: 1,
      });
    });
  });
```

- [ ] **Paso 2: correr y ver que fallan**

Run: `npx jest src/doubles-event/services/doubles-match.service.spec.ts -t "pase de ganadores"`
Expected: FAIL en los seis casos con partido siguiente armado (el código actual retorna si la ronda siguiente existe). El último caso ya pasa.

- [ ] **Paso 3: implementar**

En `tryAdvancePlayoffRound`, justo después del `if (!nextRound) return;`:

```ts
    if (match.positionInBracket && match.winnerId) {
      const nextMatch = await this.matchRepository.findOne({
        where: {
          categoryId: match.categoryId,
          phase: DoublesMatchPhase.playoff,
          round: nextRound,
          positionInBracket: Math.ceil(match.positionInBracket / 2),
        },
      });

      if (nextMatch) {
        await this.placeWinnerInNextMatch(match, nextMatch, previousWinnerId);
        return;
      }
    }
```

Método nuevo, después de `tryAdvancePlayoffRound`:

```ts
  /**
   * Places the winner in a next-round match that already exists. Odd positions
   * feed team 1 and even positions feed team 2. A team loaded by hand is never
   * overwritten; this match's previous winner is replaced only while the next
   * match is still pending.
   */
  private async placeWinnerInNextMatch(
    match: DoublesMatch,
    nextMatch: DoublesMatch,
    previousWinnerId: number | null,
  ): Promise<void> {
    const isTeam1Side = match.positionInBracket % 2 === 1;
    const currentTeamId = isTeam1Side ? nextMatch.team1Id : nextMatch.team2Id;

    if (currentTeamId === match.winnerId) {
      return;
    }

    const isOpenSide = !currentTeamId;
    const holdsPreviousWinner =
      !!previousWinnerId &&
      currentTeamId === previousWinnerId &&
      nextMatch.status === DoublesMatchStatus.pending;

    if (!isOpenSide && !holdsPreviousWinner) {
      return;
    }

    await this.matchRepository.update(
      nextMatch.id,
      isTeam1Side ? { team1Id: match.winnerId } : { team2Id: match.winnerId },
    );
  }
```

- [ ] **Paso 4: correr todo el spec**

Run: `npx jest src/doubles-event/services/doubles-match.service.spec.ts`
Expected: PASS (15 tests).

- [ ] **Paso 5: commit**

```bash
git add src/doubles-event/services/doubles-match.service.ts src/doubles-event/services/doubles-match.service.spec.ts
git commit -m "feat: pasar ganadores de llave a los partidos ya armados de la ronda siguiente"
```

---

### Tarea 4: e2e de la API

**Archivos:**
- Crear: `test/doubles-llaves-previa.e2e-spec.ts`

**Interfaces:**
- Consume: endpoints `POST /doubles-events`, `POST /doubles-events/:id/categories`, `POST /doubles-event-categories/:id/teams`, `POST /doubles-events/:id/turns`, `POST|GET /doubles-event-categories/:id/matches`, `GET .../matches/playoff`, `PATCH /doubles-matches/:id`, `PATCH /doubles-matches/:id/result`, `GET /doubles-events/:id/schedule`.

- [ ] **Paso 1: escribir el e2e**

```ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';
import { Gender } from '../src/common/enums/gender.enum';
import {
  DoublesMatchPhase,
  DoublesPlayoffRound,
} from '../src/common/enums/doubles-event.enum';

const API = '/api/v1';

type MatchBody = {
  id: number;
  round: string;
  positionInBracket: number;
  team1: { id: number } | null;
  team2: { id: number } | null;
  team1Label: string | null;
  team2Label: string | null;
};

describe('Llaves previa de dobles (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  const eventIds: number[] = [];
  let eventId: number;
  let categoryId: number;
  let turnId: number;
  const teamIds: number[] = [];
  const quarterIds: number[] = [];
  const semiIds: number[] = [];
  let finalId: number;

  const server = () => app.getHttpServer();

  const sets = [
    { setNumber: 1, team1Score: 6, team2Score: 3 },
    { setNumber: 2, team1Score: 6, team2Score: 4 },
  ];

  async function playoffMatches(targetCategoryId: number): Promise<MatchBody[]> {
    const response = await request(server())
      .get(`${API}/doubles-event-categories/${targetCategoryId}/matches/playoff`)
      .expect(200);
    return response.body;
  }

  async function playoffMatch(id: number): Promise<MatchBody> {
    const matches = await playoffMatches(categoryId);
    return matches.find((match) => match.id === id);
  }

  async function createCategory(name: string) {
    const response = await request(server())
      .post(`${API}/doubles-events/${eventId}/categories`)
      .send({ name, gender: Gender.female, level: 'B' })
      .expect(201);
    return response.body.id as number;
  }

  async function createTeam(targetCategoryId: number, index: number, zoneName: string) {
    const response = await request(server())
      .post(`${API}/doubles-event-categories/${targetCategoryId}/teams`)
      .send({
        player1Name: `Jugadora ${index}A`,
        player2Name: `Jugadora ${index}B`,
        zoneName,
      })
      .expect(201);
    return response.body.id as number;
  }

  async function createPlayoffMatch(targetCategoryId: number, body: Record<string, unknown>) {
    return request(server())
      .post(`${API}/doubles-event-categories/${targetCategoryId}/matches`)
      .send({ phase: DoublesMatchPhase.playoff, ...body });
  }

  async function loadResult(matchId: number, winnerId: number) {
    return request(server())
      .patch(`${API}/doubles-matches/${matchId}/result`)
      .send({ sets, winnerId });
  }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
    dataSource = app.get(DataSource);

    const event = await request(server())
      .post(`${API}/doubles-events`)
      .send({
        name: 'E2E Llaves Previa',
        startDate: '2026-09-17',
        endDate: '2026-09-19',
      })
      .expect(201);
    eventId = event.body.id;
    eventIds.push(eventId);

    categoryId = await createCategory('DAMAS - B');

    for (let index = 1; index <= 8; index++) {
      teamIds.push(
        await createTeam(categoryId, index, index <= 4 ? 'Zona 1' : 'Zona 2'),
      );
    }

    const turn = await request(server())
      .post(`${API}/doubles-events/${eventId}/turns`)
      .send({
        turnNumber: 1,
        startTime: '2026-09-19T18:00:00.000Z',
        endTime: '2026-09-19T19:30:00.000Z',
      })
      .expect(201);
    turnId = turn.body.id;
  }, 60000);

  afterAll(async () => {
    if (eventIds.length > 0) {
      await dataSource.query('DELETE FROM doubles_event WHERE id = ANY($1)', [
        eventIds,
      ]);
    }
    await app.close();
  }, 30000);

  it('rechaza etiquetas en partidos de zona', async () => {
    await request(server())
      .post(`${API}/doubles-event-categories/${categoryId}/matches`)
      .send({
        phase: DoublesMatchPhase.zone,
        team1Label: '1° Zona 1',
        team2Label: '2° Zona 2',
      })
      .expect(400);
  });

  it('rechaza una llave por definir sin posición', async () => {
    await createPlayoffMatch(categoryId, {
      team1Label: '1° Zona 1',
      team2Label: '2° Zona 2',
      round: DoublesPlayoffRound.quarterFinals,
    }).then((response) => expect(response.status).toBe(400));
  });

  it('arma cuartos, semis y final con etiquetas', async () => {
    const quarters = [
      ['1° Zona 1', '4° Zona 2'],
      ['2° Zona 2', '3° Zona 1'],
      ['2° Zona 1', '3° Zona 2'],
      ['1° Zona 2', '4° Zona 1'],
    ];

    for (const [index, [team1Label, team2Label]] of quarters.entries()) {
      const schedule =
        index === 0
          ? { turnId, venue: 'FIRMAT FBC TENIS', courtName: 'C1' }
          : {};
      const response = await createPlayoffMatch(categoryId, {
        team1Label,
        team2Label,
        round: DoublesPlayoffRound.quarterFinals,
        positionInBracket: index + 1,
        ...schedule,
      });

      expect(response.status).toBe(201);
      expect(response.body.team1).toBeNull();
      expect(response.body.team1Label).toBe(team1Label);
      quarterIds.push(response.body.id);
    }

    for (const position of [1, 2]) {
      const response = await createPlayoffMatch(categoryId, {
        team1Label: `Ganador C${position * 2 - 1}`,
        team2Label: `Ganador C${position * 2}`,
        round: DoublesPlayoffRound.semiFinals,
        positionInBracket: position,
      });
      expect(response.status).toBe(201);
      semiIds.push(response.body.id);
    }

    const final = await createPlayoffMatch(categoryId, {
      team1Label: 'Ganador S1',
      team2Label: 'Ganador S2',
      round: DoublesPlayoffRound.final,
      positionInBracket: 1,
    });
    expect(final.status).toBe(201);
    finalId = final.body.id;

    expect(await playoffMatches(categoryId)).toHaveLength(7);
  });

  it('muestra las etiquetas en la grilla de horarios', async () => {
    const response = await request(server())
      .get(`${API}/doubles-events/${eventId}/schedule`)
      .expect(200);

    const schedule = JSON.stringify(response.body);
    expect(schedule).toContain('"team1Name":"1° Zona 1"');
    expect(schedule).toContain('"team2Name":"4° Zona 2"');
  });

  it('no deja cargar resultado con parejas por definir', async () => {
    const response = await loadResult(quarterIds[0], teamIds[0]);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      'No se puede cargar el resultado: falta definir una pareja',
    );
  });

  it('resuelve los lados de a uno y conserva la etiqueta', async () => {
    await request(server())
      .patch(`${API}/doubles-matches/${quarterIds[0]}`)
      .send({ team1Id: teamIds[0] })
      .expect(200);

    let quarter = await playoffMatch(quarterIds[0]);
    expect(quarter.team1.id).toBe(teamIds[0]);
    expect(quarter.team1Label).toBe('1° Zona 1');
    expect(quarter.team2).toBeNull();

    await request(server())
      .patch(`${API}/doubles-matches/${quarterIds[0]}`)
      .send({ team2Id: teamIds[7] })
      .expect(200);

    quarter = await playoffMatch(quarterIds[0]);
    expect(quarter.team2.id).toBe(teamIds[7]);
  });

  it('pasa el ganador de cada cuarto a su semi', async () => {
    await request(server())
      .patch(`${API}/doubles-matches/${quarterIds[1]}`)
      .send({ team1Id: teamIds[5], team2Id: teamIds[2] })
      .expect(200);

    expect((await loadResult(quarterIds[0], teamIds[0])).status).toBe(200);
    expect((await loadResult(quarterIds[1], teamIds[2])).status).toBe(200);

    const semi = await playoffMatch(semiIds[0]);
    expect(semi.team1.id).toBe(teamIds[0]);
    expect(semi.team2.id).toBe(teamIds[2]);
    expect(semi.team1Label).toBe('Ganador C1');
  });

  it('corrige la semi si se edita el resultado del cuarto', async () => {
    expect((await loadResult(quarterIds[0], teamIds[7])).status).toBe(200);

    const semi = await playoffMatch(semiIds[0]);
    expect(semi.team1.id).toBe(teamIds[7]);
  });

  it('no pisa una pareja cargada a mano', async () => {
    await request(server())
      .patch(`${API}/doubles-matches/${semiIds[1]}`)
      .send({ team1Id: teamIds[4] })
      .expect(200);
    await request(server())
      .patch(`${API}/doubles-matches/${quarterIds[2]}`)
      .send({ team1Id: teamIds[1], team2Id: teamIds[6] })
      .expect(200);

    expect((await loadResult(quarterIds[2], teamIds[1])).status).toBe(200);

    const semi = await playoffMatch(semiIds[1]);
    expect(semi.team1.id).toBe(teamIds[4]);
  });

  it('el ganador de la semi pasa a la final', async () => {
    expect((await loadResult(semiIds[0], teamIds[2])).status).toBe(200);

    const final = await playoffMatch(finalId);
    expect(final.team1.id).toBe(teamIds[2]);
    expect(final.team2).toBeNull();
    expect(final.team2Label).toBe('Ganador S2');
  });

  it('sin llaves previas sigue creando la ronda siguiente sola', async () => {
    const otherCategoryId = await createCategory('DAMAS - C');
    const otherTeams: number[] = [];
    for (let index = 1; index <= 4; index++) {
      otherTeams.push(await createTeam(otherCategoryId, 10 + index, 'Zona 1'));
    }

    const semiOne = await createPlayoffMatch(otherCategoryId, {
      team1Id: otherTeams[0],
      team2Id: otherTeams[1],
      round: DoublesPlayoffRound.semiFinals,
      positionInBracket: 1,
    });
    const semiTwo = await createPlayoffMatch(otherCategoryId, {
      team1Id: otherTeams[2],
      team2Id: otherTeams[3],
      round: DoublesPlayoffRound.semiFinals,
      positionInBracket: 2,
    });

    expect((await loadResult(semiOne.body.id, otherTeams[0])).status).toBe(200);
    expect((await loadResult(semiTwo.body.id, otherTeams[3])).status).toBe(200);

    const final = (await playoffMatches(otherCategoryId)).find(
      (match) => match.round === DoublesPlayoffRound.final,
    );
    expect(final.team1.id).toBe(otherTeams[0]);
    expect(final.team2.id).toBe(otherTeams[3]);
  });
});
```

- [ ] **Paso 2: correr el e2e contra Postgres en Docker**

```bash
docker exec mrt-pg createdb -U postgres mirankingtenis_test
NODE_ENV=automated_tests POSTGRES_HOST=localhost POSTGRES_PORT=55432 POSTGRES_USERNAME=postgres \
POSTGRES_PASSWORD=postgres POSTGRES_DATABASE=mirankingtenis_test jwtConstants=test \
npx jest --config ./test/jest-e2e.json test/doubles-llaves-previa.e2e-spec.ts --runInBand
```

Expected: PASS (11 tests).

- [ ] **Paso 3: lint, build y tests unitarios**

Run: `npm run lint && npm run build && npx jest`
Expected: todo en verde. Si `lint --fix` reformatea archivos, revisar el diff y commitearlo junto.

- [ ] **Paso 4: commit**

```bash
git add test/doubles-llaves-previa.e2e-spec.ts
git commit -m "test: e2e del flujo de llaves previa en dobles"
```

---

### Tarea 5: tipos y helpers de lados (UI)

**Archivos:**
- Modificar: `src/types/Doubles-Event/DoublesEvent.ts`
- Modificar: `src/common/constants/doubles-event.constants.ts`

**Interfaces:**
- Produce: `isMatchSidePending(match, side)`, `hasPendingSide(match)`, `getMatchSideName(match, side, fallback)`; `DoublesMatch.team1: DoublesTeam | null`, `team1Label`, `team2Label`; `CreateDoublesMatchRequest.team1Id?`, `team1Label?`, `team2Label?`.

- [ ] **Paso 1: tipos**

En `DoublesMatch`:

```ts
  team1: DoublesTeam | null;
  team2: DoublesTeam | null;
  team1Label: string | null;
  team2Label: string | null;
```

En `CreateDoublesMatchRequest`:

```ts
  turnId?: number;
  team1Id?: number;
  team2Id?: number;
  team1Label?: string | null;
  team2Label?: string | null;
```

- [ ] **Paso 2: helpers**

Al principio de `doubles-event.constants.ts`:

```ts
import type { DoublesMatch } from "@/types/Doubles-Event/DoublesEvent";
```

Al final:

```ts
type MatchSides = Pick<DoublesMatch, "team1" | "team2" | "team1Label" | "team2Label">;

export function isMatchSidePending(match: MatchSides, side: 1 | 2): boolean {
  if (side === 1) return !match.team1;
  return !match.team2 && !!match.team2Label;
}

export function hasPendingSide(match: MatchSides): boolean {
  return isMatchSidePending(match, 1) || isMatchSidePending(match, 2);
}

export function getMatchSideName(match: MatchSides, side: 1 | 2, fallback: string): string {
  const team = side === 1 ? match.team1 : match.team2;
  const label = side === 1 ? match.team1Label : match.team2Label;
  return team?.teamName || label || fallback;
}
```

- [ ] **Paso 3: chequear tipos**

Run: `npx tsc --noEmit`
Expected: solo errores en archivos que se corrigen en las Tareas 6 y 7. Anotar la lista para cubrirla.

---

### Tarea 6: modo previa del modal (UI)

**Archivos:**
- Modificar: `src/sections/Doubles-Tournament/Admin/MatchEditorDialog.tsx`

**Interfaces:**
- Consume: helpers de la Tarea 5.
- Produce: prop `isPreview?: boolean` en `MatchEditorDialog`; inputs `#preview-team1` y `#preview-team2`.

- [ ] **Paso 1: props, formulario y payload**

1. Importar `getMatchSideName` desde `@/common/constants/doubles-event.constants`.
2. En `MatchEditorDialogProps`: `isPreview?: boolean;` y en la desestructuración `isPreview = false,`.
3. En `createEmptyMatchForm`: `team1Label: "",` y `team2Label: "",`.
4. En la inicialización de edición: `team1Label: initialMatch.team1Label || "",` y `team2Label: initialMatch.team2Label || "",`.
5. En `handleSave`, reemplazar la construcción de `payload`:

```ts
    const { team1Id, team2Id, team1Label, team2Label, ...formFields } = form;
    const payload: CreateDoublesMatchRequest = {
      ...formFields,
      phase,
      zoneName:
        phase === DoublesMatchPhase.zone
          ? form.zoneName ||
            teams.find((team) => team.id === team1Id)?.zoneName ||
            teams.find((team) => team.id === team2Id)?.zoneName ||
            ""
          : "",
      ...(team1Id ? { team1Id } : {}),
      ...(team2Id ? { team2Id } : {}),
      ...(isPreview
        ? {
            team1Label: team1Label?.trim() || null,
            team2Label: team2Label?.trim() || null,
          }
        : {}),
    };
```

6. Antes del `return`, reemplazar `canReplace` y sumar:

```ts
  const pendingTeam1Label = isEditing && !initialMatch?.team1 ? initialMatch?.team1Label : null;
  const pendingTeam2Label = isEditing && !initialMatch?.team2 ? initialMatch?.team2Label : null;
  const hasTeam1 =
    !!form.team1Id || (isPreview ? !!form.team1Label?.trim() : !!pendingTeam1Label);
  const hasTeam2 = !!form.team2Id || !!form.team2Label?.trim();
  const hasSchedule = !!form.turnId && !!form.venue && !!form.courtName;
  const canSave = isPreview
    ? hasTeam1 && hasTeam2 && !!form.round && !!form.positionInBracket
    : hasTeam1 && hasSchedule;
```

7. Botón de guardar: `disabled={isSaving || !canSave}`.

- [ ] **Paso 2: render**

Título:

```tsx
            {isEditing ? "Editar Partido" : "Nuevo Partido"} -{" "}
            {phase === DoublesMatchPhase.zone ? "Zona" : isPreview ? "Llave previa" : "Llave"}
```

Reemplazar el bloque de los dos `Select` de equipos por:

```tsx
          {isPreview ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="preview-team1">Equipo 1</Label>
                <Input
                  id="preview-team1"
                  placeholder="Ej: 1° Zona 1"
                  maxLength={60}
                  value={initialMatch?.team1?.teamName ?? form.team1Label ?? ""}
                  disabled={!!initialMatch?.team1}
                  onChange={(e) =>
                    setForm((current) => ({ ...current, team1Label: e.target.value }))
                  }
                />
              </div>

              <div>
                <Label htmlFor="preview-team2">Equipo 2</Label>
                <Input
                  id="preview-team2"
                  placeholder="Ej: 2° Zona 2"
                  maxLength={60}
                  value={initialMatch?.team2?.teamName ?? form.team2Label ?? ""}
                  disabled={!!initialMatch?.team2}
                  onChange={(e) =>
                    setForm((current) => ({ ...current, team2Label: e.target.value }))
                  }
                />
              </div>

              <p className="text-xs text-muted-foreground sm:col-span-2">
                Escribí de dónde sale cada pareja. Turno, sede y cancha son opcionales: podés
                programarlos ahora o más adelante.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* los dos Select existentes, con estos placeholders: */}
            </div>
          )}
```

En los `SelectValue` existentes:

```tsx
                  <SelectValue
                    placeholder={
                      pendingTeam1Label ? `${pendingTeam1Label} — elegir pareja` : "Seleccionar equipo"
                    }
                  />
```

(y el equivalente con `pendingTeam2Label` en el equipo 2).

Dentro del grid de Ronda/Posición, al final:

```tsx
              {isPreview && (
                <p className="text-xs text-muted-foreground sm:col-span-2">
                  La posición define a dónde pasa el ganador: las posiciones 1 y 2 van a la
                  posición 1 de la ronda siguiente, 3 y 4 a la 2.
                </p>
              )}
```

Selector de reemplazo: sumar `match.team1Label` y `match.team2Label` al `haystack`, y mostrar
`{getMatchSideName(match, 1, "TBD")} vs {getMatchSideName(match, 2, "BYE")}`.

- [ ] **Paso 3: chequear tipos**

Run: `npx tsc --noEmit`
Expected: sin errores en `MatchEditorDialog.tsx`.

---

### Tarea 7: vista `Llaves previa`, marcador, BYE, Resultados y cuadro (UI)

**Archivos:**
- Modificar: `src/app/admin/torneo-dobles/[id]/page.tsx`
- Modificar: `src/sections/Doubles-Tournament/Playoffs/PlayoffMatchCard.tsx`

**Interfaces:**
- Consume: helpers (Tarea 5) y `isPreview` (Tarea 6).

- [ ] **Paso 1: estado del modal**

- Import de constantes: sumar `getMatchSideName, hasPendingSide, isMatchSidePending`.
- `MatchDialogState`: `isPreview: boolean;`. Sumar `isPreview: false` al estado inicial y a `closeMatchDialog`.
- Handlers:

```ts
  const openCreateMatchDialog = (phase: DoublesMatchPhase, isPreview = false) => {
    setMatchDialog({
      open: true,
      mode: "create",
      categoryId: activeCategoryId,
      phase,
      match: null,
      isPreview,
    });
  };

  const openEditMatchDialog = (match: DoublesMatch, isPreview = false) => {
    setMatchDialog({
      open: true,
      mode: "edit",
      categoryId: match.categoryId,
      phase: match.phase,
      match,
      isPreview,
    });
  };
```

- `<MatchEditorDialog ... isPreview={matchDialog.isPreview} />`.

- [ ] **Paso 2: `MatchesTab`**

Tipos de props:

```ts
  onCreateMatch: (phase: DoublesMatchPhase, isPreview?: boolean) => void;
  onEditMatch: (match: DoublesMatch, isPreview?: boolean) => void;
```

Estado y filtro (reemplaza `const [phase, setPhase]` y `filteredMatches`):

```ts
  const [view, setView] = useState<"zone" | "playoff-preview" | "playoff">("zone");
  const phase = view === "zone" ? DoublesMatchPhase.zone : DoublesMatchPhase.playoff;
  const isPreviewView = view === "playoff-preview";
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const filteredMatches = matches.filter((match) => {
    if (match.phase !== phase) return false;
    if (isPreviewView && !hasPendingSide(match)) return false;
    if (statusFilter !== "all" && match.status !== statusFilter) return false;
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    return [match.team1?.teamName, match.team2?.teamName, match.team1Label, match.team2Label]
      .filter((name): name is string => !!name)
      .some((name) => name.toLowerCase().includes(query));
  });
```

Botones:

```tsx
        <div className="flex gap-2">
          <Button variant={view === "zone" ? "default" : "outline"} size="sm" onClick={() => setView("zone")}>
            Zonas
          </Button>
          <Button
            variant={view === "playoff-preview" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("playoff-preview")}
          >
            Llaves previa
          </Button>
          <Button variant={view === "playoff" ? "default" : "outline"} size="sm" onClick={() => setView("playoff")}>
            Llaves
          </Button>
        </div>
        <Button size="sm" disabled={!categoryId} onClick={() => onCreateMatch(phase, isPreviewView)}>
          Crear Partido
        </Button>
```

Editar: `onClick={() => onEditMatch(match, isPreviewView)}`.

BYE: al principio del `map` de filas:

```ts
              const byeWinnerId =
                match.phase === DoublesMatchPhase.playoff &&
                match.status === DoublesMatchStatus.pending &&
                !match.team2 &&
                !match.team2Label
                  ? match.team1?.id
                  : undefined;
```

y reemplazar la condición y el `winnerId` del botón "Avanzar (BYE)" por `{byeWinnerId && (` … `winnerId: byeWinnerId` … `)}`.

Estado vacío, después del `map`:

```tsx
            {isPreviewView && filteredMatches.length === 0 && (
              <TableRow>
                <TableCell colSpan={isMultiDay ? 7 : 6} className="text-center text-gray-500 py-4">
                  No hay llaves por definir. Creá los cruces con etiquetas como “1° Zona 1”.
                </TableCell>
              </TableRow>
            )}
```

- [ ] **Paso 3: `MatchScoreboard`**

Equipo 1:

```tsx
        <span className={isMatchSidePending(match, 1) ? "text-gray-400 italic" : undefined}>
          {getMatchSideName(match, 1, "TBD")}
        </span>
```

Equipo 2: cambiar `match.team2 ? (` por `match.team2 || match.team2Label ? (` y el nombre por:

```tsx
            <span className={isMatchSidePending(match, 2) ? "text-gray-400 italic" : undefined}>
              {getMatchSideName(match, 2, "")}
            </span>
```

- [ ] **Paso 4: `ResultsTab`**

Buscador:

```ts
    return [m.team1?.teamName, m.team2?.teamName, m.team1Label, m.team2Label]
      .filter((name): name is string => !!name)
      .some((name) => name.toLowerCase().includes(q));
```

Acción de pendientes:

```tsx
                <TableCell>
                  <Button
                    size="sm"
                    disabled={hasPendingSide(match)}
                    onClick={() => openResult(match, false)}
                  >
                    Cargar Resultado
                  </Button>
                  {hasPendingSide(match) && (
                    <p className="text-[10px] sm:text-xs text-gray-500 mt-1">Falta definir pareja</p>
                  )}
                </TableCell>
```

- [ ] **Paso 5: `PlayoffMatchCard`**

```tsx
import { getMatchSideName, isMatchSidePending } from "@/common/constants/doubles-event.constants";
```

Equipo 1:

```tsx
          <span className={isMatchSidePending(match, 1) ? "text-gray-400 italic" : undefined}>
            <TeamName name={getMatchSideName(match, 1, "Por definir")} />
          </span>
```

Equipo 2: cambiar `match.team2 ? (` por `match.team2 || match.team2Label ? (` y el nombre por:

```tsx
              <span className={isMatchSidePending(match, 2) ? "text-gray-400 italic" : undefined}>
                <TeamName name={getMatchSideName(match, 2, "Por definir")} />
              </span>
```

- [ ] **Paso 6: verificar**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: exit 0 en los tres.

- [ ] **Paso 7: commit**

```bash
git add src/types/Doubles-Event/DoublesEvent.ts src/common/constants/doubles-event.constants.ts src/sections/Doubles-Tournament/Admin/MatchEditorDialog.tsx "src/app/admin/torneo-dobles/[id]/page.tsx" src/sections/Doubles-Tournament/Playoffs/PlayoffMatchCard.tsx
git commit -m "feat: agregar llaves previa con etiquetas en el admin de dobles"
```

---

### Tarea 8: e2e de la UI con Playwright

Script fuera del repo (scratchpad). No se commitea: depende de una API y una base locales.

- [ ] **Paso 1: levantar API y UI locales**

```bash
docker exec mrt-pg createdb -U postgres mrt_ui_e2e
# API (automated_tests crea el esquema con synchronize)
NODE_ENV=automated_tests POSTGRES_HOST=localhost POSTGRES_PORT=55432 POSTGRES_USERNAME=postgres \
POSTGRES_PASSWORD=postgres POSTGRES_DATABASE=mrt_ui_e2e jwtConstants=test PORT=3101 node dist/src/main.js
# UI
NEXT_PUBLIC_BACKEND_URL=http://localhost:3101/api/v1/ npx next dev -p 3100
```

Sembrar por HTTP: evento (hoy a mañana), categoría, 8 parejas en Zona 1 y Zona 2, y un turno.

- [ ] **Paso 2: script Playwright**

Recorrido, con capturas en cada paso:

1. `addInitScript` que guarda en `localStorage.auth_token` un JWT sin firmar válido para el cliente (`roles: ["Administrador"]`, `exp` +1 h).
2. Ir a `/admin/torneo-dobles/<id>` → pestaña `Partidos` → `Llaves previa` → verificar el estado vacío.
3. `Crear Partido` → llenar `#preview-team1` = `1° Zona 1`, `#preview-team2` = `2° Zona 2`, Ronda `Cuartos de Final`, posición `1`, turno, sede `FIRMAT FBC TENIS`, cancha `C1` → `Crear Partido` → la fila muestra `1° Zona 1`.
4. Crear un segundo cruce (posición 2) sin programar → verificar que el botón se habilita sin turno.
5. `Resultados` → la fila del cruce muestra `Falta definir pareja` y el botón está deshabilitado.
6. `Llaves` → las dos filas aparecen, con la etiqueta en gris.
7. `Editar` el cruce 1 en `Llaves` → el selector muestra `1° Zona 1 — elegir pareja` → elegir parejas en los dos lados → guardar.
8. Volver a `Llaves previa` → el cruce 1 ya no aparece y el 2 sí.
9. Página pública `/torneo-dobles/<id>` → pestaña de llaves → se ve `2° Zona 2`… del cruce pendiente.

Expected: todos los pasos pasan; las capturas quedan en el scratchpad.

---

### Tarea 9: PRs y deploy

- [ ] **Paso 1: API** — push de `feat/llaves-previa`, PR a `main`. Revisar por qué falla el job de GitHub Actions en `main` (`gh run view --log-failed`) y reportarlo. Mergear → Railway deploya.
- [ ] **Paso 2: verificar la API en producción** — estado del deploy de Railway en GitHub (`success`); `GET https://mirankingtenisapi-production.up.railway.app/api/v1/doubles-events` responde 200; un partido de una categoría existente trae la clave `team1Label` (prueba de que la migración corrió y el código nuevo está arriba).
- [ ] **Paso 3: plan de vuelta atrás** — si la API no levanta: revertir el merge en `main` (Railway redeploya el código anterior; la migración es compatible hacia atrás y no hace falta revertirla).
- [ ] **Paso 4: UI** — push, PR a `main`, esperar el preview de Vercel, mergear, esperar el deploy y verificar `/torneo-dobles` con 200.
