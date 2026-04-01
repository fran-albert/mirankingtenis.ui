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
import { Camera, CheckCircle2, Lock } from "lucide-react";
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
  TeamEventMatchScoreFormat,
  TeamEventMatchStatus,
  TeamEventMatchType,
  TeamEventSeriesStatus,
} from "@/common/enum/team-event.enum";
import { useTeamEventSeries } from "@/hooks/Team-Event/useTeamEventSeries";
import { useTeamEventTeams } from "@/hooks/Team-Event/useTeamEventTeams";
import { useSeriesMutations } from "@/hooks/Team-Event/useTeamEventMutations";
import { getSeries } from "@/api/Team-Event/series";
import { SeriesCard } from "../SeriesCard";
import { StoryPreviewDialog } from "./StoryPreviewDialog";
import { buildScoreRequest, formatMatchScore, isSetsDoublesMatch } from "../score-format";

interface ResultsTabProps {
  eventId: number;
  categoryId: number;
  singlesPerSeries: number;
  doublesPerSeries: number;
  gamesPerMatch: number;
  eventName: string;
  eventDescription?: string | null;
  categoryName?: string;
}

interface LineupForm {
  matchType: TeamEventMatchType;
  homePlayer1Id: string;
  homePlayer2Id: string;
  awayPlayer1Id: string;
  awayPlayer2Id: string;
}

interface ScoreFields {
  homeGames: string;
  awayGames: string;
  hasTiebreak: boolean;
  homeTiebreakScore: string;
  awayTiebreakScore: string;
  homeSet1Games: string;
  awaySet1Games: string;
  homeSet2Games: string;
  awaySet2Games: string;
  homeSuperTiebreakScore: string;
  awaySuperTiebreakScore: string;
}

