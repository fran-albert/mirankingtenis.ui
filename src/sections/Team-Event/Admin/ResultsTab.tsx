"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { CheckCircle2, Camera } from "lucide-react";
import {
  TeamEventSeries,
  TeamEventMatch,
  TeamEventPlayer,
  MatchResultRequest,
  LoadSeriesResultRequest,
  SetLineupMatchRequest,
  SetLineupRequest,
  LoadMatchScoreRequest,
} from "@/types/Team-Event/TeamEvent";
import {
  TeamEventSeriesStatus,
  TeamEventMatchType,
  TeamEventMatchStatus,
} from "@/common/enum/team-event.enum";
import { useTeamEventSeries } from "@/hooks/Team-Event/useTeamEventSeries";
import { useTeamEventTeams } from "@/hooks/Team-Event/useTeamEventTeams";
import { useSeriesMutations } from "@/hooks/Team-Event/useTeamEventMutations";
import { getSeries } from "@/api/Team-Event/series";
import { SeriesCard } from "../SeriesCard";
import { StoryPreviewDialog } from "./StoryPreviewDialog";

interface ResultsTabProps {
  eventId: number;
  categoryId: number;
  singlesPerSeries: number;
  doublesPerSeries: number;
  gamesPerMatch: number;
}

interface LineupForm {
  matchType: TeamEventMatchType;
  homePlayer1Id: string;
  homePlayer2Id: string;
  awayPlayer1Id: string;
  awayPlayer2Id: string;
}

