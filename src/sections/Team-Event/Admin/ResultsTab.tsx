"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { toast } from "sonner";
import {
  TeamEventSeries,
  TeamEventPlayer,
  MatchResultRequest,
  LoadSeriesResultRequest,
} from "@/types/Team-Event/TeamEvent";
import {
  TeamEventSeriesStatus,
  TeamEventMatchType,
} from "@/common/enum/team-event.enum";
import { useTeamEventSeries } from "@/hooks/Team-Event/useTeamEventSeries";
import { useTeamEventTeams } from "@/hooks/Team-Event/useTeamEventTeams";
import { useSeriesMutations } from "@/hooks/Team-Event/useTeamEventMutations";
import { SeriesCard } from "../SeriesCard";

interface ResultsTabProps {
  eventId: number;
  singlesPerSeries: number;
  doublesPerSeries: number;
  gamesPerMatch: number;
}

interface MatchForm {
  matchType: TeamEventMatchType;
  homePlayer1Id: string;
  homePlayer2Id: string;
  awayPlayer1Id: string;
  awayPlayer2Id: string;
  homeGames: string;
  awayGames: string;
  hasTiebreak: boolean;
  homeTiebreakScore: string;
  awayTiebreakScore: string;
}

const matchTypeLabels: Record<TeamEventMatchType, string> = {
  [TeamEventMatchType.singles1]: "Singles 1",
  [TeamEventMatchType.singles2]: "Singles 2",
  [TeamEventMatchType.doubles]: "Dobles",
};

function emptyMatchForm(matchType: TeamEventMatchType): MatchForm {
  return {
    matchType,
    homePlayer1Id: "",
    homePlayer2Id: "",
    awayPlayer1Id: "",
    awayPlayer2Id: "",
    homeGames: "",
    awayGames: "",
    hasTiebreak: false,
    homeTiebreakScore: "",
    awayTiebreakScore: "",
  };
}

function buildMatchTypes(
  singlesCount: number,
  doublesCount: number
): TeamEventMatchType[] {
  const types: TeamEventMatchType[] = [];
  const singlesTypes = [TeamEventMatchType.singles1, TeamEventMatchType.singles2];
  for (let i = 0; i < singlesCount && i < singlesTypes.length; i++) {
    types.push(singlesTypes[i]);
  }
  for (let i = 0; i < doublesCount; i++) {
    types.push(TeamEventMatchType.doubles);
  }
  return types;
}

