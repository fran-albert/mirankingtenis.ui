"use client";
import React, { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useDoublesEvent } from "@/hooks/Doubles-Event/useDoublesEvents";
import { useDoublesCategories } from "@/hooks/Doubles-Event/useDoublesCategories";
import { useDoublesTeams } from "@/hooks/Doubles-Event/useDoublesTeams";
import { useDoublesMatches } from "@/hooks/Doubles-Event/useDoublesMatches";
import { useDoublesStandings } from "@/hooks/Doubles-Event/useDoublesStandings";
import { useDoublesSchedule } from "@/hooks/Doubles-Event/useDoublesSchedule";
import { useDoublesEventMutations } from "@/hooks/Doubles-Event/useDoublesEventMutations";
import {
  DoublesEventCategory,
  DoublesTeam,
  DoublesMatch,
  CreateDoublesCategoryRequest,
  CreateDoublesTeamRequest,
  CreateDoublesMatchRequest,
  UpdateDoublesMatchResultRequest,
} from "@/types/Doubles-Event/DoublesEvent";
import { DoublesMatchPhase, DoublesMatchStatus, DoublesEventStatus } from "@/common/enum/doubles-event.enum";
import { DOUBLES_SHIFTS, DOUBLES_VENUES, DOUBLES_ZONES, DOUBLES_PLAYOFF_ROUNDS, getPlayoffRoundLabel, buildDateTime } from "@/common/constants/doubles-event.constants";
import Loading from "@/components/Loading/loading";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

export default function DoublesEventManagePage() {
  const params = useParams();
  const eventId = Number(params.id);
  const { event, isLoading: eventLoading } = useDoublesEvent(eventId);
  const { categories } = useDoublesCategories(eventId);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const mutations = useDoublesEventMutations();

  const activeCategoryId = selectedCategoryId || categories[0]?.id || 0;
  const { teams } = useDoublesTeams(activeCategoryId, !!activeCategoryId);
  const { matches } = useDoublesMatches(activeCategoryId, !!activeCategoryId);
  const { standings } = useDoublesStandings(activeCategoryId, !!activeCategoryId);
  const { schedule } = useDoublesSchedule(eventId);

  if (eventLoading) return <Loading isLoading={true} />;
  if (!event) return <div className="p-6">Evento no encontrado</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{event.name}</h1>
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
        <TabsList className="mb-4">
          <TabsTrigger value="categories">Categorías</TabsTrigger>
          <TabsTrigger value="teams">Equipos</TabsTrigger>
          <TabsTrigger value="matches">Partidos</TabsTrigger>
          <TabsTrigger value="results">Resultados</TabsTrigger>
          <TabsTrigger value="preview">Vista Previa</TabsTrigger>
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

        <TabsContent value="matches">
          <CategorySelector
            categories={categories}
            selected={activeCategoryId}
            onChange={setSelectedCategoryId}
          />
          <MatchesTab
            categoryId={activeCategoryId}
            matches={matches}
            teams={teams}
            mutations={mutations}
            eventDate={event.startDate}
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
              {schedule && <ScheduleGrid schedule={schedule} />}
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
    </div>
  );
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
        <SelectTrigger className="w-[300px]">
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

