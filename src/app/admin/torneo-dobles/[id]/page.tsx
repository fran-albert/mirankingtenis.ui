"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useDoublesEvent } from "@/hooks/Doubles-Event/useDoublesEvents";
import { useDoublesCategories } from "@/hooks/Doubles-Event/useDoublesCategories";
import { useDoublesTeams } from "@/hooks/Doubles-Event/useDoublesTeams";
import { useDoublesMatches } from "@/hooks/Doubles-Event/useDoublesMatches";
import { useDoublesStandings } from "@/hooks/Doubles-Event/useDoublesStandings";
import { useDoublesSchedule } from "@/hooks/Doubles-Event/useDoublesSchedule";
import { useDoublesTurns } from "@/hooks/Doubles-Event/useDoublesTurns";
import { useDoublesEventMatches } from "@/hooks/Doubles-Event/useDoublesEventMatches";
import { useDoublesEventMutations } from "@/hooks/Doubles-Event/useDoublesEventMutations";
import {
  DoublesEventCategory,
  DoublesTeam,
  DoublesMatch,
  DoublesTurn,
  CreateDoublesCategoryRequest,
  CreateDoublesTeamRequest,
  CreateDoublesTurnRequest,
  ScheduleMatch,
  UpdateDoublesMatchResultRequest,
} from "@/types/Doubles-Event/DoublesEvent";
import { DoublesMatchPhase, DoublesMatchStatus, DoublesEventStatus } from "@/common/enum/doubles-event.enum";
import { DOUBLES_ZONES, getPlayoffRoundLabel, buildDateTime, getEventDays } from "@/common/constants/doubles-event.constants";
import Loading from "@/components/Loading/loading";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ScheduleGrid } from "@/sections/Doubles-Tournament/Schedule/ScheduleGrid";
import { ZoneStandingsTable } from "@/sections/Doubles-Tournament/Zones/ZoneStandingsTable";
import { MatchEditorDialog } from "@/sections/Doubles-Tournament/Admin/MatchEditorDialog";

type MatchDialogState = {
  open: boolean;
  mode: "create" | "edit";
  categoryId: number;
  phase: DoublesMatchPhase;
  match: DoublesMatch | null;
};

