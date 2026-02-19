"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import { TeamEventSeries, TeamEventMatch, TeamEventPlayer } from "@/types/Team-Event/TeamEvent";
import {
  TeamEventSeriesStatus,
  TeamEventSeriesPhase,
  TeamEventMatchStatus,
  TeamEventMatchType,
  TeamEventMatchSide,
} from "@/common/enum/team-event.enum";

interface SeriesCardProps {
  series: TeamEventSeries;
  onClick?: () => void;
}

const statusLabels: Record<TeamEventSeriesStatus, string> = {
  [TeamEventSeriesStatus.pending]: "Pendiente",
  [TeamEventSeriesStatus.inProgress]: "En curso",
  [TeamEventSeriesStatus.completed]: "Completada",
  [TeamEventSeriesStatus.walkover]: "Walkover",
};

const statusColors: Record<TeamEventSeriesStatus, string> = {
  [TeamEventSeriesStatus.pending]: "bg-yellow-100 text-yellow-800",
  [TeamEventSeriesStatus.inProgress]: "bg-blue-100 text-blue-800",
  [TeamEventSeriesStatus.completed]: "bg-green-100 text-green-800",
  [TeamEventSeriesStatus.walkover]: "bg-gray-100 text-gray-800",
};

const matchTypeShort: Record<TeamEventMatchType, string> = {
  [TeamEventMatchType.singles1]: "S1",
  [TeamEventMatchType.singles2]: "S2",
  [TeamEventMatchType.doubles]: "D",
};

function getShortName(player: TeamEventPlayer): string {
  return `${player.player.lastname}`;
}

function renderMatchLine(match: TeamEventMatch) {
  const isDoubles = match.matchType === TeamEventMatchType.doubles;
  const isPlayed = match.status === TeamEventMatchStatus.played;
  const homeWon = match.winningSide === TeamEventMatchSide.home;
  const awayWon = match.winningSide === TeamEventMatchSide.away;

  const home1 = getShortName(match.homePlayer1);
  const away1 = getShortName(match.awayPlayer1);
  const home2 = isDoubles && match.homePlayer2 ? getShortName(match.homePlayer2) : null;
  const away2 = isDoubles && match.awayPlayer2 ? getShortName(match.awayPlayer2) : null;

  const homeName = home2 ? `${home1}/${home2}` : home1;
  const awayName = away2 ? `${away1}/${away2}` : away1;

  return (
    <div key={match.id} className="flex items-center justify-between text-xs gap-2">
      <span className="font-medium text-muted-foreground w-6">
        {matchTypeShort[match.matchType]}
      </span>
      {isPlayed ? (
        <span className="flex-1 truncate">
          <span className={homeWon ? "font-semibold text-green-600" : ""}>{homeName}</span>
          {" vs "}
          <span className={awayWon ? "font-semibold text-green-600" : ""}>{awayName}</span>
        </span>
      ) : (
        <span className="flex-1 truncate">
          {homeName} vs {awayName}
        </span>
      )}
      {isPlayed ? (
        <span className="flex items-center gap-1 font-medium whitespace-nowrap">
          <span className={homeWon ? "text-green-600" : "text-muted-foreground"}>{match.homeGames}</span>
          <span className="text-muted-foreground">-</span>
          <span className={awayWon ? "text-green-600" : "text-muted-foreground"}>{match.awayGames}</span>
          {match.hasTiebreak && (
            <span className="text-muted-foreground text-[10px]">
              ({match.homeTiebreakScore}-{match.awayTiebreakScore})
            </span>
          )}
          <CheckCircle2 className="h-3 w-3 text-green-600" />
        </span>
      ) : (
        <span className="text-muted-foreground whitespace-nowrap">pendiente</span>
      )}
    </div>
  );
}

export function SeriesCard({ series, onClick }: SeriesCardProps) {
  const isCompleted =
    series.status === TeamEventSeriesStatus.completed ||
    series.status === TeamEventSeriesStatus.walkover;

  const hasMatches = series.matches && series.matches.length > 0;

  return (
    <Card
      className={`cursor-pointer hover:shadow-md transition-shadow ${
        onClick ? "hover:border-primary" : ""
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex gap-2">
            {series.phase === TeamEventSeriesPhase.final && (
              <Badge variant="destructive">FINAL</Badge>
            )}
            <Badge className={statusColors[series.status]}>
              {statusLabels[series.status]}
            </Badge>
          </div>
          {series.phase === TeamEventSeriesPhase.regular && (
            <span className="text-xs text-muted-foreground">
              Jornada {series.matchday}
              {series.roundNumber > 1 ? " (Vuelta)" : " (Ida)"}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 text-right">
            <p
              className={`font-semibold ${
                series.winnerId === series.homeTeamId
                  ? "text-green-600"
                  : ""
              }`}
            >
              {series.homeTeam?.name ?? "TBD"}
            </p>
          </div>

          <div className="flex items-center gap-2 min-w-[80px] justify-center">
            {isCompleted || (hasMatches && series.status === TeamEventSeriesStatus.inProgress) ? (
              <span className="text-xl font-bold">
                {series.homeMatchesWon} - {series.awayMatchesWon}
              </span>
            ) : (
              <span className="text-sm text-muted-foreground">vs</span>
            )}
          </div>

          <div className="flex-1 text-left">
            <p
              className={`font-semibold ${
                series.winnerId === series.awayTeamId
                  ? "text-green-600"
                  : ""
              }`}
            >
              {series.awayTeam?.name ?? "TBD"}
            </p>
          </div>
        </div>

        {hasMatches && (
          <div className="mt-3 pt-3 border-t space-y-1">
            {series.matches.map((match) => renderMatchLine(match))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
