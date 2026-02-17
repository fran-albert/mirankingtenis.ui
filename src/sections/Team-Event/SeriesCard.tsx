"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TeamEventSeries } from "@/types/Team-Event/TeamEvent";
import {
  TeamEventSeriesStatus,
  TeamEventSeriesPhase,
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

export function SeriesCard({ series, onClick }: SeriesCardProps) {
  const isCompleted =
    series.status === TeamEventSeriesStatus.completed ||
    series.status === TeamEventSeriesStatus.walkover;

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
            {isCompleted ? (
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
      </CardContent>
    </Card>
  );
}