export default function DoublesEventManagePage() {
  const params = useParams();
  const eventId = Number(params.id);
  const { event, isLoading: eventLoading } = useDoublesEvent(eventId);
  const { categories } = useDoublesCategories(eventId);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [matchDialog, setMatchDialog] = useState<MatchDialogState>({
    open: false,
    mode: "create",
    categoryId: 0,
    phase: DoublesMatchPhase.zone,
    match: null,
  });
  const mutations = useDoublesEventMutations();

  const activeCategoryId = selectedCategoryId || categories[0]?.id || 0;
  const { teams } = useDoublesTeams(activeCategoryId, !!activeCategoryId);
  const { matches } = useDoublesMatches(activeCategoryId, !!activeCategoryId);
  const { matches: eventMatches } = useDoublesEventMatches(eventId, !!eventId);
  const { standings } = useDoublesStandings(activeCategoryId, !!activeCategoryId);
  const { schedule } = useDoublesSchedule(eventId);
  const { turns } = useDoublesTurns(eventId);
  const dialogCategoryId =
    matchDialog.match?.categoryId || matchDialog.categoryId || activeCategoryId;
  const { teams: dialogTeams } = useDoublesTeams(
    dialogCategoryId,
    matchDialog.open && !!dialogCategoryId
  );

  if (eventLoading) return <Loading isLoading={true} />;
  if (!event) return <div className="p-6">Evento no encontrado</div>;

  const closeMatchDialog = () => {
    setMatchDialog({
      open: false,
      mode: "create",
      categoryId: 0,
      phase: DoublesMatchPhase.zone,
      match: null,
    });
  };

  const openCreateMatchDialog = (phase: DoublesMatchPhase) => {
    setMatchDialog({
      open: true,
      mode: "create",
      categoryId: activeCategoryId,
      phase,
      match: null,
    });
  };

  const openEditMatchDialog = (match: DoublesMatch) => {
    setMatchDialog({
      open: true,
      mode: "edit",
      categoryId: match.categoryId,
      phase: match.phase,
      match,
    });
  };

  const handlePreviewMatchClick = (scheduleMatch: ScheduleMatch) => {
    const selectedMatch = eventMatches.find((match) => match.id === scheduleMatch.id);

    if (!selectedMatch) {
      toast.error("El partido todavía se está cargando. Probá de nuevo en un instante.");
      return;
    }

    openEditMatchDialog(selectedMatch);
  };

  return (
    <div className="px-2 sm:px-4 md:px-6 py-4 sm:py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-6">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold">{event.name}</h1>
          <p className="text-gray-500 text-sm">
            {new Date(event.startDate).toLocaleDateString("es-AR", {
              timeZone: "America/Buenos_Aires",
            })}
            {event.endDate &&
              ` - ${new Date(event.endDate).toLocaleDateString("es-AR", {
                timeZone: "America/Buenos_Aires",
              })}`}
          </p>
        </div>
        <StatusToggle eventId={eventId} status={event.status} mutations={mutations} />
      </div>

      <Tabs defaultValue="categories">
        <TabsList className="mb-4 overflow-x-auto flex-wrap">
          <TabsTrigger value="categories" className="text-xs sm:text-sm px-2 sm:px-3">Categorías</TabsTrigger>
          <TabsTrigger value="teams" className="text-xs sm:text-sm px-2 sm:px-3">Equipos</TabsTrigger>
          <TabsTrigger value="turns" className="text-xs sm:text-sm px-2 sm:px-3">Turnos</TabsTrigger>
          <TabsTrigger value="matches" className="text-xs sm:text-sm px-2 sm:px-3">Partidos</TabsTrigger>
          <TabsTrigger value="results" className="text-xs sm:text-sm px-2 sm:px-3">Resultados</TabsTrigger>
          <TabsTrigger value="preview" className="text-xs sm:text-sm px-2 sm:px-3">Vista Previa</TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          <CategoriesTab
            eventId={eventId}
            categories={categories}
            mutations={mutations}
          />
        </TabsContent>

        <TabsContent value="teams">
          <CategorySelector
            categories={categories}
            selected={activeCategoryId}
            onChange={setSelectedCategoryId}
          />
          <TeamsTab
            categoryId={activeCategoryId}
            teams={teams}
            mutations={mutations}
          />
        </TabsContent>

        <TabsContent value="turns">
          <TurnsTab
            eventId={eventId}
            eventStartDate={event.startDate}
            eventEndDate={event.endDate}
            turns={turns}
            mutations={mutations}
          />
        </TabsContent>

        <TabsContent value="matches">
          <CategorySelector
            categories={categories}
            selected={activeCategoryId}
            onChange={setSelectedCategoryId}
          />
          <MatchesTab
            categoryId={activeCategoryId}
            matches={matches}
            turns={turns}
            mutations={mutations}
            eventStartDate={event.startDate}
            eventEndDate={event.endDate}
            onCreateMatch={openCreateMatchDialog}
            onEditMatch={openEditMatchDialog}
          />
        </TabsContent>

        <TabsContent value="results">
          <CategorySelector
            categories={categories}
            selected={activeCategoryId}
            onChange={setSelectedCategoryId}
          />
          <ResultsTab
            matches={matches}
            teams={teams}
            mutations={mutations}
          />
        </TabsContent>

        <TabsContent value="preview">
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Grilla de Horarios</h3>
              {schedule && (
                <ScheduleGrid
                  schedule={schedule}
                  onMatchClick={handlePreviewMatchClick}
                />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Posiciones</h3>
              {standings.map((zone) => (
                <div key={zone.zoneName} className="mb-6">
                  <h4 className="font-medium mb-2">{zone.zoneName}</h4>
                  <ZoneStandingsTable standings={zone.standings} />
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <MatchEditorDialog
        open={matchDialog.open}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            closeMatchDialog();
          }
        }}
        mode={matchDialog.mode}
        categoryId={dialogCategoryId}
        categories={categories}
        initialMatch={matchDialog.match}
        initialPhase={matchDialog.phase}
        turns={turns}
        teams={dialogTeams}
        allEventMatches={eventMatches}
        mutations={mutations}
        eventStartDate={event.startDate}
        eventEndDate={event.endDate}
      />
    </div>
  );
}

function getArgentinaDateParts(iso: string) {
  const date = new Date(iso);
  const argDate = new Date(
    date.toLocaleString("en-US", { timeZone: "America/Buenos_Aires" })
  );
  const yyyy = argDate.getFullYear();
  const mm = String(argDate.getMonth() + 1).padStart(2, "0");
  const dd = String(argDate.getDate()).padStart(2, "0");

  return { yyyy, mm, dd, dateKey: `${yyyy}-${mm}-${dd}` };
}

function getArgentinaTimeValue(iso: string | null) {
  if (!iso) return "";
  const date = new Date(iso);
  return date.toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/Buenos_Aires",
  });
}

function getEventDayLabel(eventDays: { date: string; label: string }[], iso: string | null) {
  if (!iso) return "";
  const { dateKey } = getArgentinaDateParts(iso);
  return eventDays.find((day) => day.date === dateKey)?.label || "";
}

function formatTurnOption(
  turn: DoublesTurn,
  eventDays: { date: string; label: string }[]
) {
  const dayLabel = getEventDayLabel(eventDays, turn.startTime);
  const startTime = getArgentinaTimeValue(turn.startTime);
  return `${dayLabel ? `${dayLabel} · ` : ""}T${turn.turnNumber}${turn.isMixed ? " - Mixto" : ""} · ${startTime}`;
}

function suggestTurnNumberForSlot(
  turns: DoublesTurn[],
  selectedDay: string,
  startHour: string,
  excludeTurnId?: number | null
) {
  const turnsForDay = turns
    .filter((turn) => turn.id !== excludeTurnId)
    .filter((turn) => getArgentinaDateParts(turn.startTime).dateKey === selectedDay);

  const matchingTurn = turnsForDay.find(
    (turn) => getArgentinaTimeValue(turn.startTime) === startHour
  );

  if (matchingTurn) {
    return matchingTurn.turnNumber;
  }

  const maxTurnNumber = turnsForDay.reduce(
    (max, turn) => Math.max(max, turn.turnNumber),
    0
  );

  return maxTurnNumber + 1 || 1;
}

