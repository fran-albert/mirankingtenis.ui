"use client";
import React from "react";
import { DoublesMatch } from "@/types/Doubles-Event/DoublesEvent";
import { DoublesMatchStatus } from "@/common/enum/doubles-event.enum";
import { Badge } from "@/components/ui/badge";

function TeamName({ name }: { name: string }) {
  const parts = name.split(" / ");
  if (parts.length <= 1) return <>{name}</>;
  return (
    <>
      {parts.map((p, i) => (
        <span key={i} className="block sm:inline">
          {i > 0 && <span className="hidden sm:inline"> / </span>}
          {p}
        </span>
      ))}
    </>
  );
}

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
                <div className={`px-2 sm:px-3 py-1.5 flex items-center gap-1 ${isTeam1Winner ? "font-bold" : ""}`}>
                  <span className="text-xs sm:text-sm"><TeamName name={match.team1?.teamName || ""} /></span>
                  {isTeam1Winner && <Badge className="text-[9px] px-1 py-0 leading-tight shrink-0">G</Badge>}
                </div>
                {sets.length > 0 ? (
                  sets.map((s) => (
                    <div key={`t1-${s.setNumber}`} className={`px-1 py-1.5 text-center border-l ${s.team1Score > s.team2Score ? "text-green-600 font-bold" : ""}`}>
                      {s.team1Score}
                    </div>
                  ))
                ) : (
                  <div className="px-1 py-1.5 text-center border-l text-gray-400">-</div>
                )}

                <div className={`px-2 sm:px-3 py-1.5 border-t flex items-center gap-1 ${isTeam2Winner ? "font-bold" : ""}`}>
                  <span className="text-xs sm:text-sm"><TeamName name={match.team2?.teamName || "BYE"} /></span>
                  {isTeam2Winner && <Badge className="text-[9px] px-1 py-0 leading-tight shrink-0">G</Badge>}
                </div>
                {sets.length > 0 ? (
                  sets.map((s) => (
                    <div key={`t2-${s.setNumber}`} className={`px-1 py-1.5 text-center border-l border-t ${s.team2Score > s.team1Score ? "text-green-600 font-bold" : ""}`}>
                      {s.team2Score}
                    </div>
                  ))
                ) : (
                  <div className="px-1 py-1.5 text-center border-l border-t text-gray-400">-</div>
                )}
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-between p-2 sm:p-3 gap-1 sm:gap-2">
                <span className="text-xs sm:text-sm flex-1 text-center sm:text-left"><TeamName name={match.team1?.teamName || ""} /></span>
                <Badge variant="secondary" className="text-[10px] sm:text-xs shrink-0">Pendiente</Badge>
                <span className="text-xs sm:text-sm flex-1 text-center sm:text-right"><TeamName name={match.team2?.teamName || "BYE"} /></span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