function MatchesTab({
  categoryId,
  matches,
  teams,
  mutations,
  eventDate,
}: {
  categoryId: number;
  matches: DoublesMatch[];
  teams: DoublesTeam[];
  mutations: ReturnType<typeof useDoublesEventMutations>;
  eventDate: string;
}) {
  const [open, setOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<DoublesMatch | null>(null);
  const [phase, setPhase] = useState<DoublesMatchPhase>(DoublesMatchPhase.zone);
  const [selectedVenueId, setSelectedVenueId] = useState<string>("");
  const [form, setForm] = useState<CreateDoublesMatchRequest>({
    team1Id: 0,
    phase: DoublesMatchPhase.zone,
    venue: "",
    courtName: "",
    turnNumber: undefined,
    startTime: "",
    endTime: "",
    zoneName: "",
    round: "",
    positionInBracket: undefined,
  });

  const isEditing = !!editingMatch;
  const filteredMatches = matches.filter((m) => m.phase === phase);

  // Get courts for selected venue
  const selectedVenue = DOUBLES_VENUES.find((v) => v.id === selectedVenueId);
  const availableCourts = selectedVenue?.courts || [];

  const resetForm = () => {
    setForm({
      team1Id: 0,
      phase: DoublesMatchPhase.zone,
      venue: "",
      courtName: "",
      turnNumber: undefined,
      startTime: "",
      endTime: "",
      zoneName: "",
      round: "",
      positionInBracket: undefined,
    });
    setSelectedVenueId("");
    setEditingMatch(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setOpen(true);
  };

  const handleOpenEdit = (match: DoublesMatch) => {
    setEditingMatch(match);
    // Find venue ID by name
    const venue = DOUBLES_VENUES.find((v) => v.name === match.venue);
    setSelectedVenueId(venue?.id || "");
    setForm({
      team1Id: match.team1?.id || 0,
      team2Id: match.team2?.id,
      phase: match.phase,
      venue: match.venue || "",
      courtName: match.courtName || "",
      turnNumber: match.turnNumber || undefined,
      startTime: match.startTime || "",
      endTime: match.endTime || "",
      zoneName: match.zoneName || "",
      round: match.round || "",
      positionInBracket: match.positionInBracket || undefined,
    });
    setOpen(true);
  };

  const handleTurnChange = (turnNumber: number) => {
    const shift = DOUBLES_SHIFTS.find((s) => s.turnNumber === turnNumber);
    if (shift) {
      setForm({
        ...form,
        turnNumber,
        startTime: buildDateTime(eventDate, shift.startTime),
        endTime: buildDateTime(eventDate, shift.endTime),
      });
    }
  };

  const handleVenueChange = (venueId: string) => {
    const venue = DOUBLES_VENUES.find((v) => v.id === venueId);
    setSelectedVenueId(venueId);
    setForm({
      ...form,
      venue: venue?.name || "",
      courtName: "", // Reset court when venue changes
    });
  };

  const handleZoneChange = (zoneName: string) => {
    setForm({
      ...form,
      zoneName,
      team1Id: isEditing ? form.team1Id : 0, // Keep teams when editing
      team2Id: isEditing ? form.team2Id : undefined,
    });
  };

  // Filter teams by selected zone (only for zone phase)
  const filteredTeams = phase === DoublesMatchPhase.zone && form.zoneName
    ? teams.filter((t) => t.zoneName === form.zoneName)
    : teams;

  const handleSave = async () => {
    try {
      if (isEditing) {
        await mutations.updateMatchMutation.mutateAsync({
          id: editingMatch.id,
          data: { ...form, phase },
        });
        toast.success("Partido actualizado");
      } else {
        await mutations.createMatchMutation.mutateAsync({
          categoryId,
          data: { ...form, phase },
        });
        toast.success("Partido creado");
      }
      setOpen(false);
      resetForm();
    } catch {
      toast.error(isEditing ? "Error al actualizar partido" : "Error al crear partido");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar partido?")) return;
    try {
      await mutations.deleteMatchMutation.mutateAsync(id);
      toast.success("Partido eliminado");
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

  const formatScore = (match: DoublesMatch) => {
    if (!match.sets || match.sets.length === 0) return "-";
    return match.sets
      .sort((a, b) => a.setNumber - b.setNumber)
      .map((s) => `${s.team1Score}-${s.team2Score}`)
      .join(" ");
  };

  const getShiftLabel = (turnNumber: number | null) => {
    if (!turnNumber) return "";
    const shift = DOUBLES_SHIFTS.find((s) => s.turnNumber === turnNumber);
    return shift ? `${shift.startTime} - ${shift.endTime}` : "";
  };

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
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button size="sm" disabled={!categoryId} onClick={handleOpenCreate}>
              Crear Partido
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Editar Partido" : "Nuevo Partido"} - {phase === DoublesMatchPhase.zone ? "Zona" : "Llave"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {phase === DoublesMatchPhase.zone && (
                <div>
                  <Label>Zona</Label>
                  <Select
                    value={form.zoneName || ""}
                    onValueChange={handleZoneChange}
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
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Equipo 1</Label>
                  <Select
                    value={String(form.team1Id || "")}
                    onValueChange={(v) =>
                      setForm({ ...form, team1Id: Number(v) })
                    }
                    disabled={phase === DoublesMatchPhase.zone && !form.zoneName}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={phase === DoublesMatchPhase.zone && !form.zoneName ? "Seleccione zona primero" : "Seleccionar"} />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredTeams
                        .filter((t) => !form.team2Id || t.id !== form.team2Id)
                        .map((t) => (
                          <SelectItem key={t.id} value={String(t.id)}>
                            {t.teamName}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Equipo 2</Label>
                  <Select
                    value={String(form.team2Id || "")}
                    onValueChange={(v) =>
                      setForm({ ...form, team2Id: Number(v) })
                    }
                    disabled={phase === DoublesMatchPhase.zone && !form.zoneName}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={phase === DoublesMatchPhase.zone && !form.zoneName ? "Seleccione zona primero" : "Seleccionar"} />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredTeams
                        .filter((t) => !form.team1Id || t.id !== form.team1Id)
                        .map((t) => (
                          <SelectItem key={t.id} value={String(t.id)}>
                            {t.teamName}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {phase === DoublesMatchPhase.playoff && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Ronda</Label>
                    <Select
                      value={form.round || ""}
                      onValueChange={(v) => setForm({ ...form, round: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar ronda" />
                      </SelectTrigger>
                      <SelectContent>
                        {DOUBLES_PLAYOFF_ROUNDS.map((round) => (
                          <SelectItem key={round.id} value={round.value}>
                            {round.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Posición Bracket</Label>
                    <Input
                      type="number"
                      value={form.positionInBracket || ""}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          positionInBracket: Number(e.target.value) || undefined,
                        })
                      }
                    />
                  </div>
                </div>
              )}
              <div>
                <Label>Turno</Label>
                <Select
                  value={String(form.turnNumber || "")}
                  onValueChange={(v) => handleTurnChange(Number(v))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar turno" />
                  </SelectTrigger>
                  <SelectContent>
                    {DOUBLES_SHIFTS.map((shift) => (
                      <SelectItem key={shift.turnNumber} value={String(shift.turnNumber)}>
                        {shift.label} ({shift.startTime} - {shift.endTime})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Sede</Label>
                  <Select
                    value={selectedVenueId}
                    onValueChange={handleVenueChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar sede" />
                    </SelectTrigger>
                    <SelectContent>
                      {DOUBLES_VENUES.map((venue) => (
                        <SelectItem key={venue.id} value={venue.id}>
                          {venue.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Cancha</Label>
                  <Select
                    value={form.courtName || ""}
                    onValueChange={(v) => setForm({ ...form, courtName: v })}
                    disabled={!selectedVenueId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar cancha" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCourts.map((court) => (
                        <SelectItem key={court} value={court}>
                          {court}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button
                onClick={handleSave}
                disabled={!form.team1Id}
                className="w-full"
              >
                {isEditing ? "Guardar Cambios" : "Crear Partido"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Equipo 1</TableHead>
            <TableHead>Equipo 2</TableHead>
            <TableHead>{phase === DoublesMatchPhase.zone ? "Zona" : "Ronda"}</TableHead>
            <TableHead>Turno</TableHead>
            <TableHead>Sede/Cancha</TableHead>
            <TableHead>Resultado</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredMatches.map((match) => (
            <TableRow key={match.id}>
              <TableCell>{match.team1?.teamName}</TableCell>
              <TableCell>{match.team2?.teamName || "BYE"}</TableCell>
              <TableCell>
                {phase === DoublesMatchPhase.zone ? match.zoneName : getPlayoffRoundLabel(match.round)}
              </TableCell>
              <TableCell>
                {match.turnNumber}
                <span className="text-xs text-gray-500 ml-1">
                  ({getShiftLabel(match.turnNumber)})
                </span>
              </TableCell>
              <TableCell>
                {match.venue} {match.courtName}
              </TableCell>
              <TableCell>{formatScore(match)}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    match.status === DoublesMatchStatus.played
                      ? "default"
                      : "secondary"
                  }
                >
                  {match.status === DoublesMatchStatus.played
                    ? "Jugado"
                    : match.status === DoublesMatchStatus.cancelled
                      ? "Cancelado"
                      : "Pendiente"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEdit(match)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(match.id)}
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
  const [selectedMatch, setSelectedMatch] = useState<DoublesMatch | null>(null);
  const [isEditingResult, setIsEditingResult] = useState(false);
  const [sets, setSets] = useState([
    { setNumber: 1, team1Score: 0, team2Score: 0 },
    { setNumber: 2, team1Score: 0, team2Score: 0 },
  ]);
  const [winnerId, setWinnerId] = useState<number | undefined>();
  const [showThirdSet, setShowThirdSet] = useState(false);

  const pendingMatches = matches.filter(
    (m) => m.status === DoublesMatchStatus.pending
  );
  const playedMatches = matches.filter(
    (m) => m.status === DoublesMatchStatus.played
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
    if (!selectedMatch || !winnerId) return;
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

  const formatScore = (match: DoublesMatch) => {
    if (!match.sets || match.sets.length === 0) return "-";
    return match.sets
      .sort((a, b) => a.setNumber - b.setNumber)
      .map((s) => `${s.team1Score}-${s.team2Score}`)
      .join(" ");
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Partidos Pendientes</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Equipo 1</TableHead>
            <TableHead>Equipo 2</TableHead>
            <TableHead>Fase</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pendingMatches.map((match) => (
            <TableRow key={match.id}>
              <TableCell>{match.team1?.teamName}</TableCell>
              <TableCell>{match.team2?.teamName || "BYE"}</TableCell>
              <TableCell>
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
              <TableCell colSpan={4} className="text-center text-gray-500 py-4">
                No hay partidos pendientes
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {playedMatches.length > 0 && (
        <>
          <h2 className="text-lg font-semibold mt-8 mb-4">Resultados Cargados</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Equipo 1</TableHead>
                <TableHead>Equipo 2</TableHead>
                <TableHead>Resultado</TableHead>
                <TableHead>Ganador</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {playedMatches.map((match) => (
                <TableRow key={match.id}>
                  <TableCell>{match.team1?.teamName}</TableCell>
                  <TableCell>{match.team2?.teamName}</TableCell>
                  <TableCell>{formatScore(match)}</TableCell>
                  <TableCell className="font-medium">
                    {match.winner?.teamName}
                  </TableCell>
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
        </>
      )}

      <Dialog
        open={!!selectedMatch}
        onOpenChange={(v) => !v && handleDialogClose()}
      >
        <DialogContent>
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

              {sets.map((set, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <span className="text-sm font-medium w-24">
                    {set.setNumber === 3 ? "Super Tiebreak" : `Set ${set.setNumber}`}
                  </span>
                  <Input
                    type="number"
                    min={0}
                    value={set.team1Score}
                    onChange={(e) =>
                      updateSet(idx, "team1Score", Number(e.target.value))
                    }
                    className="w-20"
                  />
                  <span>-</span>
                  <Input
                    type="number"
                    min={0}
                    value={set.team2Score}
                    onChange={(e) =>
                      updateSet(idx, "team2Score", Number(e.target.value))
                    }
                    className="w-20"
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
                disabled={!winnerId}
                className="w-full"
              >
                {isEditingResult ? "Guardar Cambios" : "Guardar Resultado"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
