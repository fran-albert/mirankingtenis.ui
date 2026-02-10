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

interface PlayoffMatchCardProps {
  match: DoublesMatch;
}

export function PlayoffMatchCard({ match }: PlayoffMatchCardProps) {
  const sets = [...(match.sets || [])].sort((a, b) => a.setNumber - b.setNumber);
  const isPlayed = match.status === DoublesMatchStatus.played;
  const isTeam1Winner = isPlayed && match.winnerId === match.team1?.id;
  const isTeam2Winner = isPlayed && match.winnerId === match.team2?.id;

  return (
    <div className="border rounded-lg bg-white shadow-sm overflow-hidden min-w-[160px] sm:min-w-[220px]">
      <div
        className="grid gap-0"
        style={{ gridTemplateColumns: `1fr repeat(${sets.length || 0}, 2rem)` }}
      >
        {/* Team 1 row */}
        <div
          className={`px-2 py-1.5 text-xs sm:text-sm border-b flex items-center gap-1 ${
            isTeam1Winner ? "bg-green-50 font-bold" : ""
          }`}
        >
          <span><TeamName name={match.team1?.teamName || "TBD"} /></span>
          {isTeam1Winner && <Badge className="text-[9px] px-1 py-0 leading-tight shrink-0">G</Badge>}
        </div>
        {sets.map((s) => (
          <div
            key={`t1-${s.setNumber}`}
            className={`px-1 py-1.5 text-center text-xs sm:text-sm border-l border-b ${
              isTeam1Winner ? "bg-green-50" : ""
            } ${s.team1Score > s.team2Score ? "text-green-600 font-bold" : ""}`}
          >
            {s.team1Score}
          </div>
        ))}

        {/* Team 2 row */}
        <div
          className={`px-2 py-1.5 text-xs sm:text-sm flex items-center gap-1 ${
            isTeam2Winner ? "bg-green-50 font-bold" : ""
          }`}
        >
          {match.team2 ? (
            <>
              <span><TeamName name={match.team2.teamName} /></span>
              {isTeam2Winner && <Badge className="text-[9px] px-1 py-0 leading-tight shrink-0">G</Badge>}
            </>
          ) : (
            <span className="text-gray-400 italic">BYE</span>
          )}
        </div>
        {sets.map((s) => (
          <div
            key={`t2-${s.setNumber}`}
            className={`px-1 py-1.5 text-center text-xs sm:text-sm border-l ${
              isTeam2Winner ? "bg-green-50" : ""
            } ${s.team2Score > s.team1Score ? "text-green-600 font-bold" : ""}`}
          >
            {s.team2Score}
          </div>
        ))}
      </div>
    </div>
  );
}
