"use client";
import React from "react";
import {
  TeamEventSeries,
  TeamEventMatch,
  TeamEventPlayer,
} from "@/types/Team-Event/TeamEvent";
import {
  TeamEventSeriesStatus,
  TeamEventSeriesPhase,
  TeamEventMatchStatus,
  TeamEventMatchType,
  TeamEventMatchSide,
} from "@/common/enum/team-event.enum";
import { OptimizedAvatar } from "@/components/ui/optimized-avatar";
import { CheckCircle2 } from "lucide-react";

interface SeriesMatchCardProps {
  series: TeamEventSeries;
  onClick?: () => void;
}

const matchTypeShort: Record<TeamEventMatchType, string> = {
  [TeamEventMatchType.singles1]: "S1",
  [TeamEventMatchType.singles2]: "S2",
  [TeamEventMatchType.doubles]: "D",
};

const statusConfig: Record<
  TeamEventSeriesStatus,
  { label: string; border: string; badge: string }
> = {
  [TeamEventSeriesStatus.pending]: {
    label: "Pendiente",
    border: "border-l-white/10",
    badge: "bg-white/10 text-gray-400",
  },
  [TeamEventSeriesStatus.inProgress]: {
    label: "En curso",
    border: "border-l-blue-500",
    badge: "bg-blue-500/20 text-blue-400",
  },
  [TeamEventSeriesStatus.completed]: {
    label: "Completada",
    border: "border-l-emerald-500",
    badge: "bg-emerald-500/20 text-emerald-400",
  },
  [TeamEventSeriesStatus.walkover]: {
    label: "W.O.",
    border: "border-l-gray-500",
    badge: "bg-gray-500/20 text-gray-400",
  },
};

function getPlayerInitials(player: TeamEventPlayer): string {
  return `${player.player.name[0]}${player.player.lastname[0]}`.toUpperCase();
}

function PlayerAvatar({
  player,
  isWinner,
}: {
  player: TeamEventPlayer;
  isWinner: boolean;
}) {
  return (
    <OptimizedAvatar
      src={player.player.photo}
      alt={`${player.player.name} ${player.player.lastname}`}
      size="thumbnail"
      className={`h-10 w-10 ${isWinner ? "ring-2 ring-emerald-500" : "ring-1 ring-white/10"}`}
      fallbackText={getPlayerInitials(player)}
    />
  );
}

function MatchLine({ match }: { match: TeamEventMatch }) {
  const isDoubles = match.matchType === TeamEventMatchType.doubles;
  const isPlayed = match.status === TeamEventMatchStatus.played;
  const homeWon = match.winningSide === TeamEventMatchSide.home;
  const awayWon = match.winningSide === TeamEventMatchSide.away;

  return (
    <div className="flex items-center gap-2 py-2.5">
      {/* Match type badge */}
      <span className="text-[10px] font-bold text-gray-500 w-5 shrink-0 text-center self-center">
        {matchTypeShort[match.matchType]}
      </span>

      {/* Home players */}
      <div className="flex flex-col items-end gap-1 flex-1 min-w-0">
        <div className="flex -space-x-1.5">
          <PlayerAvatar player={match.homePlayer1} isWinner={homeWon} />
          {isDoubles && match.homePlayer2 && (
            <PlayerAvatar player={match.homePlayer2} isWinner={homeWon} />
          )}
        </div>
        <span
          className={`text-[11px] leading-tight truncate max-w-full ${homeWon ? "text-emerald-400 font-semibold" : "text-gray-300"}`}
        >
          {match.homePlayer1.player.lastname}
          {isDoubles && match.homePlayer2
            ? ` / ${match.homePlayer2.player.lastname}`
            : ""}
        </span>
      </div>

      {/* Score */}
      <div className="flex items-center gap-1 min-w-[50px] justify-center shrink-0 self-center">
        {isPlayed ? (
          <>
            <span
              className={`text-sm font-mono font-bold ${homeWon ? "text-emerald-400" : "text-gray-500"}`}
            >
              {match.homeGames}
            </span>
            <span className="text-[10px] text-gray-600">-</span>
            <span
              className={`text-sm font-mono font-bold ${awayWon ? "text-emerald-400" : "text-gray-500"}`}
            >
              {match.awayGames}
            </span>
            {match.hasTiebreak && (
              <span className="text-[9px] text-gray-500">
                ({match.homeTiebreakScore}-{match.awayTiebreakScore})
              </span>
            )}
          </>
        ) : (
          <span className="text-[10px] text-gray-600">vs</span>
        )}
      </div>

      {/* Away players */}
      <div className="flex flex-col items-start gap-1 flex-1 min-w-0">
        <div className="flex -space-x-1.5">
          <PlayerAvatar player={match.awayPlayer1} isWinner={awayWon} />
          {isDoubles && match.awayPlayer2 && (
            <PlayerAvatar player={match.awayPlayer2} isWinner={awayWon} />
          )}
        </div>
        <span
          className={`text-[11px] leading-tight truncate max-w-full ${awayWon ? "text-emerald-400 font-semibold" : "text-gray-300"}`}
        >
          {match.awayPlayer1.player.lastname}
          {isDoubles && match.awayPlayer2
            ? ` / ${match.awayPlayer2.player.lastname}`
            : ""}
        </span>
      </div>
    </div>
  );
}