export function ResultsTab({
  eventId,
  singlesPerSeries,
  doublesPerSeries,
  gamesPerMatch,
}: ResultsTabProps) {
  const { series, isLoading: seriesLoading } = useTeamEventSeries(eventId);
  const { teams } = useTeamEventTeams(eventId);
  const { loadResultMutation, updateResultMutation } = useSeriesMutations(eventId);

  const [selectedSeries, setSelectedSeries] = useState<TeamEventSeries | null>(null);
  const matchTypes = buildMatchTypes(singlesPerSeries, doublesPerSeries);
  const [matchForms, setMatchForms] = useState<MatchForm[]>([]);

  const openResultDialog = (s: TeamEventSeries) => {
    setSelectedSeries(s);

    if (s.matches && s.matches.length > 0) {
      setMatchForms(
        s.matches.map((m) => ({
          matchType: m.matchType,
          homePlayer1Id: String(m.homePlayer1Id),
          homePlayer2Id: m.homePlayer2Id ? String(m.homePlayer2Id) : "",
          awayPlayer1Id: String(m.awayPlayer1Id),
          awayPlayer2Id: m.awayPlayer2Id ? String(m.awayPlayer2Id) : "",
          homeGames: String(m.homeGames),
          awayGames: String(m.awayGames),
          hasTiebreak: m.hasTiebreak,
          homeTiebreakScore: m.homeTiebreakScore ? String(m.homeTiebreakScore) : "",
          awayTiebreakScore: m.awayTiebreakScore ? String(m.awayTiebreakScore) : "",
        }))
      );
    } else {
      setMatchForms(matchTypes.map((mt) => emptyMatchForm(mt)));
    }
  };

  const updateMatchForm = (index: number, field: keyof MatchForm, value: string | boolean) => {
    setMatchForms((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const getActivePlayers = (teamId: number): TeamEventPlayer[] => {
    const team = teams.find((t) => t.id === teamId);
    if (!team) return [];
    return team.players.filter((p: TeamEventPlayer) => !p.leftAt);
  };

  const isFormValid = (): boolean => {
    return matchForms.every((f) => {
      const isDoubles = f.matchType === TeamEventMatchType.doubles;
      const hp1 = parseInt(f.homePlayer1Id, 10);
      const ap1 = parseInt(f.awayPlayer1Id, 10);
      const hg = parseInt(f.homeGames, 10);
      const ag = parseInt(f.awayGames, 10);
      if (isNaN(hp1) || hp1 <= 0) return false;
      if (isNaN(ap1) || ap1 <= 0) return false;
      if (isNaN(hg) || hg < 0) return false;
      if (isNaN(ag) || ag < 0) return false;
      if (isDoubles) {
        const hp2 = parseInt(f.homePlayer2Id, 10);
        const ap2 = parseInt(f.awayPlayer2Id, 10);
        if (isNaN(hp2) || hp2 <= 0) return false;
        if (isNaN(ap2) || ap2 <= 0) return false;
      }
      if (f.hasTiebreak) {
        const htb = parseInt(f.homeTiebreakScore, 10);
        const atb = parseInt(f.awayTiebreakScore, 10);
        if (isNaN(htb) || htb < 0) return false;
        if (isNaN(atb) || atb < 0) return false;
      }
      return true;
    });
  };

  const handleSubmit = () => {
    if (!selectedSeries) return;

    if (!isFormValid()) {
      toast.error("Completá todos los campos correctamente");
      return;
    }

    const matches: MatchResultRequest[] = matchForms.map((f) => {
      const isDoubles = f.matchType === TeamEventMatchType.doubles;
      return {
        matchType: f.matchType,
        homePlayer1Id: parseInt(f.homePlayer1Id, 10),
        homePlayer2Id: isDoubles ? parseInt(f.homePlayer2Id, 10) : undefined,
        awayPlayer1Id: parseInt(f.awayPlayer1Id, 10),
        awayPlayer2Id: isDoubles ? parseInt(f.awayPlayer2Id, 10) : undefined,
        homeGames: parseInt(f.homeGames, 10),
        awayGames: parseInt(f.awayGames, 10),
        hasTiebreak: f.hasTiebreak || undefined,
        homeTiebreakScore: f.hasTiebreak ? parseInt(f.homeTiebreakScore, 10) : undefined,
        awayTiebreakScore: f.hasTiebreak ? parseInt(f.awayTiebreakScore, 10) : undefined,
      };
    });

    const data: LoadSeriesResultRequest = { matches };
    const isUpdate = selectedSeries.status === TeamEventSeriesStatus.completed;
    const mutation = isUpdate ? updateResultMutation : loadResultMutation;

    mutation.mutate(
      { seriesId: selectedSeries.id, data },
      {
        onSuccess: () => {
          toast.success(isUpdate ? "Resultado actualizado" : "Resultado cargado");
          setSelectedSeries(null);
        },
        onError: () => toast.error("Error al cargar el resultado"),
      }
    );
  };

  if (seriesLoading) {
    return <p className="text-muted-foreground">Cargando series...</p>;
  }

  const pendingSeries = series.filter(
    (s) =>
      s.status === TeamEventSeriesStatus.pending ||
      s.status === TeamEventSeriesStatus.inProgress
  );
  const completedSeries = series.filter(
    (s) =>
      s.status === TeamEventSeriesStatus.completed ||
      s.status === TeamEventSeriesStatus.walkover
  );

  return (
    <div className="space-y-6">
      {pendingSeries.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Pendientes de resultado</h3>
          <div className="grid gap-3 md:grid-cols-2">
            {pendingSeries.map((s) => (
              <SeriesCard
                key={s.id}
                series={s}
                onClick={() => openResultDialog(s)}
              />
            ))}
          </div>
        </div>
      )}

      {completedSeries.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Completadas</h3>
          <div className="grid gap-3 md:grid-cols-2">
            {completedSeries.map((s) => (
              <SeriesCard
                key={s.id}
                series={s}
                onClick={() => openResultDialog(s)}
              />
            ))}
          </div>
        </div>
      )}

      {series.length === 0 && (
        <p className="text-muted-foreground text-center py-8">
          Primero generá el fixture en la pestaña correspondiente.
        </p>
      )}

      <Dialog
        open={!!selectedSeries}
        onOpenChange={(open) => {
          if (!open) setSelectedSeries(null);
        }}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedSeries
                ? `${selectedSeries.homeTeam?.name ?? "Local"} vs ${selectedSeries.awayTeam?.name ?? "Visitante"}`
                : "Cargar resultado"}
            </DialogTitle>
          </DialogHeader>

          {selectedSeries && (
            <div className="space-y-6">
              {matchForms.map((form, idx) => {
                const isDoubles = form.matchType === TeamEventMatchType.doubles;
                const homePlayers = getActivePlayers(selectedSeries.homeTeamId);
                const awayPlayers = getActivePlayers(selectedSeries.awayTeamId);

                return (
                  <Card key={idx}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">
                        {matchTypeLabels[form.matchType]}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs">Local</Label>
                          <Select
                            value={form.homePlayer1Id}
                            onValueChange={(v) =>
                              updateMatchForm(idx, "homePlayer1Id", v)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Jugador 1" />
                            </SelectTrigger>
                            <SelectContent>
                              {homePlayers.map((p) => (
                                <SelectItem key={p.playerId} value={String(p.playerId)}>
                                  {p.player.name} {p.player.lastname}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {isDoubles && (
                            <Select
                              value={form.homePlayer2Id}
                              onValueChange={(v) =>
                                updateMatchForm(idx, "homePlayer2Id", v)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Jugador 2" />
                              </SelectTrigger>
                              <SelectContent>
                                {homePlayers.map((p) => (
                                  <SelectItem
                                    key={p.playerId}
                                    value={String(p.playerId)}
                                  >
                                    {p.player.name} {p.player.lastname}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label className="text-xs">Visitante</Label>
                          <Select
                            value={form.awayPlayer1Id}
                            onValueChange={(v) =>
                              updateMatchForm(idx, "awayPlayer1Id", v)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Jugador 1" />
                            </SelectTrigger>
                            <SelectContent>
                              {awayPlayers.map((p) => (
                                <SelectItem key={p.playerId} value={String(p.playerId)}>
                                  {p.player.name} {p.player.lastname}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {isDoubles && (
                            <Select
                              value={form.awayPlayer2Id}
                              onValueChange={(v) =>
                                updateMatchForm(idx, "awayPlayer2Id", v)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Jugador 2" />
                              </SelectTrigger>
                              <SelectContent>
                                {awayPlayers.map((p) => (
                                  <SelectItem
                                    key={p.playerId}
                                    value={String(p.playerId)}
                                  >
                                    {p.player.name} {p.player.lastname}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label className="text-xs">Games local</Label>
                          <Input
                            type="number"
                            min={0}
                            max={gamesPerMatch}
                            value={form.homeGames}
                            onChange={(e) =>
                              updateMatchForm(idx, "homeGames", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Games visitante</Label>
                          <Input
                            type="number"
                            min={0}
                            max={gamesPerMatch}
                            value={form.awayGames}
                            onChange={(e) =>
                              updateMatchForm(idx, "awayGames", e.target.value)
                            }
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`tiebreak-${idx}`}
                          checked={form.hasTiebreak}
                          onChange={(e) =>
                            updateMatchForm(idx, "hasTiebreak", e.target.checked)
                          }
                          className="h-4 w-4"
                        />
                        <Label htmlFor={`tiebreak-${idx}`} className="text-xs">
                          Supertiebreak
                        </Label>
                      </div>

                      {form.hasTiebreak && (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <Label className="text-xs">TB local</Label>
                            <Input
                              type="number"
                              min={0}
                              value={form.homeTiebreakScore}
                              onChange={(e) =>
                                updateMatchForm(
                                  idx,
                                  "homeTiebreakScore",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">TB visitante</Label>
                            <Input
                              type="number"
                              min={0}
                              value={form.awayTiebreakScore}
                              onChange={(e) =>
                                updateMatchForm(
                                  idx,
                                  "awayTiebreakScore",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}

              <Button
                className="w-full"
                onClick={handleSubmit}
                disabled={
                  loadResultMutation.isPending ||
                  updateResultMutation.isPending ||
                  !isFormValid()
                }
              >
                {loadResultMutation.isPending || updateResultMutation.isPending
                  ? "Guardando..."
                  : selectedSeries.status === TeamEventSeriesStatus.completed
                    ? "Actualizar resultado"
                    : "Cargar resultado"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
