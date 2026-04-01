"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TeamEventSeriesPhase, TeamEventSeriesStatus } from "@/common/enum/team-event.enum";
import { useTeamEventSeries } from "@/hooks/Team-Event/useTeamEventSeries";
import { useTeamEventTeams } from "@/hooks/Team-Event/useTeamEventTeams";
import { useSeriesMutations } from "@/hooks/Team-Event/useTeamEventMutations";
import { BracketView } from "../components/BracketView";

interface PlayoffsTabProps {
  eventId: number;
  categoryId: number;
}

interface MatchupAssignment {
  positionInBracket: number;
  homeTeamId: string;
  awayTeamId: string;
}

const BRACKET_SIZE_OPTIONS = [2, 4, 8] as const;

function getAvailableBracketSizes(teamCount: number) {
  return BRACKET_SIZE_OPTIONS.filter((size) => teamCount >= size);
}

function getInitialRoundLabel(matchCount: number): string {
  if (matchCount === 1) return "Final";
  if (matchCount === 2) return "Semifinal";
  if (matchCount === 4) return "Cuartos de Final";
  return "Playoff";
}

export function PlayoffsTab({ eventId, categoryId }: PlayoffsTabProps) {
  const { series, isLoading: seriesLoading } = useTeamEventSeries(eventId, categoryId);
  const { teams, isLoading: teamsLoading } = useTeamEventTeams(eventId, categoryId);
  const {
    createPlayoffBracketMutation,
    deletePlayoffBracketMutation,
  } = useSeriesMutations(eventId, categoryId);

  const playoffSeries = useMemo(
    () => series.filter((seriesItem) => seriesItem.phase === TeamEventSeriesPhase.final),
    [series],
  );

  const availableBracketSizes = useMemo(
    () => getAvailableBracketSizes(teams.length),
    [teams.length],
  );

  const [bracketSize, setBracketSize] = useState<string>("");
  const [assignments, setAssignments] = useState<MatchupAssignment[]>([]);

  useEffect(() => {
    if (availableBracketSizes.length === 0) {
      setBracketSize("");
      return;
    }

    const defaultSize = availableBracketSizes.includes(4)
      ? 4
      : availableBracketSizes[0];

    setBracketSize((current) =>
      current && availableBracketSizes.includes(Number(current) as 2 | 4 | 8)
        ? current
        : String(defaultSize),
    );
  }, [availableBracketSizes]);

  useEffect(() => {
    const size = Number(bracketSize);
    if (!size) {
      setAssignments([]);
      return;
    }

    setAssignments(
      Array.from({ length: size / 2 }, (_, index) => ({
        positionInBracket: index + 1,
        homeTeamId: "",
        awayTeamId: "",
      })),
    );
  }, [bracketSize, categoryId]);

  const canDeleteBracket = playoffSeries.every(
    (seriesItem) =>
      seriesItem.status === TeamEventSeriesStatus.pending &&
      (seriesItem.matches?.length ?? 0) === 0,
  );

  const isComplete = assignments.every(
    (assignment) => assignment.homeTeamId && assignment.awayTeamId,
  );

  const hasDuplicates = useMemo(() => {
    const selectedTeamIds = assignments.flatMap((assignment) => [
      assignment.homeTeamId,
      assignment.awayTeamId,
    ]).filter(Boolean);

    return new Set(selectedTeamIds).size !== selectedTeamIds.length;
  }, [assignments]);

  const getAvailableTeams = (
    currentPosition: number,
    slot: "homeTeamId" | "awayTeamId",
  ) => {
    const selectedTeamIds = assignments
      .flatMap((assignment) =>
        assignment.positionInBracket === currentPosition
          ? slot === "homeTeamId"
            ? [assignment.awayTeamId]
            : [assignment.homeTeamId]
          : [assignment.homeTeamId, assignment.awayTeamId],
      )
      .filter(Boolean);

    return teams.filter(
      (team) => !selectedTeamIds.includes(String(team.id)),
    );
  };

  const updateAssignment = (
    positionInBracket: number,
    slot: "homeTeamId" | "awayTeamId",
    value: string,
  ) => {
    setAssignments((currentAssignments) =>
      currentAssignments.map((assignment) =>
        assignment.positionInBracket === positionInBracket
          ? { ...assignment, [slot]: value }
          : assignment,
      ),
    );
  };

  const handleCreateBracket = () => {
    if (!isComplete) {
      toast.error("Debes completar todos los cruces del playoff");
      return;
    }

    if (hasDuplicates) {
      toast.error("No puedes repetir un equipo dentro del cuadro");
      return;
    }

    createPlayoffBracketMutation.mutate(
      {
        matchups: assignments.map((assignment) => ({
          positionInBracket: assignment.positionInBracket,
          homeTeamId: Number(assignment.homeTeamId),
          awayTeamId: Number(assignment.awayTeamId),
        })),
      },
      {
        onSuccess: () => {
          toast.success("Cuadro de playoffs creado");
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message ||
              "No se pudo crear el cuadro de playoffs",
          );
        },
      },
    );
  };

  const handleDeleteBracket = () => {
    if (
      !confirm(
        "¿Eliminar todo el cuadro de playoffs? Solo se puede hacer si aún no se cargaron resultados.",
      )
    ) {
      return;
    }

    deletePlayoffBracketMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Cuadro de playoffs eliminado");
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message ||
            "No se pudo eliminar el cuadro de playoffs",
        );
      },
    });
  };

  if (seriesLoading || teamsLoading) {
    return <p className="text-muted-foreground">Cargando playoffs...</p>;
  }

  if (teams.length < 2) {
    return (
      <p className="text-muted-foreground">
        Necesitas al menos dos equipos en la categoría para armar un playoff.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {playoffSeries.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Armar cuadro manual de playoffs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 max-w-xs">
              <label className="text-sm font-medium">Tamaño del cuadro</label>
              <Select value={bracketSize} onValueChange={setBracketSize}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona tamaño..." />
                </SelectTrigger>
                <SelectContent>
                  {availableBracketSizes.map((size) => (
                    <SelectItem key={size} value={String(size)}>
                      {size} equipos
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {assignments.length > 0 && (
              <div className="space-y-4">
                {assignments.map((assignment) => {
                  const homeTeamOptions = getAvailableTeams(
                    assignment.positionInBracket,
                    "homeTeamId",
                  );
                  const awayTeamOptions = getAvailableTeams(
                    assignment.positionInBracket,
                    "awayTeamId",
                  );

                  return (
                    <div
                      key={assignment.positionInBracket}
                      className="border rounded-lg p-4 space-y-3"
                    >
                      <div className="text-sm font-semibold">
                        {getInitialRoundLabel(assignments.length)}{" "}
                        {assignment.positionInBracket}
                      </div>

                      <Select
                        value={assignment.homeTeamId}
                        onValueChange={(value) =>
                          updateAssignment(
                            assignment.positionInBracket,
                            "homeTeamId",
                            value,
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar equipo local" />
                        </SelectTrigger>
                        <SelectContent>
                          {homeTeamOptions.map((team) => (
                            <SelectItem key={team.id} value={String(team.id)}>
                              {team.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <div className="text-center text-xs text-muted-foreground">
                        vs
                      </div>

                      <Select
                        value={assignment.awayTeamId}
                        onValueChange={(value) =>
                          updateAssignment(
                            assignment.positionInBracket,
                            "awayTeamId",
                            value,
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar equipo visitante" />
                        </SelectTrigger>
                        <SelectContent>
                          {awayTeamOptions.map((team) => (
                            <SelectItem key={team.id} value={String(team.id)}>
                              {team.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex justify-end">
              <Button
                onClick={handleCreateBracket}
                disabled={
                  !isComplete ||
                  hasDuplicates ||
                  createPlayoffBracketMutation.isPending
                }
              >
                {createPlayoffBracketMutation.isPending
                  ? "Creando..."
                  : "Crear cuadro"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Cuadro de playoffs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Los resultados y formaciones de los cruces se cargan desde la pestaña
                <strong> Resultados</strong>. Los ganadores avanzan automáticamente.
              </p>

              <BracketView series={series} />

              <div className="flex justify-end">
                <Button
                  variant="destructive"
                  onClick={handleDeleteBracket}
                  disabled={
                    !canDeleteBracket ||
                    deletePlayoffBracketMutation.isPending
                  }
                >
                  {deletePlayoffBracketMutation.isPending
                    ? "Eliminando..."
                    : "Eliminar cuadro"}
                </Button>
              </div>

              {!canDeleteBracket && (
                <p className="text-sm text-muted-foreground">
                  El cuadro ya tiene cruces iniciados o con resultados. Si quieres rehacerlo,
                  primero deja pendientes las series que ya empezaron.
                </p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
