"use client";

import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DoublesMatchPhase, DoublesMatchStatus } from "@/common/enum/doubles-event.enum";
import {
  DOUBLES_PLAYOFF_ROUNDS,
  DOUBLES_VENUES,
  DOUBLES_ZONES,
  getEventDays,
  getPlayoffRoundLabel,
} from "@/common/constants/doubles-event.constants";
import {
  CreateDoublesMatchRequest,
  DoublesEventCategory,
  DoublesMatch,
  DoublesTeam,
  DoublesTurn,
} from "@/types/Doubles-Event/DoublesEvent";
import { useDoublesEventMutations } from "@/hooks/Doubles-Event/useDoublesEventMutations";

type MatchEditorMode = "create" | "edit";

interface MatchEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: MatchEditorMode;
  categoryId: number;
  categories: DoublesEventCategory[];
  initialMatch?: DoublesMatch | null;
  initialPhase: DoublesMatchPhase;
  turns: DoublesTurn[];
  teams: DoublesTeam[];
  allEventMatches: DoublesMatch[];
  mutations: ReturnType<typeof useDoublesEventMutations>;
  eventStartDate: string;
  eventEndDate: string | null;
}

function createEmptyMatchForm(): CreateDoublesMatchRequest {
  return {
    team1Id: 0,
    team2Id: undefined,
    phase: DoublesMatchPhase.zone,
    turnId: undefined,
    venue: "",
    courtName: "",
    turnNumber: undefined,
    startTime: "",
    endTime: "",
    zoneName: "",
    round: "",
    positionInBracket: undefined,
  };
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

function formatTeamLabel(team: DoublesTeam) {
  return `${team.teamName} · ${team.player1Name} / ${team.player2Name}`;
}

function getMatchAssignmentLabel(match: DoublesMatch) {
  const turnNumber = match.turn?.turnNumber ?? match.turnNumber;
  const startTime = match.turn?.startTime ?? match.startTime;

  if (!turnNumber || !match.venue || !match.courtName) {
    return "Sin programar";
  }

  const timeLabel = getArgentinaTimeValue(startTime || null);
  return `T${turnNumber}${timeLabel ? ` · ${timeLabel}` : ""} · ${match.venue} ${match.courtName}`;
}

export function MatchEditorDialog({
  open,
  onOpenChange,
  mode,
  categoryId,
  categories,
  initialMatch,
  initialPhase,
  turns,
  teams,
  allEventMatches,
  mutations,
  eventStartDate,
  eventEndDate,
}: MatchEditorDialogProps) {
  const eventDays = useMemo(
    () => getEventDays(eventStartDate, eventEndDate),
    [eventStartDate, eventEndDate]
  );
  const isEditing = mode === "edit" && !!initialMatch;
  const phase = isEditing ? initialMatch.phase : initialPhase;
  const [selectedVenueId, setSelectedVenueId] = useState("");
  const [form, setForm] = useState<CreateDoublesMatchRequest>(createEmptyMatchForm());
  const [isSaving, setIsSaving] = useState(false);
  const [showReplacementSelector, setShowReplacementSelector] = useState(false);
  const [replacementQuery, setReplacementQuery] = useState("");
  const [replacementMatchId, setReplacementMatchId] = useState<number | null>(null);
  const [isReplacing, setIsReplacing] = useState(false);

  const availableTurns = useMemo(
    () =>
      [...turns].sort(
        (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      ),
    [turns]
  );

  const selectedVenue = DOUBLES_VENUES.find((venue) => venue.id === selectedVenueId);
  const availableCourts = selectedVenue?.courts || [];
  const categoryName = categories.find((category) => category.id === categoryId)?.name;

  const zoneFilteredTeams =
    phase === DoublesMatchPhase.zone && form.zoneName
      ? teams.filter((team) => team.zoneName === form.zoneName)
      : teams;

  const team1Options = zoneFilteredTeams.filter(
    (team) => !form.team2Id || team.id !== form.team2Id
  );
  const team2Options = zoneFilteredTeams.filter((team) => team.id !== form.team1Id);

  const replacementOptions = useMemo(() => {
    const normalizedQuery = replacementQuery.trim().toLowerCase();

    return allEventMatches
      .filter((match) => match.id !== initialMatch?.id)
      .filter((match) => match.status === DoublesMatchStatus.pending)
      .filter((match) => {
        if (!normalizedQuery) return true;

        const categoryLabel =
          categories.find((category) => category.id === match.categoryId)?.name || "";
        const phaseLabel =
          match.phase === DoublesMatchPhase.zone
            ? match.zoneName || ""
            : getPlayoffRoundLabel(match.round);
        const haystack = [
          categoryLabel,
          phaseLabel,
          match.team1?.teamName,
          match.team1?.player1Name,
          match.team1?.player2Name,
          match.team2?.teamName,
          match.team2?.player1Name,
          match.team2?.player2Name,
          getMatchAssignmentLabel(match),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return haystack.includes(normalizedQuery);
      });
  }, [allEventMatches, categories, initialMatch?.id, replacementQuery]);

  useEffect(() => {
    if (!open) {
      return;
    }

    setShowReplacementSelector(false);
    setReplacementQuery("");
    setReplacementMatchId(null);

    if (isEditing && initialMatch) {
      const venue = DOUBLES_VENUES.find((item) => item.name === initialMatch.venue);
      setSelectedVenueId(venue?.id || "");
      setForm({
        team1Id: initialMatch.team1?.id || 0,
        team2Id: initialMatch.team2?.id,
        phase: initialMatch.phase,
        turnId: initialMatch.turnId || undefined,
        venue: initialMatch.venue || "",
        courtName: initialMatch.courtName || "",
        turnNumber: initialMatch.turnNumber || undefined,
        startTime: initialMatch.startTime || "",
        endTime: initialMatch.endTime || "",
        zoneName: initialMatch.zoneName || "",
        round: initialMatch.round || "",
        positionInBracket: initialMatch.positionInBracket || undefined,
      });
      return;
    }

    setSelectedVenueId("");
    setForm({
      ...createEmptyMatchForm(),
      phase,
    });
  }, [open, isEditing, initialMatch, phase]);

  const handleZoneChange = (zoneName: string) => {
    setForm((current) => {
      const team1 = teams.find((team) => team.id === current.team1Id);
      const team2 = teams.find((team) => team.id === current.team2Id);

      return {
        ...current,
        zoneName,
        team1Id: team1 && team1.zoneName !== zoneName ? 0 : current.team1Id,
        team2Id: team2 && team2.zoneName !== zoneName ? undefined : current.team2Id,
      };
    });
  };

  const handleTeam1Change = (value: string) => {
    const nextTeamId = Number(value);
    const selectedTeam = teams.find((team) => team.id === nextTeamId);

    setForm((current) => {
      if (phase !== DoublesMatchPhase.zone) {
        return { ...current, team1Id: nextTeamId };
      }

      const nextZone = selectedTeam?.zoneName || "";
      const currentTeam2 = teams.find((team) => team.id === current.team2Id);

      return {
        ...current,
        team1Id: nextTeamId,
        zoneName: nextZone,
        team2Id:
          currentTeam2 && currentTeam2.zoneName !== nextZone
            ? undefined
            : current.team2Id,
      };
    });
  };

  const handleTeam2Change = (value: string) => {
    const nextTeamId = Number(value);
    const selectedTeam = teams.find((team) => team.id === nextTeamId);

    setForm((current) => {
      if (phase !== DoublesMatchPhase.zone) {
        return { ...current, team2Id: nextTeamId };
      }

      const nextZone = selectedTeam?.zoneName || "";
      const currentTeam1 = teams.find((team) => team.id === current.team1Id);

      return {
        ...current,
        team2Id: nextTeamId,
        zoneName: nextZone,
        team1Id:
          currentTeam1 && currentTeam1.zoneName !== nextZone
            ? 0
            : current.team1Id,
      };
    });
  };

  const handleTurnChange = (turnId: number) => {
    const selectedTurn = turns.find((turn) => turn.id === turnId);
    setForm((current) => ({
      ...current,
      turnId: selectedTurn?.id,
      turnNumber: selectedTurn?.turnNumber,
      startTime: selectedTurn?.startTime || "",
      endTime: selectedTurn?.endTime || "",
    }));
  };

  const handleVenueChange = (venueId: string) => {
    const venue = DOUBLES_VENUES.find((item) => item.id === venueId);
    setSelectedVenueId(venueId);
    setForm((current) => ({
      ...current,
      venue: venue?.name || "",
      courtName: "",
    }));
  };

  const handleSave = async () => {
    if (isSaving || !categoryId) return;

    const payload: CreateDoublesMatchRequest = {
      ...form,
      phase,
      zoneName:
        phase === DoublesMatchPhase.zone
          ? form.zoneName ||
            teams.find((team) => team.id === form.team1Id)?.zoneName ||
            teams.find((team) => team.id === form.team2Id)?.zoneName ||
            ""
          : "",
    };

    try {
      setIsSaving(true);

      if (isEditing && initialMatch) {
        await mutations.updateMatchMutation.mutateAsync({
          id: initialMatch.id,
          data: payload,
        });
        toast.success("Partido actualizado");
      } else {
        await mutations.createMatchMutation.mutateAsync({
          categoryId,
          data: payload,
        });
        toast.success("Partido creado");
      }

      onOpenChange(false);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          (isEditing ? "Error al actualizar partido" : "Error al crear partido")
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleReplace = async () => {
    if (!initialMatch || !replacementMatchId || isReplacing) return;

    try {
      setIsReplacing(true);
      await mutations.replaceMatchMutation.mutateAsync({
        id: initialMatch.id,
        replacementMatchId,
      });
      toast.success("Partido reemplazado");
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Error al reemplazar partido");
    } finally {
      setIsReplacing(false);
    }
  };

  const canReplace =
    isEditing &&
    initialMatch?.status === DoublesMatchStatus.pending &&
    replacementOptions.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Partido" : "Nuevo Partido"} -{" "}
            {phase === DoublesMatchPhase.zone ? "Zona" : "Llave"}
          </DialogTitle>
          {categoryName && <p className="text-sm text-muted-foreground">{categoryName}</p>}
        </DialogHeader>

        <div className="space-y-4">
          {phase === DoublesMatchPhase.zone && (
            <div>
              <Label>Zona</Label>
              <Select value={form.zoneName || ""} onValueChange={handleZoneChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por zona" />
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Equipo 1</Label>
              <Select
                value={String(form.team1Id || "")}
                onValueChange={handleTeam1Change}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar equipo" />
                </SelectTrigger>
                <SelectContent>
                  {team1Options.map((team) => (
                    <SelectItem key={team.id} value={String(team.id)}>
                      {formatTeamLabel(team)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Equipo 2</Label>
              <Select
                value={String(form.team2Id || "")}
                onValueChange={handleTeam2Change}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar equipo" />
                </SelectTrigger>
                <SelectContent>
                  {team2Options.map((team) => (
                    <SelectItem key={team.id} value={String(team.id)}>
                      {formatTeamLabel(team)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {phase === DoublesMatchPhase.playoff && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Ronda</Label>
                <Select
                  value={form.round || ""}
                  onValueChange={(value) =>
                    setForm((current) => ({ ...current, round: value }))
                  }
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
                    setForm((current) => ({
                      ...current,
                      positionInBracket: Number(e.target.value) || undefined,
                    }))
                  }
                />
              </div>
            </div>
          )}

          <div>
            <Label>Turno Digitalizado</Label>
            <Select
              value={String(form.turnId || "")}
              onValueChange={(value) => handleTurnChange(Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar turno" />
              </SelectTrigger>
              <SelectContent>
                {availableTurns.map((turn) => (
                  <SelectItem key={turn.id} value={String(turn.id)}>
                    {formatTurnOption(turn, eventDays)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {availableTurns.length === 0 && (
              <p className="text-xs text-amber-600 mt-2">
                No hay turnos disponibles. Primero cargá los turnos en la pestaña Turnos.
              </p>
            )}
          </div>

          {form.turnId && (
            <div className="rounded-md border p-3 text-sm bg-slate-50">
              <div className="font-medium mb-1">Detalle del turno seleccionado</div>
              <div>{getEventDayLabel(eventDays, form.startTime || null)}</div>
              <div>
                {`T${form.turnNumber}${turns.find((turn) => turn.id === form.turnId)?.isMixed ? " - Mixto" : ""}`}{" "}
                · {getArgentinaTimeValue(form.startTime || null)}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Sede</Label>
              <Select value={selectedVenueId} onValueChange={handleVenueChange}>
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
                onValueChange={(value) =>
                  setForm((current) => ({ ...current, courtName: value }))
                }
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

          {canReplace && (
            <div className="rounded-md border p-4 space-y-3 bg-slate-50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <div className="font-medium">Reemplazar partido</div>
                  <p className="text-xs text-muted-foreground">
                    Intercambia este turno/cancha con otro partido pendiente del torneo.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowReplacementSelector((current) => !current)}
                  disabled={isReplacing}
                >
                  Reemplazar partido
                </Button>
              </div>

              {showReplacementSelector && (
                <div className="space-y-3">
                  <Input
                    placeholder="Buscar por categoría, zona, ronda o equipo..."
                    value={replacementQuery}
                    onChange={(e) => setReplacementQuery(e.target.value)}
                  />

                  <div className="max-h-64 overflow-y-auto rounded-md border bg-white">
                    {replacementOptions.length === 0 ? (
                      <div className="px-3 py-4 text-sm text-muted-foreground">
                        No hay partidos pendientes para reemplazar con ese criterio.
                      </div>
                    ) : (
                      replacementOptions.map((match) => {
                        const isSelected = replacementMatchId === match.id;
                        const matchCategoryName =
                          categories.find((category) => category.id === match.categoryId)?.name ||
                          "Sin categoría";
                        const phaseLabel =
                          match.phase === DoublesMatchPhase.zone
                            ? match.zoneName || "Sin zona"
                            : getPlayoffRoundLabel(match.round);

                        return (
                          <button
                            key={match.id}
                            type="button"
                            onClick={() => setReplacementMatchId(match.id)}
                            className={`w-full text-left px-3 py-3 border-b last:border-b-0 transition-colors ${
                              isSelected ? "bg-slate-100" : "hover:bg-slate-50"
                            }`}
                          >
                            <div className="text-sm font-medium">
                              {matchCategoryName} · {phaseLabel}
                            </div>
                            <div className="text-sm">
                              {match.team1?.teamName || "TBD"} vs {match.team2?.teamName || "BYE"}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {getMatchAssignmentLabel(match)}
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>

                  <Button
                    type="button"
                    variant="default"
                    onClick={handleReplace}
                    disabled={!replacementMatchId || isReplacing}
                    className="w-full"
                  >
                    {isReplacing ? "Reemplazando..." : "Confirmar reemplazo"}
                  </Button>
                </div>
              )}
            </div>
          )}

          <Button
            onClick={handleSave}
            disabled={
              isSaving || !form.team1Id || !form.turnId || !form.venue || !form.courtName
            }
            className="w-full"
          >
            {isSaving
              ? isEditing
                ? "Guardando..."
                : "Creando..."
              : isEditing
                ? "Guardar Cambios"
                : "Crear Partido"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
