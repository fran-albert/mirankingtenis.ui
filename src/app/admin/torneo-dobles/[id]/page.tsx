"use client";
import React, { useState, useMemo } from "react";
import { useParams } from "next/navigation";
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
            {new Date(event.startDate).toLocaleDateString("es-AR")}
            {event.endDate &&
              ` - ${new Date(event.endDate).toLocaleDateString("es-AR")}`}
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
  const [form, setForm] = useState<CreateDoublesCategoryRequest>({
    name: "",
    gender: "male",
    level: "A",
    pointsForWin: 3,
    pointsForLoss: 1,
    pointsForNotPlayed: 0,
  });

  const handleCreate = async () => {
    try {
      await mutations.createCategoryMutation.mutateAsync({
        eventId,
        data: form,
      });
      toast.success("Categoría creada");
      setOpen(false);
      setForm({ name: "", gender: "male", level: "A", pointsForWin: 3, pointsForLoss: 1, pointsForNotPlayed: 0 });
    } catch {
      toast.error("Error al crear categoría");
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

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-lg font-semibold">Categorías</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">Crear Categoría</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nueva Categoría</DialogTitle>
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
              <Button onClick={handleCreate} disabled={!form.name} className="w-full">
                Crear
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
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(cat.id)}
                >
                  Eliminar
                </Button>
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
  const [form, setForm] = useState<CreateDoublesTeamRequest>({
    player1Name: "",
    player2Name: "",
    zoneName: "",
  });

  const handleCreate = async () => {
    try {
      await mutations.createTeamMutation.mutateAsync({
        categoryId,
        data: form,
      });
      toast.success("Equipo creado");
      setOpen(false);
      setForm({ player1Name: "", player2Name: "", zoneName: "" });
    } catch {
      toast.error("Error al crear equipo");
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
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" disabled={!categoryId}>
              Crear Equipo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nuevo Equipo</DialogTitle>
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
                <Input
                  value={form.zoneName || ""}
                  onChange={(e) =>
                    setForm({ ...form, zoneName: e.target.value })
                  }
                  placeholder="Zona 1"
                />
              </div>
              <Button
                onClick={handleCreate}
                disabled={!form.player1Name || !form.player2Name}
                className="w-full"
              >
                Crear
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
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(team.id)}
                    >
                      Eliminar
                    </Button>
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
}: {
  categoryId: number;
  matches: DoublesMatch[];
  teams: DoublesTeam[];
  mutations: ReturnType<typeof useDoublesEventMutations>;
}) {
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<DoublesMatchPhase>(DoublesMatchPhase.zone);
  const [form, setForm] = useState<CreateDoublesMatchRequest>({
    team1Id: 0,
    phase: DoublesMatchPhase.zone,
    venue: "",
    courtName: "",
    turnNumber: 1,
    startTime: "",
    endTime: "",
    zoneName: "",
    round: "",
    positionInBracket: undefined,
  });

  const filteredMatches = matches.filter((m) => m.phase === phase);

  const handleCreate = async () => {
    try {
      await mutations.createMatchMutation.mutateAsync({
        categoryId,
        data: { ...form, phase },
      });
      toast.success("Partido creado");
      setOpen(false);
      setForm({
        team1Id: 0,
        phase: DoublesMatchPhase.zone,
        venue: "",
        courtName: "",
        turnNumber: 1,
        startTime: "",
        endTime: "",
        zoneName: "",
        round: "",
      });
    } catch {
      toast.error("Error al crear partido");
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

  const formatScore = (match: DoublesMatch) => {
    if (!match.sets || match.sets.length === 0) return "-";
    return match.sets
      .sort((a, b) => a.setNumber - b.setNumber)
      .map((s) => `${s.team1Score}-${s.team2Score}`)
      .join(" ");
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
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" disabled={!categoryId}>
              Crear Partido
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                Nuevo Partido - {phase === DoublesMatchPhase.zone ? "Zona" : "Llave"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Equipo 1</Label>
                  <Select
                    value={String(form.team1Id || "")}
                    onValueChange={(v) =>
                      setForm({ ...form, team1Id: Number(v) })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map((t) => (
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
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map((t) => (
                        <SelectItem key={t.id} value={String(t.id)}>
                          {t.teamName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {phase === DoublesMatchPhase.zone && (
                <div>
                  <Label>Zona</Label>
                  <Input
                    value={form.zoneName || ""}
                    onChange={(e) =>
                      setForm({ ...form, zoneName: e.target.value })
                    }
                    placeholder="Zona 1"
                  />
                </div>
              )}
              {phase === DoublesMatchPhase.playoff && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Ronda</Label>
                    <Input
                      value={form.round || ""}
                      onChange={(e) =>
                        setForm({ ...form, round: e.target.value })
                      }
                      placeholder="Semifinal"
                    />
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
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Turno #</Label>
                  <Input
                    type="number"
                    value={form.turnNumber || ""}
                    onChange={(e) =>
                      setForm({ ...form, turnNumber: Number(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <Label>Sede</Label>
                  <Input
                    value={form.venue || ""}
                    onChange={(e) =>
                      setForm({ ...form, venue: e.target.value })
                    }
                    placeholder="LA VILLA"
                  />
                </div>
                <div>
                  <Label>Cancha</Label>
                  <Input
                    value={form.courtName || ""}
                    onChange={(e) =>
                      setForm({ ...form, courtName: e.target.value })
                    }
                    placeholder="C1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Hora Inicio</Label>
                  <Input
                    type="datetime-local"
                    value={form.startTime || ""}
                    onChange={(e) =>
                      setForm({ ...form, startTime: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Hora Fin</Label>
                  <Input
                    type="datetime-local"
                    value={form.endTime || ""}
                    onChange={(e) =>
                      setForm({ ...form, endTime: e.target.value })
                    }
                  />
                </div>
              </div>
              <Button
                onClick={handleCreate}
                disabled={!form.team1Id}
                className="w-full"
              >
                Crear Partido
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
                {phase === DoublesMatchPhase.zone ? match.zoneName : match.round}
              </TableCell>
              <TableCell>{match.turnNumber}</TableCell>
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
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(match.id)}
                >
                  Eliminar
                </Button>
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
  const [selectedMatch, setSelectedMatch] = useState<DoublesMatch | null>(null);
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

  const openResult = (match: DoublesMatch) => {
    setSelectedMatch(match);
    setSets([
      { setNumber: 1, team1Score: 0, team2Score: 0 },
      { setNumber: 2, team1Score: 0, team2Score: 0 },
    ]);
    setWinnerId(undefined);
    setShowThirdSet(false);
  };

  const handleSave = async () => {
    if (!selectedMatch || !winnerId) return;
    const setsToSend = showThirdSet ? [...sets, { setNumber: 3, team1Score: 0, team2Score: 0 }] : sets;
    const finalSets = showThirdSet
      ? setsToSend
      : sets;
    try {
      await mutations.updateMatchResultMutation.mutateAsync({
        id: selectedMatch.id,
        data: { sets: finalSets, winnerId },
      });
      toast.success("Resultado cargado");
      setSelectedMatch(null);
    } catch {
      toast.error("Error al cargar resultado");
    }
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
                  : match.round}
              </TableCell>
              <TableCell>
                <Button size="sm" onClick={() => openResult(match)}>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}

      <Dialog
        open={!!selectedMatch}
        onOpenChange={(v) => !v && setSelectedMatch(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cargar Resultado</DialogTitle>
          </DialogHeader>
          {selectedMatch && (
            <div className="space-y-4">
              <p className="font-medium text-center">
                {selectedMatch.team1?.teamName} vs{" "}
                {selectedMatch.team2?.teamName}
              </p>

              {sets.map((set, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <span className="text-sm font-medium w-12">Set {set.setNumber}</span>
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
                  + Agregar Set 3
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
                Guardar Resultado
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