interface ScoreForm {
  homeGames: string;
  awayGames: string;
  hasTiebreak: boolean;
  homeTiebreakScore: string;
  awayTiebreakScore: string;
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

type DialogMode = "lineup" | "score" | "view";

const matchTypeLabels: Record<TeamEventMatchType, string> = {
  [TeamEventMatchType.singles1]: "Singles 1",
  [TeamEventMatchType.singles2]: "Singles 2",
  [TeamEventMatchType.doubles]: "Dobles",
};

function emptyLineupForm(matchType: TeamEventMatchType): LineupForm {
  return {
    matchType,
    homePlayer1Id: "",
    homePlayer2Id: "",
    awayPlayer1Id: "",
    awayPlayer2Id: "",
  };
}

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

function getDialogMode(series: TeamEventSeries): DialogMode {
  if (
    series.status === TeamEventSeriesStatus.completed ||
    series.status === TeamEventSeriesStatus.walkover
  ) {
    return "view";
  }
  if (
    series.status === TeamEventSeriesStatus.inProgress &&
    series.matches.length > 0
  ) {
    return "score";
  }
  return "lineup";
}

function getPlayerName(player: TeamEventPlayer): string {
  return `${player.player.name} ${player.player.lastname}`;
}

export function ResultsTab({
  eventId,
  categoryId,
  singlesPerSeries,
  doublesPerSeries,
  gamesPerMatch,
}: ResultsTabProps) {
  const { series, isLoading: seriesLoading } = useTeamEventSeries(eventId, categoryId);
  const { teams } = useTeamEventTeams(eventId, categoryId);
  const {
    loadResultMutation,
    updateResultMutation,
    setLineupMutation,
    loadMatchScoreMutation,
  } = useSeriesMutations(eventId, categoryId);

  const [selectedSeries, setSelectedSeries] = useState<TeamEventSeries | null>(null);
  const [storyPreviewSeries, setStoryPreviewSeries] = useState<TeamEventSeries | null>(null);
  const matchTypes = buildMatchTypes(singlesPerSeries, doublesPerSeries);

  // Lineup mode state
  const [lineupForms, setLineupForms] = useState<LineupForm[]>([]);

  // Score mode state
  const [editingMatchId, setEditingMatchId] = useState<number | null>(null);
  const [scoreForm, setScoreForm] = useState<ScoreForm>({
    homeGames: "",
    awayGames: "",
    hasTiebreak: false,
    homeTiebreakScore: "",
    awayTiebreakScore: "",
  });

  // View/update mode state (existing full form for "Actualizar resultado")
  const [matchForms, setMatchForms] = useState<MatchForm[]>([]);

  const dialogMode = selectedSeries ? getDialogMode(selectedSeries) : null;

  const openResultDialog = (s: TeamEventSeries) => {
    setSelectedSeries(s);
    const mode = getDialogMode(s);

    if (mode === "lineup") {
      setLineupForms(matchTypes.map((mt) => emptyLineupForm(mt)));
    } else if (mode === "score") {
      setEditingMatchId(null);
      setScoreForm({
        homeGames: "",
        awayGames: "",
        hasTiebreak: false,
        homeTiebreakScore: "",
        awayTiebreakScore: "",
      });
    } else {
      // view mode - prepare full forms for possible update
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
    }
  };

  const getActivePlayers = (teamId: number): TeamEventPlayer[] => {
    const team = teams.find((t) => t.id === teamId);
    if (!team) return [];
    return team.players.filter((p: TeamEventPlayer) => !p.leftAt);
  };

  // --- Lineup helpers ---

  const updateLineupForm = (index: number, field: keyof LineupForm, value: string) => {
    setLineupForms((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const isLineupValid = (): boolean => {
    return lineupForms.every((f) => {
      const isDoubles = f.matchType === TeamEventMatchType.doubles;
      const hp1 = parseInt(f.homePlayer1Id, 10);
      const ap1 = parseInt(f.awayPlayer1Id, 10);
      if (isNaN(hp1) || hp1 <= 0) return false;
      if (isNaN(ap1) || ap1 <= 0) return false;
      if (isDoubles) {
        const hp2 = parseInt(f.homePlayer2Id, 10);
        const ap2 = parseInt(f.awayPlayer2Id, 10);
        if (isNaN(hp2) || hp2 <= 0) return false;
        if (isNaN(ap2) || ap2 <= 0) return false;
      }
      return true;
    });
  };

  const handleLineupSubmit = () => {
    if (!selectedSeries) return;
    if (!isLineupValid()) {
      toast.error("Seleccioná todos los jugadores");
      return;
    }

    const matches: SetLineupMatchRequest[] = lineupForms.map((f) => {
      const isDoubles = f.matchType === TeamEventMatchType.doubles;
      return {
        matchType: f.matchType,
        homePlayer1Id: parseInt(f.homePlayer1Id, 10),
        homePlayer2Id: isDoubles ? parseInt(f.homePlayer2Id, 10) : undefined,
        awayPlayer1Id: parseInt(f.awayPlayer1Id, 10),
        awayPlayer2Id: isDoubles ? parseInt(f.awayPlayer2Id, 10) : undefined,
      };
    });

    const data: SetLineupRequest = { matches };

    setLineupMutation.mutate(
      { seriesId: selectedSeries.id, data },
      {
        onSuccess: () => {
          toast.success("Formación confirmada");
          setSelectedSeries(null);
        },
        onError: () => toast.error("Error al armar la formación"),
      }
    );
  };

  // --- Score helpers ---

  const startEditingScore = (match: TeamEventMatch) => {
    setEditingMatchId(match.id);
    setScoreForm({
      homeGames: match.status === TeamEventMatchStatus.played ? String(match.homeGames) : "",
      awayGames: match.status === TeamEventMatchStatus.played ? String(match.awayGames) : "",
      hasTiebreak: match.hasTiebreak,
      homeTiebreakScore: match.homeTiebreakScore ? String(match.homeTiebreakScore) : "",
      awayTiebreakScore: match.awayTiebreakScore ? String(match.awayTiebreakScore) : "",
    });
  };

  const isScoreValid = (): boolean => {
    const hg = parseInt(scoreForm.homeGames, 10);
    const ag = parseInt(scoreForm.awayGames, 10);
    if (isNaN(hg) || hg < 0) return false;
    if (isNaN(ag) || ag < 0) return false;
    if (scoreForm.hasTiebreak) {
      const htb = parseInt(scoreForm.homeTiebreakScore, 10);
      const atb = parseInt(scoreForm.awayTiebreakScore, 10);
      if (isNaN(htb) || htb < 0) return false;
      if (isNaN(atb) || atb < 0) return false;
    }
    return true;
  };

  const handleScoreSubmit = (matchId: number) => {
    if (!selectedSeries) return;
    if (!isScoreValid()) {
      toast.error("Completá el score correctamente");
      return;
    }

    const data: LoadMatchScoreRequest = {
      homeGames: parseInt(scoreForm.homeGames, 10),
      awayGames: parseInt(scoreForm.awayGames, 10),
      hasTiebreak: scoreForm.hasTiebreak || undefined,
      homeTiebreakScore: scoreForm.hasTiebreak
        ? parseInt(scoreForm.homeTiebreakScore, 10)
        : undefined,
      awayTiebreakScore: scoreForm.hasTiebreak
        ? parseInt(scoreForm.awayTiebreakScore, 10)
        : undefined,
    };

    loadMatchScoreMutation.mutate(
      { seriesId: selectedSeries.id, matchId, data },
      {
        onSuccess: async () => {
          toast.success("Score guardado");
          setEditingMatchId(null);
          try {
            const updated = await getSeries(eventId, categoryId, selectedSeries.id);
            setSelectedSeries(updated);
          } catch {
            // Si falla el refetch, cerramos el dialog
            setSelectedSeries(null);
          }
        },
        onError: () => toast.error("Error al guardar el score"),
      }
    );
  };

  // --- View/Update helpers (existing logic) ---

  const updateMatchForm = (index: number, field: keyof MatchForm, value: string | boolean) => {
    setMatchForms((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const isFullFormValid = (): boolean => {
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

  const handleUpdateSubmit = () => {
    if (!selectedSeries) return;
    if (!isFullFormValid()) {
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

    updateResultMutation.mutate(
      { seriesId: selectedSeries.id, data },
      {
        onSuccess: () => {
          toast.success("Resultado actualizado");
          setSelectedSeries(null);
        },
        onError: () => toast.error("Error al actualizar el resultado"),
      }
    );
  };

  // --- Render helpers ---

  const renderPlayerSelect = (
    players: TeamEventPlayer[],
    value: string,
    onChange: (v: string) => void,
    placeholder: string
  ) => (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {players.map((p) => (
          <SelectItem key={p.id} value={String(p.id)}>
            {p.player.name} {p.player.lastname}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  const renderScoreInputs = (
    form: ScoreForm,
    onUpdate: (field: keyof ScoreForm, value: string | boolean) => void,
    prefix: string
  ) => (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="text-xs">Games local</Label>
          <Input
            type="number"
            min={0}
            max={gamesPerMatch}
            value={form.homeGames}
            onChange={(e) => onUpdate("homeGames", e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Games visitante</Label>
          <Input
            type="number"
            min={0}
            max={gamesPerMatch}
            value={form.awayGames}
            onChange={(e) => onUpdate("awayGames", e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id={`tiebreak-${prefix}`}
          checked={form.hasTiebreak}
          onChange={(e) => onUpdate("hasTiebreak", e.target.checked)}
          className="h-4 w-4"
        />
        <Label htmlFor={`tiebreak-${prefix}`} className="text-xs">
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
              onChange={(e) => onUpdate("homeTiebreakScore", e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">TB visitante</Label>
            <Input
              type="number"
              min={0}
              value={form.awayTiebreakScore}
              onChange={(e) => onUpdate("awayTiebreakScore", e.target.value)}
            />
          </div>
        </div>
      )}
    </>
  );

  const renderLineupDialog = () => {
    if (!selectedSeries) return null;
    const homePlayers = getActivePlayers(selectedSeries.homeTeamId);
    const awayPlayers = getActivePlayers(selectedSeries.awayTeamId);

    return (
      <div className="space-y-6">
        {lineupForms.map((form, idx) => {
          const isDoubles = form.matchType === TeamEventMatchType.doubles;
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
                    {renderPlayerSelect(
                      homePlayers,
                      form.homePlayer1Id,
                      (v) => updateLineupForm(idx, "homePlayer1Id", v),
                      "Jugador 1"
                    )}
                    {isDoubles &&
                      renderPlayerSelect(
                        homePlayers,
                        form.homePlayer2Id,
                        (v) => updateLineupForm(idx, "homePlayer2Id", v),
                        "Jugador 2"
                      )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Visitante</Label>
                    {renderPlayerSelect(
                      awayPlayers,
                      form.awayPlayer1Id,
                      (v) => updateLineupForm(idx, "awayPlayer1Id", v),
                      "Jugador 1"
                    )}
                    {isDoubles &&
                      renderPlayerSelect(
                        awayPlayers,
                        form.awayPlayer2Id,
                        (v) => updateLineupForm(idx, "awayPlayer2Id", v),
                        "Jugador 2"
                      )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        <Button
          className="w-full"
          onClick={handleLineupSubmit}
          disabled={setLineupMutation.isPending || !isLineupValid()}
        >
          {setLineupMutation.isPending ? "Confirmando..." : "Confirmar formación"}
        </Button>
      </div>
    );
  };

  const renderScoreDialog = () => {
    if (!selectedSeries) return null;

    return (
      <div className="space-y-4">
        {selectedSeries.matches.map((match) => {
          const isPlayed = match.status === TeamEventMatchStatus.played;
          const isEditing = editingMatchId === match.id;
          const isDoubles = match.matchType === TeamEventMatchType.doubles;

          const homeP1 = getPlayerName(match.homePlayer1);
          const awayP1 = getPlayerName(match.awayPlayer1);
          const homeP2 = isDoubles && match.homePlayer2 ? getPlayerName(match.homePlayer2) : null;
          const awayP2 = isDoubles && match.awayPlayer2 ? getPlayerName(match.awayPlayer2) : null;

          const homeName = homeP2 ? `${homeP1} / ${homeP2}` : homeP1;
          const awayName = awayP2 ? `${awayP1} / ${awayP2}` : awayP1;

          return (
            <Card key={match.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">
                    {matchTypeLabels[match.matchType]}
                  </CardTitle>
                  {isPlayed && (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground text-xs">Local</span>
                    <p className="font-medium">{homeName}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-xs">Visitante</span>
                    <p className="font-medium">{awayName}</p>
                  </div>
                </div>

                {isPlayed && !isEditing && (
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold">
                      {match.homeGames} - {match.awayGames}
                      {match.hasTiebreak &&
                        ` (TB: ${match.homeTiebreakScore}-${match.awayTiebreakScore})`}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEditingScore(match)}
                    >
                      Editar
                    </Button>
                  </div>
                )}

                {!isPlayed && !isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEditingScore(match)}
                  >
                    Cargar score
                  </Button>
                )}

                {isEditing && (
                  <div className="space-y-3 border-t pt-3">
                    {renderScoreInputs(
                      scoreForm,
                      (field, value) => {
                        setScoreForm((prev) => ({ ...prev, [field]: value }));
                      },
                      `score-${match.id}`
                    )}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleScoreSubmit(match.id)}
                        disabled={loadMatchScoreMutation.isPending || !isScoreValid()}
                      >
                        {loadMatchScoreMutation.isPending ? "Guardando..." : "Guardar score"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingMatchId(null)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  const renderViewDialog = () => {
    if (!selectedSeries) return null;
    const homePlayers = getActivePlayers(selectedSeries.homeTeamId);
    const awayPlayers = getActivePlayers(selectedSeries.awayTeamId);

    return (
      <div className="space-y-6">
        {matchForms.map((form, idx) => {
          const isDoubles = form.matchType === TeamEventMatchType.doubles;
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
                    {renderPlayerSelect(
                      homePlayers,
                      form.homePlayer1Id,
                      (v) => updateMatchForm(idx, "homePlayer1Id", v),
                      "Jugador 1"
                    )}
                    {isDoubles &&
                      renderPlayerSelect(
                        homePlayers,
                        form.homePlayer2Id,
                        (v) => updateMatchForm(idx, "homePlayer2Id", v),
                        "Jugador 2"
                      )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Visitante</Label>
                    {renderPlayerSelect(
                      awayPlayers,
                      form.awayPlayer1Id,
                      (v) => updateMatchForm(idx, "awayPlayer1Id", v),
                      "Jugador 1"
                    )}
                    {isDoubles &&
                      renderPlayerSelect(
                        awayPlayers,
                        form.awayPlayer2Id,
                        (v) => updateMatchForm(idx, "awayPlayer2Id", v),
                        "Jugador 2"
                      )}
                  </div>
                </div>

                {renderScoreInputs(
                  {
                    homeGames: form.homeGames,
                    awayGames: form.awayGames,
                    hasTiebreak: form.hasTiebreak,
                    homeTiebreakScore: form.homeTiebreakScore,
                    awayTiebreakScore: form.awayTiebreakScore,
                  },
                  (field, value) => updateMatchForm(idx, field, value),
                  `view-${idx}`
                )}
              </CardContent>
            </Card>
          );
        })}

        <Button
          variant="outline"
          className="w-full"
          onClick={() => setStoryPreviewSeries(selectedSeries)}
        >
          <Camera className="h-4 w-4 mr-2" />
          Exportar Instagram Story
        </Button>

        <Button
          className="w-full"
          onClick={handleUpdateSubmit}
          disabled={updateResultMutation.isPending || !isFullFormValid()}
        >
          {updateResultMutation.isPending ? "Guardando..." : "Actualizar resultado"}
        </Button>
      </div>
    );
  };

  const getDialogTitle = (): string => {
    if (!selectedSeries) return "Cargar resultado";
    const home = selectedSeries.homeTeam?.name ?? "Local";
    const away = selectedSeries.awayTeam?.name ?? "Visitante";

    switch (dialogMode) {
      case "lineup":
        return `Armar formación — ${home} vs ${away}`;
      case "score":
        return `${home} vs ${away} — En curso`;
      case "view":
        return `${home} vs ${away} — Completada`;
      default:
        return "Cargar resultado";
    }
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
            <DialogTitle>{getDialogTitle()}</DialogTitle>
          </DialogHeader>

          {selectedSeries && dialogMode === "lineup" && renderLineupDialog()}
          {selectedSeries && dialogMode === "score" && renderScoreDialog()}
          {selectedSeries && dialogMode === "view" && renderViewDialog()}
        </DialogContent>
      </Dialog>

      <StoryPreviewDialog
        series={storyPreviewSeries}
        onClose={() => setStoryPreviewSeries(null)}
      />
    </div>
  );
}