// --- Sub-components ---

function StatusToggle({
  eventId,
  status,
  mutations,
}: {
  eventId: number;
  status: DoublesEventStatus;
  mutations: ReturnType<typeof useDoublesEventMutations>;
}) {
  const handleToggle = async (newStatus: DoublesEventStatus) => {
    try {
      await mutations.updateEventMutation.mutateAsync({
        id: eventId,
        data: { status: newStatus },
      });
      toast.success(`Estado cambiado a ${newStatus}`);
    } catch {
      toast.error("Error al cambiar estado");
    }
  };

  return (
    <div className="flex gap-2">
      {status === DoublesEventStatus.draft && (
        <Button onClick={() => handleToggle(DoublesEventStatus.active)}>
          Activar
        </Button>
      )}
      {status === DoublesEventStatus.active && (
        <Button
          variant="outline"
          onClick={() => handleToggle(DoublesEventStatus.finished)}
        >
          Finalizar
        </Button>
      )}
      <Badge variant={status === DoublesEventStatus.active ? "default" : "secondary"}>
        {status === DoublesEventStatus.draft
          ? "Borrador"
          : status === DoublesEventStatus.active
            ? "Activo"
            : "Finalizado"}
      </Badge>
    </div>
  );
}

function CategorySelector({
  categories,
  selected,
  onChange,
}: {
  categories: DoublesEventCategory[];
  selected: number;
  onChange: (id: number) => void;
}) {
  return (
    <div className="mb-4">
      <Select
        value={String(selected)}
        onValueChange={(v) => onChange(Number(v))}
      >
        <SelectTrigger className="w-full sm:w-[300px]">
          <SelectValue placeholder="Seleccionar categoría" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((cat) => (
            <SelectItem key={cat.id} value={String(cat.id)}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function CategoriesTab({
  eventId,
  categories,
  mutations,
}: {
  eventId: number;
  categories: DoublesEventCategory[];
  mutations: ReturnType<typeof useDoublesEventMutations>;
}) {
  const [open, setOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<DoublesEventCategory | null>(null);
  const [form, setForm] = useState<CreateDoublesCategoryRequest>({
    name: "",
    gender: "male",
    level: "A",
    pointsForWin: 3,
    pointsForLoss: 1,
    pointsForNotPlayed: 0,
  });

  const isEditing = !!editingCategory;

  const resetForm = () => {
    setForm({ name: "", gender: "male", level: "A", pointsForWin: 3, pointsForLoss: 1, pointsForNotPlayed: 0 });
    setEditingCategory(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setOpen(true);
  };

  const handleOpenEdit = (category: DoublesEventCategory) => {
    setEditingCategory(category);
    setForm({
      name: category.name,
      gender: category.gender,
      level: category.level,
      pointsForWin: category.pointsForWin,
      pointsForLoss: category.pointsForLoss,
      pointsForNotPlayed: category.pointsForNotPlayed,
    });
    setOpen(true);
  };

  const handleSave = async () => {
    try {
      if (isEditing) {
        await mutations.updateCategoryMutation.mutateAsync({
          id: editingCategory.id,
          data: form,
        });
        toast.success("Categoría actualizada");
      } else {
        await mutations.createCategoryMutation.mutateAsync({
          eventId,
          data: form,
        });
        toast.success("Categoría creada");
      }
      setOpen(false);
      resetForm();
    } catch {
      toast.error(isEditing ? "Error al actualizar categoría" : "Error al crear categoría");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar categoría?")) return;
    try {
      await mutations.deleteCategoryMutation.mutateAsync(id);
      toast.success("Categoría eliminada");
    } catch {
      toast.error("Error al eliminar");
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      resetForm();
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-lg font-semibold">Categorías</h2>
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={handleOpenCreate}>Crear Categoría</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEditing ? "Editar Categoría" : "Nueva Categoría"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Nombre</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Categoría A - Caballeros"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Género</Label>
                  <Select
                    value={form.gender}
                    onValueChange={(v) => setForm({ ...form, gender: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Caballeros</SelectItem>
                      <SelectItem value="female">Damas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Nivel</Label>
                  <Select
                    value={form.level}
                    onValueChange={(v) => setForm({ ...form, level: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                      <SelectItem value="C">C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Pts Victoria</Label>
                  <Input
                    type="number"
                    value={form.pointsForWin}
                    onChange={(e) =>
                      setForm({ ...form, pointsForWin: Number(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <Label>Pts Derrota</Label>
                  <Input
                    type="number"
                    value={form.pointsForLoss}
                    onChange={(e) =>
                      setForm({ ...form, pointsForLoss: Number(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <Label>Pts No Pres.</Label>
                  <Input
                    type="number"
                    value={form.pointsForNotPlayed}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        pointsForNotPlayed: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <Button onClick={handleSave} disabled={!form.name} className="w-full">
                {isEditing ? "Guardar Cambios" : "Crear"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Género</TableHead>
            <TableHead>Nivel</TableHead>
            <TableHead>Puntos (V/D/NP)</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((cat) => (
            <TableRow key={cat.id}>
              <TableCell className="font-medium">{cat.name}</TableCell>
              <TableCell>
                {cat.gender === "male" ? "Caballeros" : "Damas"}
              </TableCell>
              <TableCell>{cat.level}</TableCell>
              <TableCell>
                {cat.pointsForWin}/{cat.pointsForLoss}/{cat.pointsForNotPlayed}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEdit(cat)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(cat.id)}
                  >
                    Eliminar
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function TeamsTab({
  categoryId,
  teams,
  mutations,
}: {
  categoryId: number;
  teams: DoublesTeam[];
  mutations: ReturnType<typeof useDoublesEventMutations>;
}) {
  const [open, setOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<DoublesTeam | null>(null);
  const [form, setForm] = useState<CreateDoublesTeamRequest>({
    player1Name: "",
    player2Name: "",
    zoneName: "",
  });

  const isEditing = !!editingTeam;

  const resetForm = () => {
    setForm({ player1Name: "", player2Name: "", zoneName: "" });
    setEditingTeam(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setOpen(true);
  };

  const handleOpenEdit = (team: DoublesTeam) => {
    setEditingTeam(team);
    setForm({
      player1Name: team.player1Name,
      player2Name: team.player2Name,
      zoneName: team.zoneName || "",
    });
    setOpen(true);
  };

  const handleSave = async () => {
    try {
      if (isEditing) {
        await mutations.updateTeamMutation.mutateAsync({
          id: editingTeam.id,
          data: form,
        });
        toast.success("Equipo actualizado");
      } else {
        await mutations.createTeamMutation.mutateAsync({
          categoryId,
          data: form,
        });
        toast.success("Equipo creado");
      }
      setOpen(false);
      resetForm();
    } catch {
      toast.error(isEditing ? "Error al actualizar equipo" : "Error al crear equipo");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar equipo?")) return;
    try {
      await mutations.deleteTeamMutation.mutateAsync(id);
      toast.success("Equipo eliminado");
    } catch {
      toast.error("Error al eliminar");
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      resetForm();
    }
  };

  // Group teams by zone
  const teamsByZone = useMemo(() => {
    const map = new Map<string, DoublesTeam[]>();
    teams.forEach((t) => {
      const zone = t.zoneName || "Sin Zona";
      if (!map.has(zone)) map.set(zone, []);
      map.get(zone)!.push(t);
    });
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [teams]);

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-lg font-semibold">Equipos</h2>
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button size="sm" disabled={!categoryId} onClick={handleOpenCreate}>
              Crear Equipo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEditing ? "Editar Equipo" : "Nuevo Equipo"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Jugador 1</Label>
                <Input
                  value={form.player1Name}
                  onChange={(e) =>
                    setForm({ ...form, player1Name: e.target.value })
                  }
                  placeholder="Nombre completo"
                />
              </div>
              <div>
                <Label>Jugador 2</Label>
                <Input
                  value={form.player2Name}
                  onChange={(e) =>
                    setForm({ ...form, player2Name: e.target.value })
                  }
                  placeholder="Nombre completo"
                />
              </div>
              <div>
                <Label>Zona</Label>
                <Select
                  value={form.zoneName || ""}
                  onValueChange={(v) => setForm({ ...form, zoneName: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar zona" />
                  </SelectTrigger>
                  <SelectContent>
                    {DOUBLES_ZONES.map((zone) => (
                      <SelectItem key={zone.id} value={zone.name}>
                        {zone.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleSave}
                disabled={!form.player1Name || !form.player2Name}
                className="w-full"
              >
                {isEditing ? "Guardar Cambios" : "Crear"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {teamsByZone.map(([zone, zoneTeams]) => (
        <div key={zone} className="mb-6">
          <h3 className="font-medium text-gray-700 mb-2">{zone}</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Equipo</TableHead>
                <TableHead>Jugador 1</TableHead>
                <TableHead>Jugador 2</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {zoneTeams.map((team) => (
                <TableRow key={team.id}>
                  <TableCell className="font-medium">{team.teamName}</TableCell>
                  <TableCell>{team.player1Name}</TableCell>
                  <TableCell>{team.player2Name}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenEdit(team)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(team.id)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ))}
    </div>
  );
}

function MatchScoreboard({ match, compact = false }: { match: DoublesMatch; compact?: boolean }) {
  const sets = [...(match.sets || [])].sort((a, b) => a.setNumber - b.setNumber);
  const isTeam1Winner = match.winnerId === match.team1?.id;
  const isTeam2Winner = match.winnerId === match.team2?.id;

  return (
    <div
      className={`inline-grid gap-0 border rounded ${compact ? "text-xs" : "text-xs sm:text-sm"}`}
      style={{ gridTemplateColumns: `1fr repeat(${sets.length || 1}, 2rem)` }}
    >
      <div className={`px-2 py-1 truncate flex items-center gap-1 ${isTeam1Winner ? "font-bold" : ""}`}>
        {match.team1?.teamName || "TBD"}
        {isTeam1Winner && <Badge className="text-[9px] px-1 py-0 leading-tight shrink-0">G</Badge>}
      </div>
      {sets.length > 0 ? (
        sets.map((s) => (
          <div key={`t1-${s.setNumber}`} className={`px-1 py-1 text-center border-l ${s.team1Score > s.team2Score ? "text-green-600 font-bold" : ""}`}>
            {s.team1Score}
          </div>
        ))
      ) : (
        <div className="px-1 py-1 text-center border-l text-gray-400">-</div>
      )}

      <div className={`px-2 py-1 truncate border-t flex items-center gap-1 ${isTeam2Winner ? "font-bold" : ""}`}>
        {match.team2 ? (
          <>
            {match.team2.teamName}
            {isTeam2Winner && <Badge className="text-[9px] px-1 py-0 leading-tight shrink-0">G</Badge>}
          </>
        ) : (
          <span className="text-gray-400 italic">BYE</span>
        )}
      </div>
      {sets.length > 0 ? (
        sets.map((s) => (
          <div key={`t2-${s.setNumber}`} className={`px-1 py-1 text-center border-l border-t ${s.team2Score > s.team1Score ? "text-green-600 font-bold" : ""}`}>
            {s.team2Score}
          </div>
        ))
      ) : (
        <div className="px-1 py-1 text-center border-l border-t text-gray-400">-</div>
      )}
    </div>
  );
}

function TurnsTab({
  eventId,
  eventStartDate,
  eventEndDate,
  turns,
  mutations,
}: {
  eventId: number;
  eventStartDate: string;
  eventEndDate: string | null;
  turns: DoublesTurn[];
  mutations: ReturnType<typeof useDoublesEventMutations>;
}) {
  const eventDays = useMemo(
    () => getEventDays(eventStartDate, eventEndDate),
    [eventStartDate, eventEndDate]
  );
  const [open, setOpen] = useState(false);
  const [editingTurn, setEditingTurn] = useState<DoublesTurn | null>(null);
  const [selectedDay, setSelectedDay] = useState(eventDays[0]?.date || "");
  const [turnNumberTouched, setTurnNumberTouched] = useState(false);
  const [form, setForm] = useState({
    turnNumber: 1,
    startHour: "08:30",
    endHour: "10:00",
    isMixed: false,
  });

  const isEditing = !!editingTurn;

  const resetForm = () => {
    setEditingTurn(null);
    setSelectedDay(eventDays[0]?.date || "");
    setTurnNumberTouched(false);
    setForm({
      turnNumber: 1,
      startHour: "08:30",
      endHour: "10:00",
      isMixed: false,
    });
  };

  const handleOpenCreate = () => {
    resetForm();
    setOpen(true);
  };

  const handleOpenEdit = (turn: DoublesTurn) => {
    setEditingTurn(turn);
    setTurnNumberTouched(true);
    setSelectedDay(getArgentinaDateParts(turn.startTime).dateKey);
    setForm({
      turnNumber: turn.turnNumber,
      startHour: getArgentinaTimeValue(turn.startTime),
      endHour: getArgentinaTimeValue(turn.endTime),
      isMixed: turn.isMixed,
    });
    setOpen(true);
  };

  const handleSave = async () => {
    const payload: CreateDoublesTurnRequest = {
      turnNumber: Number(form.turnNumber),
      startTime: buildDateTime(selectedDay, form.startHour),
      endTime: buildDateTime(selectedDay, form.endHour),
      isMixed: form.isMixed,
    };

    try {
      if (isEditing) {
        await mutations.updateTurnMutation.mutateAsync({
          id: editingTurn.id,
          data: payload,
        });
        toast.success("Turno actualizado");
      } else {
        await mutations.createTurnMutation.mutateAsync({
          eventId,
          data: payload,
        });
        toast.success("Turno creado");
      }
      setOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          (isEditing ? "Error al actualizar turno" : "Error al crear turno")
      );
    }
  };

  const handleDelete = async (turn: DoublesTurn) => {
    if (!confirm("¿Eliminar turno?")) return;

    try {
      await mutations.deleteTurnMutation.mutateAsync(turn.id);
      toast.success("Turno eliminado");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Error al eliminar turno");
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      resetForm();
    }
  };

  useEffect(() => {
    if (turnNumberTouched || !selectedDay || !form.startHour) {
      return;
    }

    const suggestedTurnNumber = suggestTurnNumberForSlot(
      turns,
      selectedDay,
      form.startHour,
      editingTurn?.id
    );

    setForm((current) =>
      current.turnNumber === suggestedTurnNumber
        ? current
        : {
            ...current,
            turnNumber: suggestedTurnNumber,
          }
    );
  }, [turns, selectedDay, form.startHour, turnNumberTouched, editingTurn?.id]);

  const sortedTurns = [...turns].sort((a, b) => {
    const diff = new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    if (diff !== 0) return diff;
    return a.turnNumber - b.turnNumber;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold">Turnos Digitalizados</h2>
          <p className="text-sm text-gray-500">
            Administrá día, horario y si el turno es mixto o no.
          </p>
        </div>
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={handleOpenCreate}>
              Crear Turno
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{isEditing ? "Editar Turno" : "Nuevo Turno"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {eventDays.length > 1 && (
                <div>
                  <Label>Día</Label>
                  <Select value={selectedDay} onValueChange={setSelectedDay}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar día" />
                    </SelectTrigger>
                    <SelectContent>
                      {eventDays.map((day) => (
                        <SelectItem key={day.date} value={day.date}>
                          {day.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label>Turno</Label>
                  <Input
                    type="number"
                    min={1}
                    value={form.turnNumber}
                    onChange={(e) =>
                      {
                        setTurnNumberTouched(true);
                        setForm((current) => ({
                          ...current,
                          turnNumber: Number(e.target.value) || 1,
                        }));
                      }
                    }
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Se propone automáticamente según día y hora. Si ya existe esa franja, reutiliza el mismo T.
                  </p>
                </div>
                <div>
                  <Label>Hora Inicio</Label>
                  <Input
                    type="time"
                    value={form.startHour}
                    onChange={(e) =>
                      setForm((current) => ({
                        ...current,
                        startHour: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label>Hora Fin</Label>
                  <Input
                    type="time"
                    value={form.endHour}
                    onChange={(e) =>
                      setForm((current) => ({
                        ...current,
                        endHour: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-md border p-3">
                <Checkbox
                  id="isMixed"
                  checked={form.isMixed}
                  onCheckedChange={(checked) =>
                    setForm((current) => ({
                      ...current,
                      isMixed: checked === true,
                    }))
                  }
                />
                <div>
                  <Label htmlFor="isMixed">Turno mixto</Label>
                  <p className="text-xs text-gray-500">
                    Marcá si ese slot debe identificarse como mixto.
                  </p>
                </div>
              </div>

              <Button
                onClick={handleSave}
                className="w-full"
                disabled={!selectedDay || !form.startHour || !form.endHour}
              >
                {isEditing ? "Guardar Cambios" : "Crear Turno"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto -mx-2 px-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Día</TableHead>
              <TableHead>Turno</TableHead>
              <TableHead>Horario</TableHead>
              <TableHead>Mixto</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTurns.map((turn) => {
              return (
                <TableRow key={turn.id}>
                  <TableCell className="text-xs sm:text-sm">
                    {getEventDayLabel(eventDays, turn.startTime)}
                  </TableCell>
                  <TableCell className="font-medium">T{turn.turnNumber}</TableCell>
                  <TableCell className="text-xs sm:text-sm">
                    {getArgentinaTimeValue(turn.startTime)} - {getArgentinaTimeValue(turn.endTime)}
                  </TableCell>
                  <TableCell>
                    {turn.isMixed ? (
                      <Badge variant="default">Mixto</Badge>
                    ) : (
                      <span className="text-xs text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleOpenEdit(turn)}>
                        Editar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(turn)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {sortedTurns.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500 py-6">
                  No hay turnos digitalizados todavía
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function MatchesTab({
  categoryId,
  matches,
  turns,
  mutations,
  eventStartDate,
  eventEndDate,
  onCreateMatch,
  onEditMatch,
}: {
  categoryId: number;
  matches: DoublesMatch[];
  turns: DoublesTurn[];
  mutations: ReturnType<typeof useDoublesEventMutations>;
  eventStartDate: string;
  eventEndDate: string | null;
  onCreateMatch: (phase: DoublesMatchPhase) => void;
  onEditMatch: (match: DoublesMatch) => void;
}) {
  const eventDays = useMemo(
    () => getEventDays(eventStartDate, eventEndDate),
    [eventStartDate, eventEndDate]
  );
  const isMultiDay = eventDays.length > 1;
  const [phase, setPhase] = useState<DoublesMatchPhase>(DoublesMatchPhase.zone);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const filteredMatches = matches.filter((match) => {
    if (match.phase !== phase) return false;
    if (statusFilter !== "all" && match.status !== statusFilter) return false;
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    return (
      match.team1?.teamName?.toLowerCase().includes(query) ||
      match.team2?.teamName?.toLowerCase().includes(query)
    );
  });

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar partido?")) return;
    try {
      await mutations.deleteMatchMutation.mutateAsync(id);
      toast.success("Partido eliminado");
    } catch {
      toast.error("Error al eliminar");
    }
  };

  const getMatchTurn = (match: DoublesMatch) =>
    match.turn || turns.find((turn) => turn.id === match.turnId) || null;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <Button
            variant={phase === DoublesMatchPhase.zone ? "default" : "outline"}
            size="sm"
            onClick={() => setPhase(DoublesMatchPhase.zone)}
          >
            Zonas
          </Button>
          <Button
            variant={phase === DoublesMatchPhase.playoff ? "default" : "outline"}
            size="sm"
            onClick={() => setPhase(DoublesMatchPhase.playoff)}
          >
            Llaves
          </Button>
        </div>
        <Button size="sm" disabled={!categoryId} onClick={() => onCreateMatch(phase)}>
          Crear Partido
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <Input
          placeholder="Buscar equipo..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-64"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value={DoublesMatchStatus.pending}>Pendiente</SelectItem>
            <SelectItem value={DoublesMatchStatus.played}>Jugado</SelectItem>
            <SelectItem value={DoublesMatchStatus.cancelled}>Cancelado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto -mx-2 px-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs sm:text-sm">Partido</TableHead>
              <TableHead className="text-xs sm:text-sm">{phase === DoublesMatchPhase.zone ? "Zona" : "Ronda"}</TableHead>
              {isMultiDay && <TableHead className="text-xs sm:text-sm">Día</TableHead>}
              <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Turno</TableHead>
              <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Sede/Cancha</TableHead>
              <TableHead className="text-xs sm:text-sm">Estado</TableHead>
              <TableHead className="text-xs sm:text-sm">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMatches.map((match) => {
              const matchTurn = getMatchTurn(match);

              return (
                <TableRow key={match.id}>
                  <TableCell><MatchScoreboard match={match} compact /></TableCell>
                  <TableCell className="text-xs sm:text-sm">
                    {phase === DoublesMatchPhase.zone ? match.zoneName : getPlayoffRoundLabel(match.round)}
                  </TableCell>
                  {isMultiDay && (
                    <TableCell className="text-xs">
                      {getEventDayLabel(eventDays, matchTurn?.startTime || match.startTime)}
                    </TableCell>
                  )}
                  <TableCell className="hidden sm:table-cell text-xs sm:text-sm">
                    {matchTurn?.turnNumber ? `T${matchTurn.turnNumber}` : match.turnNumber ? `T${match.turnNumber}` : "-"}
                    {matchTurn?.startTime && (
                      <span className="text-xs text-gray-500 ml-1">
                        ({`${getArgentinaTimeValue(matchTurn.startTime)}${matchTurn.isMixed ? " · Mixto" : ""}`})
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-xs sm:text-sm">
                    <div>{match.venue} {match.courtName}</div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={match.status === DoublesMatchStatus.played ? "default" : "secondary"}
                      className="text-[10px] sm:text-xs"
                    >
                      {match.status === DoublesMatchStatus.played
                        ? "Jugado"
                        : match.status === DoublesMatchStatus.cancelled
                          ? "Cancelado"
                          : "Pendiente"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                      {match.phase === DoublesMatchPhase.playoff &&
                        !match.team2 &&
                        match.status === DoublesMatchStatus.pending && (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={async () => {
                              await mutations.updateMatchResultMutation.mutateAsync({
                                id: match.id,
                                data: { sets: [], winnerId: match.team1!.id },
                              });
                            }}
                          >
                            Avanzar (BYE)
                          </Button>
                        )}
                      <Button variant="outline" size="sm" onClick={() => onEditMatch(match)}>
                        Editar
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(match.id)}>
                        Eliminar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function ResultsTab({
  matches,
  teams,
  mutations,
}: {
  matches: DoublesMatch[];
  teams: DoublesTeam[];
  mutations: ReturnType<typeof useDoublesEventMutations>;
}) {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMatch, setSelectedMatch] = useState<DoublesMatch | null>(null);
  const [isEditingResult, setIsEditingResult] = useState(false);
  const [sets, setSets] = useState([
    { setNumber: 1, team1Score: 0, team2Score: 0 },
    { setNumber: 2, team1Score: 0, team2Score: 0 },
  ]);
  const [winnerId, setWinnerId] = useState<number | undefined>();
  const [showThirdSet, setShowThirdSet] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const matchesSearchQuery = (m: DoublesMatch) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      m.team1?.teamName?.toLowerCase().includes(q) ||
      m.team2?.teamName?.toLowerCase().includes(q)
    );
  };
  const pendingMatches = matches.filter(
    (m) => m.status === DoublesMatchStatus.pending && matchesSearchQuery(m)
  );
  const playedMatches = matches.filter(
    (m) => m.status === DoublesMatchStatus.played && matchesSearchQuery(m)
  );

  const openResult = (match: DoublesMatch, isEdit: boolean = false) => {
    setSelectedMatch(match);
    setIsEditingResult(isEdit);

    if (isEdit && match.sets && match.sets.length > 0) {
      // Pre-load existing sets when editing
      const sortedSets = [...match.sets]
        .sort((a, b) => a.setNumber - b.setNumber)
        .map((s) => ({
          setNumber: s.setNumber,
          team1Score: s.team1Score,
          team2Score: s.team2Score,
        }));
      setSets(sortedSets);
      setShowThirdSet(sortedSets.length > 2);
      setWinnerId(match.winnerId || undefined);
    } else {
      // Reset for new result
      setSets([
        { setNumber: 1, team1Score: 0, team2Score: 0 },
        { setNumber: 2, team1Score: 0, team2Score: 0 },
      ]);
      setWinnerId(undefined);
      setShowThirdSet(false);
    }
  };

  const handleSave = async () => {
    if (!selectedMatch || !winnerId || isSaving) return;
    setIsSaving(true);
    try {
      await mutations.updateMatchResultMutation.mutateAsync({
        id: selectedMatch.id,
        data: { sets, winnerId },
      });
      // Wait for data to refresh before closing dialog
      await queryClient.invalidateQueries({ queryKey: ["doubles-matches"] });
      await queryClient.invalidateQueries({ queryKey: ["doubles-standings"] });
      await queryClient.invalidateQueries({ queryKey: ["doubles-schedule"] });
      toast.success(isEditingResult ? "Resultado actualizado" : "Resultado cargado");
      setSelectedMatch(null);
      setIsEditingResult(false);
    } catch {
      toast.error(isEditingResult ? "Error al actualizar resultado" : "Error al cargar resultado");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDialogClose = () => {
    setSelectedMatch(null);
    setIsEditingResult(false);
  };

  const updateSet = (index: number, field: "team1Score" | "team2Score", value: number) => {
    const newSets = [...sets];
    newSets[index] = { ...newSets[index], [field]: value };
    setSets(newSets);
  };

  return (
    <div>
      <div className="mb-4">
        <Input
          placeholder="Buscar equipo..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-64"
        />
      </div>

      <h2 className="text-lg font-semibold mb-4">Partidos Pendientes</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs sm:text-sm">Partido</TableHead>
              <TableHead className="text-xs sm:text-sm">Fase</TableHead>
              <TableHead className="text-xs sm:text-sm">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingMatches.map((match) => (
              <TableRow key={match.id}>
                <TableCell><MatchScoreboard match={match} compact /></TableCell>
                <TableCell className="text-xs sm:text-sm">
                  {match.phase === DoublesMatchPhase.zone
                    ? match.zoneName
                    : getPlayoffRoundLabel(match.round)}
                </TableCell>
                <TableCell>
                  <Button size="sm" onClick={() => openResult(match, false)}>
                    Cargar Resultado
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {pendingMatches.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-gray-500 py-4">
                  No hay partidos pendientes
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {playedMatches.length > 0 && (
        <>
          <h2 className="text-lg font-semibold mt-8 mb-4">Resultados Cargados</h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs sm:text-sm">Partido</TableHead>
                  <TableHead className="text-xs sm:text-sm">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {playedMatches.map((match) => (
                  <TableRow key={match.id}>
                    <TableCell><MatchScoreboard match={match} /></TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openResult(match, true)}
                      >
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      <Dialog
        open={!!selectedMatch}
        onOpenChange={(v) => !v && handleDialogClose()}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditingResult ? "Editar Resultado" : "Cargar Resultado"}
            </DialogTitle>
          </DialogHeader>
          {selectedMatch && (
            <div className="space-y-4">
              <p className="font-medium text-center">
                {selectedMatch.team1?.teamName} vs{" "}
                {selectedMatch.team2?.teamName}
              </p>

              <div className="flex items-center gap-2 sm:gap-4">
                <span className="text-sm font-medium w-20 sm:w-24"></span>
                <span className="w-16 sm:w-20 text-xs text-center text-gray-500 truncate">
                  {selectedMatch.team1?.teamName}
                </span>
                <span></span>
                <span className="w-16 sm:w-20 text-xs text-center text-gray-500 truncate">
                  {selectedMatch.team2?.teamName}
                </span>
              </div>

              {sets.map((set, idx) => (
                <div key={idx} className="flex items-center gap-2 sm:gap-4">
                  <span className="text-sm font-medium w-20 sm:w-24">
                    {set.setNumber === 3 ? "Super TB" : `Set ${set.setNumber}`}
                  </span>
                  <Input
                    type="number"
                    min={0}
                    value={set.team1Score}
                    onChange={(e) =>
                      updateSet(idx, "team1Score", Number(e.target.value))
                    }
                    className="w-16 sm:w-20"
                  />
                  <span>-</span>
                  <Input
                    type="number"
                    min={0}
                    value={set.team2Score}
                    onChange={(e) =>
                      updateSet(idx, "team2Score", Number(e.target.value))
                    }
                    className="w-16 sm:w-20"
                  />
                </div>
              ))}

              {!showThirdSet && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowThirdSet(true);
                    setSets([...sets, { setNumber: 3, team1Score: 0, team2Score: 0 }]);
                  }}
                >
                  + Agregar Super Tiebreak
                </Button>
              )}

              {showThirdSet && sets.length > 2 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowThirdSet(false);
                    setSets(sets.filter((s) => s.setNumber !== 3));
                  }}
                >
                  - Quitar Super Tiebreak
                </Button>
              )}

              <div>
                <Label>Ganador</Label>
                <Select
                  value={String(winnerId || "")}
                  onValueChange={(v) => setWinnerId(Number(v))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar ganador" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={String(selectedMatch.team1?.id)}>
                      {selectedMatch.team1?.teamName}
                    </SelectItem>
                    {selectedMatch.team2 && (
                      <SelectItem value={String(selectedMatch.team2.id)}>
                        {selectedMatch.team2.teamName}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleSave}
                disabled={!winnerId || isSaving}
                className="w-full"
              >
                {isSaving ? "Guardando..." : isEditingResult ? "Guardar Cambios" : "Guardar Resultado"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