interface MatchForm extends ScoreFields {
  matchType: TeamEventMatchType;
  scoreFormat: TeamEventMatchScoreFormat;
  homePlayer1Id: string;
  homePlayer2Id: string;
  awayPlayer1Id: string;
  awayPlayer2Id: string;
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

function emptyScoreFields(): ScoreFields {
  return {
    homeGames: "",
    awayGames: "",
    hasTiebreak: false,
    homeTiebreakScore: "",
    awayTiebreakScore: "",
    homeSet1Games: "",
    awaySet1Games: "",
    homeSet2Games: "",
    awaySet2Games: "",
    homeSuperTiebreakScore: "",
    awaySuperTiebreakScore: "",
  };
}

function emptyMatchForm(matchType: TeamEventMatchType): MatchForm {
  return {
    matchType,
    scoreFormat:
      matchType === TeamEventMatchType.doubles
        ? TeamEventMatchScoreFormat.setsSuperTiebreak
        : TeamEventMatchScoreFormat.legacyGames,
    homePlayer1Id: "",
    homePlayer2Id: "",
    awayPlayer1Id: "",
    awayPlayer2Id: "",
    ...emptyScoreFields(),
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

function buildMatchFormFromMatch(match: TeamEventMatch): MatchForm {
  return {
    matchType: match.matchType,
    scoreFormat: match.scoreFormat,
    homePlayer1Id: String(match.homePlayer1Id),
    homePlayer2Id: match.homePlayer2Id ? String(match.homePlayer2Id) : "",
    awayPlayer1Id: String(match.awayPlayer1Id),
    awayPlayer2Id: match.awayPlayer2Id ? String(match.awayPlayer2Id) : "",
    homeGames: String(match.homeGames),
    awayGames: String(match.awayGames),
    hasTiebreak: match.hasTiebreak,
    homeTiebreakScore: match.homeTiebreakScore ? String(match.homeTiebreakScore) : "",
    awayTiebreakScore: match.awayTiebreakScore ? String(match.awayTiebreakScore) : "",
    homeSet1Games: match.homeSet1Games != null ? String(match.homeSet1Games) : "",
    awaySet1Games: match.awaySet1Games != null ? String(match.awaySet1Games) : "",
    homeSet2Games: match.homeSet2Games != null ? String(match.homeSet2Games) : "",
    awaySet2Games: match.awaySet2Games != null ? String(match.awaySet2Games) : "",
    homeSuperTiebreakScore:
      match.homeSuperTiebreakScore != null ? String(match.homeSuperTiebreakScore) : "",
    awaySuperTiebreakScore:
      match.awaySuperTiebreakScore != null ? String(match.awaySuperTiebreakScore) : "",
  };
}

function getSetWinner(home: string, away: string): "home" | "away" | null {
  const homeValue = Number(home);
  const awayValue = Number(away);
  if (Number.isNaN(homeValue) || Number.isNaN(awayValue) || home === "" || away === "") {
    return null;
  }
  if (homeValue === awayValue) return null;
  return homeValue > awayValue ? "home" : "away";
}

function needsSuperTiebreak(fields: Pick<
  ScoreFields,
  "homeSet1Games" | "awaySet1Games" | "homeSet2Games" | "awaySet2Games"
>): boolean {
  const set1 = getSetWinner(fields.homeSet1Games, fields.awaySet1Games);
  const set2 = getSetWinner(fields.homeSet2Games, fields.awaySet2Games);
  return !!set1 && !!set2 && set1 !== set2;
}

function isLegacyReadonlyMatch(match: {
  matchType: TeamEventMatchType;
  scoreFormat: TeamEventMatchScoreFormat;
}): boolean {
  return (
    match.matchType === TeamEventMatchType.doubles &&
    match.scoreFormat === TeamEventMatchScoreFormat.legacyGames
  );
}

export function ResultsTab({
  eventId,
  categoryId,
  singlesPerSeries,
  doublesPerSeries,
  eventName,
  eventDescription,
  categoryName,
}: ResultsTabProps) {
  const { series, isLoading: seriesLoading } = useTeamEventSeries(eventId, categoryId);
  const { teams } = useTeamEventTeams(eventId, categoryId);
  const { updateResultMutation, setLineupMutation, loadMatchScoreMutation } =
    useSeriesMutations(eventId, categoryId);

  const [selectedSeries, setSelectedSeries] = useState<TeamEventSeries | null>(null);
  const [storyPreviewSeries, setStoryPreviewSeries] = useState<TeamEventSeries | null>(null);
  const [lineupForms, setLineupForms] = useState<LineupForm[]>([]);
  const [editingMatchId, setEditingMatchId] = useState<number | null>(null);
  const [scoreForm, setScoreForm] = useState<ScoreFields>(emptyScoreFields());
  const [matchForms, setMatchForms] = useState<MatchForm[]>([]);

  const matchTypes = buildMatchTypes(singlesPerSeries, doublesPerSeries);
  const dialogMode = selectedSeries ? getDialogMode(selectedSeries) : null;

  const openResultDialog = (seriesItem: TeamEventSeries) => {
    setSelectedSeries(seriesItem);
    const mode = getDialogMode(seriesItem);

    if (mode === "lineup") {
      setLineupForms(matchTypes.map((matchType) => emptyLineupForm(matchType)));
      return;
    }

    if (mode === "score") {
      setEditingMatchId(null);
      setScoreForm(emptyScoreFields());
      return;
    }

    if (seriesItem.matches.length > 0) {
      setMatchForms(seriesItem.matches.map(buildMatchFormFromMatch));
    } else {
      setMatchForms(matchTypes.map((matchType) => emptyMatchForm(matchType)));
    }
  };

  const getActivePlayers = (teamId: number | null): TeamEventPlayer[] => {
    if (teamId == null) return [];
    const team = teams.find((teamItem) => teamItem.id === teamId);
    if (!team) return [];
    return team.players.filter((player) => !player.leftAt);
  };

  const updateLineupForm = (index: number, field: keyof LineupForm, value: string) => {
    setLineupForms((current) => {
      const next = [...current];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const updateScoreField = (field: keyof ScoreFields, value: string | boolean) => {
    setScoreForm((current) => ({ ...current, [field]: value }));
  };

  const updateMatchForm = (
    index: number,
    field: keyof MatchForm,
    value: string | boolean
  ) => {
    setMatchForms((current) => {
      const next = [...current];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const isLineupValid = (): boolean =>
    lineupForms.every((form) => {
      const home1 = Number(form.homePlayer1Id);
      const away1 = Number(form.awayPlayer1Id);
      if (!home1 || !away1) return false;
      if (form.matchType === TeamEventMatchType.doubles) {
        const home2 = Number(form.homePlayer2Id);
        const away2 = Number(form.awayPlayer2Id);
        if (!home2 || !away2) return false;
      }
      return true;
    });

  const isScoreFieldsValid = (
    fields: ScoreFields,
    matchType: TeamEventMatchType,
    scoreFormat: TeamEventMatchScoreFormat
  ): boolean => {
    if (
      matchType === TeamEventMatchType.doubles &&
      scoreFormat === TeamEventMatchScoreFormat.setsSuperTiebreak
    ) {
      const requiredValues = [
        fields.homeSet1Games,
        fields.awaySet1Games,
        fields.homeSet2Games,
        fields.awaySet2Games,
      ];
      if (requiredValues.some((value) => value === "" || Number.isNaN(Number(value)))) {
        return false;
      }

      if (needsSuperTiebreak(fields)) {
        return (
          fields.homeSuperTiebreakScore !== "" &&
          fields.awaySuperTiebreakScore !== "" &&
          !Number.isNaN(Number(fields.homeSuperTiebreakScore)) &&
          !Number.isNaN(Number(fields.awaySuperTiebreakScore))
        );
      }

      return true;
    }

    if (
      fields.homeGames === "" ||
      fields.awayGames === "" ||
      Number.isNaN(Number(fields.homeGames)) ||
      Number.isNaN(Number(fields.awayGames))
    ) {
      return false;
    }

    if (fields.hasTiebreak) {
      return (
        fields.homeTiebreakScore !== "" &&
        fields.awayTiebreakScore !== "" &&
        !Number.isNaN(Number(fields.homeTiebreakScore)) &&
        !Number.isNaN(Number(fields.awayTiebreakScore))
      );
    }

    return true;
  };

  const buildMatchResultPayload = (form: MatchForm): MatchResultRequest => {
    const payload = buildScoreRequest(form.matchType, {
      ...form,
      hasSuperTiebreak: needsSuperTiebreak(form),
    });
    const { matchType: _payloadMatchType, ...scorePayload } = payload;

    return {
      matchType: form.matchType,
      homePlayer1Id: Number(form.homePlayer1Id),
      homePlayer2Id:
        form.matchType === TeamEventMatchType.doubles
          ? Number(form.homePlayer2Id)
          : undefined,
      awayPlayer1Id: Number(form.awayPlayer1Id),
      awayPlayer2Id:
        form.matchType === TeamEventMatchType.doubles
          ? Number(form.awayPlayer2Id)
          : undefined,
      ...scorePayload,
    };
  };

  const handleLineupSubmit = () => {
    if (!selectedSeries) return;
    if (!isLineupValid()) {
      toast.error("Seleccioná todos los jugadores");
      return;
    }

    const matches: SetLineupMatchRequest[] = lineupForms.map((form) => ({
      matchType: form.matchType,
      homePlayer1Id: Number(form.homePlayer1Id),
      homePlayer2Id:
        form.matchType === TeamEventMatchType.doubles
          ? Number(form.homePlayer2Id)
          : undefined,
      awayPlayer1Id: Number(form.awayPlayer1Id),
      awayPlayer2Id:
        form.matchType === TeamEventMatchType.doubles
          ? Number(form.awayPlayer2Id)
          : undefined,
    }));

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

  const startEditingScore = (match: TeamEventMatch) => {
    if (isLegacyReadonlyMatch(match)) return;

    setEditingMatchId(match.id);
    setScoreForm({
      homeGames: match.status === TeamEventMatchStatus.played ? String(match.homeGames) : "",
      awayGames: match.status === TeamEventMatchStatus.played ? String(match.awayGames) : "",
      hasTiebreak: match.hasTiebreak,
      homeTiebreakScore: match.homeTiebreakScore != null ? String(match.homeTiebreakScore) : "",
      awayTiebreakScore: match.awayTiebreakScore != null ? String(match.awayTiebreakScore) : "",
      homeSet1Games: match.homeSet1Games != null ? String(match.homeSet1Games) : "",
      awaySet1Games: match.awaySet1Games != null ? String(match.awaySet1Games) : "",
      homeSet2Games: match.homeSet2Games != null ? String(match.homeSet2Games) : "",
      awaySet2Games: match.awaySet2Games != null ? String(match.awaySet2Games) : "",
      homeSuperTiebreakScore:
        match.homeSuperTiebreakScore != null ? String(match.homeSuperTiebreakScore) : "",
      awaySuperTiebreakScore:
        match.awaySuperTiebreakScore != null ? String(match.awaySuperTiebreakScore) : "",
    });
  };

  const handleScoreSubmit = (match: TeamEventMatch) => {
    if (!selectedSeries) return;
    if (!isScoreFieldsValid(scoreForm, match.matchType, match.scoreFormat)) {
      toast.error("Completá el score correctamente");
      return;
    }

    const payload = buildScoreRequest(match.matchType, {
      ...scoreForm,
      hasSuperTiebreak: needsSuperTiebreak(scoreForm),
    });

    const { matchType: _unusedMatchType, ...data } = payload as LoadMatchScoreRequest & {
      matchType: TeamEventMatchType;
    };

    loadMatchScoreMutation.mutate(
      { seriesId: selectedSeries.id, matchId: match.id, data },
      {
        onSuccess: async () => {
          toast.success("Score guardado");
          setEditingMatchId(null);
          try {
            const updated = await getSeries(eventId, categoryId, selectedSeries.id);
            setSelectedSeries(updated);
            if (
              updated.status === TeamEventSeriesStatus.completed ||
              updated.status === TeamEventSeriesStatus.walkover
            ) {
              setMatchForms(updated.matches.map(buildMatchFormFromMatch));
            }
          } catch {
            setSelectedSeries(null);
          }
        },
        onError: () => toast.error("Error al guardar el score"),
      }
    );
  };

  const handleUpdateSubmit = () => {
    if (!selectedSeries) return;
    if (
      matchForms.some((form) => isLegacyReadonlyMatch(form)) ||
      !matchForms.every((form) =>
        isScoreFieldsValid(form, form.matchType, form.scoreFormat)
      )
    ) {
      toast.error("Hay partidos que no se pueden editar o tienen datos incompletos");
      return;
    }

    const matches = matchForms.map(buildMatchResultPayload);
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

  const renderPlayerSelect = (
    players: TeamEventPlayer[],
    value: string,
    onChange: (value: string) => void,
    placeholder: string
  ) => (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {players.map((player) => (
          <SelectItem key={player.id} value={String(player.id)}>
            {player.player.name} {player.player.lastname}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  const renderLegacyScoreInputs = (
    fields: ScoreFields,
    onUpdate: (field: keyof ScoreFields, value: string | boolean) => void,
    prefix: string
  ) => (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="text-xs">Games local</Label>
          <Input
            type="number"
            min={0}
            value={fields.homeGames}
            onChange={(e) => onUpdate("homeGames", e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Games visitante</Label>
          <Input
            type="number"
            min={0}
            value={fields.awayGames}
            onChange={(e) => onUpdate("awayGames", e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          id={`legacy-tb-${prefix}`}
          type="checkbox"
          checked={fields.hasTiebreak}
          onChange={(e) => onUpdate("hasTiebreak", e.target.checked)}
          className="h-4 w-4"
        />
        <Label htmlFor={`legacy-tb-${prefix}`} className="text-xs">
          Supertiebreak
        </Label>
      </div>

      {fields.hasTiebreak && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-xs">TB local</Label>
            <Input
              type="number"
              min={0}
              value={fields.homeTiebreakScore}
              onChange={(e) => onUpdate("homeTiebreakScore", e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">TB visitante</Label>
            <Input
              type="number"
              min={0}
              value={fields.awayTiebreakScore}
              onChange={(e) => onUpdate("awayTiebreakScore", e.target.value)}
            />
          </div>
        </div>
      )}
    </>
  );

  const renderSetsScoreInputs = (
    fields: ScoreFields,
    onUpdate: (field: keyof ScoreFields, value: string | boolean) => void
  ) => {
    const showSuper = needsSuperTiebreak(fields);

    return (
      <>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-xs">Set 1 local</Label>
            <Input
              type="number"
              min={0}
              value={fields.homeSet1Games}
              onChange={(e) => onUpdate("homeSet1Games", e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Set 1 visitante</Label>
            <Input
              type="number"
              min={0}
              value={fields.awaySet1Games}
              onChange={(e) => onUpdate("awaySet1Games", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-xs">Set 2 local</Label>
            <Input
              type="number"
              min={0}
              value={fields.homeSet2Games}
              onChange={(e) => onUpdate("homeSet2Games", e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Set 2 visitante</Label>
            <Input
              type="number"
              min={0}
              value={fields.awaySet2Games}
              onChange={(e) => onUpdate("awaySet2Games", e.target.value)}
            />
          </div>
        </div>

        {showSuper && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-xs">Super TB local</Label>
              <Input
                type="number"
                min={0}
                value={fields.homeSuperTiebreakScore}
                onChange={(e) => onUpdate("homeSuperTiebreakScore", e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Super TB visitante</Label>
              <Input
                type="number"
                min={0}
                value={fields.awaySuperTiebreakScore}
                onChange={(e) => onUpdate("awaySuperTiebreakScore", e.target.value)}
              />
            </div>
          </div>
        )}
      </>
    );
  };

  const renderScoreFields = (
    matchType: TeamEventMatchType,
    scoreFormat: TeamEventMatchScoreFormat,
    fields: ScoreFields,
    onUpdate: (field: keyof ScoreFields, value: string | boolean) => void,
    prefix: string
  ) => {
    if (
      matchType === TeamEventMatchType.doubles &&
      scoreFormat === TeamEventMatchScoreFormat.setsSuperTiebreak
    ) {
      return renderSetsScoreInputs(fields, onUpdate);
    }

    return renderLegacyScoreInputs(fields, onUpdate, prefix);
  };

  const renderLineupDialog = () => {
    if (!selectedSeries) return null;

    const homePlayers = getActivePlayers(selectedSeries.homeTeamId);
    const awayPlayers = getActivePlayers(selectedSeries.awayTeamId);

    return (
      <div className="space-y-6">
        {lineupForms.map((form, index) => {
          const isDoubles = form.matchType === TeamEventMatchType.doubles;

          return (
            <Card key={`${form.matchType}-${index}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{matchTypeLabels[form.matchType]}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">
                      {selectedSeries.homeTeam?.name ?? "Local"}
                    </Label>
                    {renderPlayerSelect(
                      homePlayers,
                      form.homePlayer1Id,
                      (value) => updateLineupForm(index, "homePlayer1Id", value),
                      "Jugador 1"
                    )}
                    {isDoubles &&
                      renderPlayerSelect(
                        homePlayers,
                        form.homePlayer2Id,
                        (value) => updateLineupForm(index, "homePlayer2Id", value),
                        "Jugador 2"
                      )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">
                      {selectedSeries.awayTeam?.name ?? "Visitante"}
                    </Label>
                    {renderPlayerSelect(
                      awayPlayers,
                      form.awayPlayer1Id,
                      (value) => updateLineupForm(index, "awayPlayer1Id", value),
                      "Jugador 1"
                    )}
                    {isDoubles &&
                      renderPlayerSelect(
                        awayPlayers,
                        form.awayPlayer2Id,
                        (value) => updateLineupForm(index, "awayPlayer2Id", value),
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
          const isEditing = editingMatchId === match.id;
          const isPlayed = match.status === TeamEventMatchStatus.played;
          const readOnly = isLegacyReadonlyMatch(match);
          const isDoubles = match.matchType === TeamEventMatchType.doubles;

          const homeP1 = getPlayerName(match.homePlayer1);
          const awayP1 = getPlayerName(match.awayPlayer1);
          const homeP2 = isDoubles && match.homePlayer2 ? getPlayerName(match.homePlayer2) : null;
          const awayP2 = isDoubles && match.awayPlayer2 ? getPlayerName(match.awayPlayer2) : null;

          return (
            <Card key={match.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">{matchTypeLabels[match.matchType]}</CardTitle>
                  {isPlayed && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground text-xs">Local</span>
                    <p className="font-medium">
                      {homeP2 ? `${homeP1} / ${homeP2}` : homeP1}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-xs">Visitante</span>
                    <p className="font-medium">
                      {awayP2 ? `${awayP1} / ${awayP2}` : awayP1}
                    </p>
                  </div>
                </div>

                {isPlayed && !isEditing && (
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold">{formatMatchScore(match)}</span>
                    {!readOnly && (
                      <Button variant="outline" size="sm" onClick={() => startEditingScore(match)}>
                        Editar
                      </Button>
                    )}
                  </div>
                )}

                {!isPlayed && !isEditing && !readOnly && (
                  <Button variant="outline" size="sm" onClick={() => startEditingScore(match)}>
                    Cargar score
                  </Button>
                )}

                {readOnly && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Lock className="h-3.5 w-3.5" />
                    Doble cargado con formato anterior. Solo lectura.
                  </div>
                )}

                {isEditing && (
                  <div className="space-y-3 border-t pt-3">
                    {renderScoreFields(
                      match.matchType,
                      match.scoreFormat,
                      scoreForm,
                      updateScoreField,
                      `score-${match.id}`
                    )}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleScoreSubmit(match)}
                        disabled={
                          loadMatchScoreMutation.isPending ||
                          !isScoreFieldsValid(scoreForm, match.matchType, match.scoreFormat)
                        }
                      >
                        {loadMatchScoreMutation.isPending ? "Guardando..." : "Guardar score"}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setEditingMatchId(null)}>
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

  const renderReadonlyCompletedDialog = () => {
    if (!selectedSeries) return null;

    return (
      <div className="space-y-4">
        {selectedSeries.matches.map((match) => {
          const isDoubles = match.matchType === TeamEventMatchType.doubles;
          const homeP1 = getPlayerName(match.homePlayer1);
          const awayP1 = getPlayerName(match.awayPlayer1);
          const homeP2 = isDoubles && match.homePlayer2 ? getPlayerName(match.homePlayer2) : null;
          const awayP2 = isDoubles && match.awayPlayer2 ? getPlayerName(match.awayPlayer2) : null;

          return (
            <Card key={match.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{matchTypeLabels[match.matchType]}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground text-xs">Local</span>
                    <p className="font-medium">{homeP2 ? `${homeP1} / ${homeP2}` : homeP1}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-xs">Visitante</span>
                    <p className="font-medium">{awayP2 ? `${awayP1} / ${awayP2}` : awayP1}</p>
                  </div>
                </div>
                <p className="text-sm font-semibold">{formatMatchScore(match)}</p>
              </CardContent>
            </Card>
          );
        })}

        <Button variant="outline" className="w-full" onClick={() => setStoryPreviewSeries(selectedSeries)}>
          <Camera className="h-4 w-4 mr-2" />
          Exportar Instagram Story
        </Button>
      </div>
    );
  };

  const renderEditableCompletedDialog = () => {
    if (!selectedSeries) return null;

    const homePlayers = getActivePlayers(selectedSeries.homeTeamId);
    const awayPlayers = getActivePlayers(selectedSeries.awayTeamId);

    return (
      <div className="space-y-6">
        {matchForms.map((form, index) => {
          const isDoubles = form.matchType === TeamEventMatchType.doubles;

          return (
            <Card key={`${form.matchType}-${index}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{matchTypeLabels[form.matchType]}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">
                      {selectedSeries.homeTeam?.name ?? "Local"}
                    </Label>
                    {renderPlayerSelect(
                      homePlayers,
                      form.homePlayer1Id,
                      (value) => updateMatchForm(index, "homePlayer1Id", value),
                      "Jugador 1"
                    )}
                    {isDoubles &&
                      renderPlayerSelect(
                        homePlayers,
                        form.homePlayer2Id,
                        (value) => updateMatchForm(index, "homePlayer2Id", value),
                        "Jugador 2"
                      )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">
                      {selectedSeries.awayTeam?.name ?? "Visitante"}
                    </Label>
                    {renderPlayerSelect(
                      awayPlayers,
                      form.awayPlayer1Id,
                      (value) => updateMatchForm(index, "awayPlayer1Id", value),
                      "Jugador 1"
                    )}
                    {isDoubles &&
                      renderPlayerSelect(
                        awayPlayers,
                        form.awayPlayer2Id,
                        (value) => updateMatchForm(index, "awayPlayer2Id", value),
                        "Jugador 2"
                      )}
                  </div>
                </div>

                {renderScoreFields(
                  form.matchType,
                  form.scoreFormat,
                  form,
                  (field, value) => updateMatchForm(index, field, value),
                  `view-${index}`
                )}
              </CardContent>
            </Card>
          );
        })}

        <Button variant="outline" className="w-full" onClick={() => setStoryPreviewSeries(selectedSeries)}>
          <Camera className="h-4 w-4 mr-2" />
          Exportar Instagram Story
        </Button>

        <Button
          className="w-full"
          onClick={handleUpdateSubmit}
          disabled={updateResultMutation.isPending}
        >
          {updateResultMutation.isPending ? "Guardando..." : "Actualizar resultado"}
        </Button>
      </div>
    );
  };

  const getDialogTitle = (): string => {
    if (!selectedSeries) return "Resultados";
    const home = selectedSeries.homeTeam?.name ?? "Local";
    const away = selectedSeries.awayTeam?.name ?? "Visitante";

    if (dialogMode === "lineup") return `Armar formación — ${home} vs ${away}`;
    if (dialogMode === "score") return `${home} vs ${away} — En curso`;
    return `${home} vs ${away} — Completada`;
  };

  if (seriesLoading) {
    return <p className="text-muted-foreground">Cargando series...</p>;
  }

  const playableSeries = series.filter(
    (seriesItem) =>
      seriesItem.homeTeamId != null && seriesItem.awayTeamId != null
  );
  const pendingSeries = playableSeries.filter(
    (seriesItem) =>
      seriesItem.status === TeamEventSeriesStatus.pending ||
      seriesItem.status === TeamEventSeriesStatus.inProgress
  );
  const completedSeries = playableSeries.filter(
    (seriesItem) =>
      seriesItem.status === TeamEventSeriesStatus.completed ||
      seriesItem.status === TeamEventSeriesStatus.walkover
  );
  const isReadonlyCompletedSeries =
    !!selectedSeries &&
    selectedSeries.matches.some((match) => isLegacyReadonlyMatch(match));

  return (
    <div className="space-y-6">
      {pendingSeries.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Pendientes de resultado</h3>
          <div className="grid gap-3 md:grid-cols-2">
            {pendingSeries.map((seriesItem) => (
              <SeriesCard
                key={seriesItem.id}
                series={seriesItem}
                onClick={() => openResultDialog(seriesItem)}
              />
            ))}
          </div>
        </div>
      )}

      {completedSeries.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Completadas</h3>
          <div className="grid gap-3 md:grid-cols-2">
            {completedSeries.map((seriesItem) => (
              <SeriesCard
                key={seriesItem.id}
                series={seriesItem}
                onClick={() => openResultDialog(seriesItem)}
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

      {series.length > 0 &&
        pendingSeries.length === 0 &&
        completedSeries.length === 0 && (
          <p className="text-muted-foreground text-center py-8">
            Aún no hay cruces con ambos equipos definidos para cargar resultados.
          </p>
        )}

      <Dialog open={!!selectedSeries} onOpenChange={(open) => !open && setSelectedSeries(null)}>
        <DialogContent className="w-full max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{getDialogTitle()}</DialogTitle>
          </DialogHeader>

          {selectedSeries && dialogMode === "lineup" && renderLineupDialog()}
          {selectedSeries && dialogMode === "score" && renderScoreDialog()}
          {selectedSeries &&
            dialogMode === "view" &&
            (isReadonlyCompletedSeries
              ? renderReadonlyCompletedDialog()
              : renderEditableCompletedDialog())}
        </DialogContent>
      </Dialog>

      <StoryPreviewDialog
        series={storyPreviewSeries}
        eventName={eventName}
        eventDescription={eventDescription}
        categoryName={categoryName}
        onClose={() => setStoryPreviewSeries(null)}
      />
    </div>
  );
}