export function SeriesMatchCard({ series, onClick }: SeriesMatchCardProps) {
  const status = statusConfig[series.status];
  const isCompleted =
    series.status === TeamEventSeriesStatus.completed ||
    series.status === TeamEventSeriesStatus.walkover;
  const isLive = series.status === TeamEventSeriesStatus.inProgress;
  const hasMatches = series.matches && series.matches.length > 0;
  const homeWinner = series.winnerId === series.homeTeamId;
  const awayWinner = series.winnerId === series.awayTeamId;

  return (
    <div
      onClick={onClick}
      className={`bg-white/[0.06] hover:bg-white/[0.10] transition-all rounded-xl border border-white/10 border-l-2 ${status.border} ${onClick ? "cursor-pointer" : ""} overflow-hidden`}
    >
      {/* Header: Team names + score + status */}
      <div className="flex items-center justify-between p-3 gap-2">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Home team */}
          <span
            className={`text-xs font-bold truncate ${homeWinner ? "text-emerald-400" : "text-gray-200"}`}
          >
            {series.homeTeam?.name ?? "TBD"}
          </span>

          {/* Score */}
          <div className="flex items-center gap-1.5 shrink-0">
            {isCompleted || (hasMatches && isLive) ? (
              <div className="flex items-center gap-1">
                <span
                  className={`text-sm font-mono font-bold ${homeWinner ? "text-emerald-400" : "text-white"}`}
                >
                  {series.homeMatchesWon}
                </span>
                <span className="text-xs text-gray-600">-</span>
                <span
                  className={`text-sm font-mono font-bold ${awayWinner ? "text-emerald-400" : "text-white"}`}
                >
                  {series.awayMatchesWon}
                </span>
              </div>
            ) : (
              <span className="text-[10px] text-gray-600 font-medium">vs</span>
            )}
          </div>

          {/* Away team */}
          <span
            className={`text-xs font-bold truncate ${awayWinner ? "text-emerald-400" : "text-gray-200"}`}
          >
            {series.awayTeam?.name ?? "TBD"}
          </span>
        </div>

        {/* Status badge */}
        <div className="flex items-center gap-1.5 shrink-0">
          {isLive && (
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          )}
          {isCompleted && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
          <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${status.badge}`}>
            {series.phase === TeamEventSeriesPhase.final ? "Final" : `J${series.matchday}`}
          </span>
        </div>
      </div>

      {/* Match details with player avatars */}
      {hasMatches && (
        <div className="border-t border-white/10 px-3 py-1 space-y-0">
          {series.matches.map((match) => (
            <MatchLine key={match.id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}
