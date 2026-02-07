"use client";
import React from "react";
import { DoublesMatch } from "@/types/Doubles-Event/DoublesEvent";
import { DoublesMatchStatus } from "@/common/enum/doubles-event.enum";
import { Badge } from "@/components/ui/badge";

interface ZoneMatchListProps {
  matches: DoublesMatch[];
}

export function ZoneMatchList({ matches }: ZoneMatchListProps) {
  const formatScore = (match: DoublesMatch) => {
    if (!match.sets || match.sets.length === 0) return "";
    return match.sets
      .sort((a, b) => a.setNumber - b.setNumber)
      .map((s) => `${s.team1Score}-${s.team2Score}`)
      .join("  ");
  };

  if (matches.length === 0) {
    return (
      <p className="text-gray-400 text-sm py-2">No hay partidos en esta zona</p>
    );
  }

  return (
    <div className="space-y-2">
      {matches.map((match) => (
        <div
          key={match.id}
          className="flex items-center justify-between border rounded-lg p-2 sm:p-3 bg-white gap-1 sm:gap-2"
        >
          <div className="flex-1 min-w-0">
            <span
              className={`text-xs sm:text-sm truncate block ${
                match.winnerId === match.team1?.id ? "font-bold" : ""
              }`}
            >
              {match.team1?.teamName}
            </span>
          </div>
          <div className="px-1 sm:px-4 text-center shrink-0">
            {match.status === DoublesMatchStatus.played ? (
              <span className="font-mono font-bold text-xs sm:text-sm">{formatScore(match)}</span>
            ) : (
              <Badge variant="secondary" className="text-[10px] sm:text-xs">Pendiente</Badge>
            )}
          </div>
          <div className="flex-1 min-w-0 text-right">
            <span
              className={`text-xs sm:text-sm truncate block ${
                match.winnerId === match.team2?.id ? "font-bold" : ""
              }`}
            >
              {match.team2?.teamName || "BYE"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
