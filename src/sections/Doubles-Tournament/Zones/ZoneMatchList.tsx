"use client";
import React from "react";
import { DoublesMatch } from "@/types/Doubles-Event/DoublesEvent";
import { DoublesMatchStatus } from "@/common/enum/doubles-event.enum";
import { Badge } from "@/components/ui/badge";

interface ZoneMatchListProps {
  matches: DoublesMatch[];
}

export function ZoneMatchList({ matches }: ZoneMatchListProps) {
  if (matches.length === 0) {
    return (
      <p className="text-gray-400 text-sm py-2">No hay partidos en esta zona</p>
    );
  }

  return (
    <div className="space-y-2">
      {matches.map((match) => {
        const sets = [...(match.sets || [])].sort((a, b) => a.setNumber - b.setNumber);
        const isPlayed = match.status === DoublesMatchStatus.played;
        const isTeam1Winner = match.winnerId === match.team1?.id;
        const isTeam2Winner = match.winnerId === match.team2?.id;

        return (
          <div
            key={match.id}
            className="border rounded-lg bg-white overflow-hidden"
          >
            {isPlayed ? (
              <div
                className="inline-grid w-full gap-0 text-xs sm:text-sm"
                style={{ gridTemplateColumns: `1fr repeat(${sets.length || 1}, 2.5rem)` }}
              >
                <div className={`px-2 sm:px-3 py-1.5 truncate ${isTeam1Winner ? "font-bold" : ""}`}>
                  {match.team1?.teamName}
                </div>
                {sets.length > 0 ? (
                  sets.map((s) => (
                    <div key={`t1-${s.setNumber}`} className={`px-1 py-1.5 text-center border-l ${isTeam1Winner ? "font-bold" : ""}`}>
                      {s.team1Score}
                    </div>
                  ))
                ) : (
                  <div className="px-1 py-1.5 text-center border-l text-gray-400">-</div>
                )}

                <div className={`px-2 sm:px-3 py-1.5 truncate border-t ${isTeam2Winner ? "font-bold" : ""}`}>
                  {match.team2?.teamName || "BYE"}
                </div>
                {sets.length > 0 ? (
                  sets.map((s) => (
                    <div key={`t2-${s.setNumber}`} className={`px-1 py-1.5 text-center border-l border-t ${isTeam2Winner ? "font-bold" : ""}`}>
                      {s.team2Score}
                    </div>
                  ))
                ) : (
                  <div className="px-1 py-1.5 text-center border-l border-t text-gray-400">-</div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-between p-2 sm:p-3 gap-2">
                <span className="text-xs sm:text-sm truncate flex-1">{match.team1?.teamName}</span>
                <Badge variant="secondary" className="text-[10px] sm:text-xs shrink-0">Pendiente</Badge>
                <span className="text-xs sm:text-sm truncate flex-1 text-right">{match.team2?.teamName || "BYE"}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
