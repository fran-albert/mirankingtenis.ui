"use client";
import React from "react";
import { DoublesMatch } from "@/types/Doubles-Event/DoublesEvent";
import { DoublesMatchStatus } from "@/common/enum/doubles-event.enum";

interface PlayoffMatchCardProps {
  match: DoublesMatch;
}

export function PlayoffMatchCard({ match }: PlayoffMatchCardProps) {
  const formatScore = () => {
    if (!match.sets || match.sets.length === 0) return "";
    return match.sets
      .sort((a, b) => a.setNumber - b.setNumber)
      .map((s) => `${s.team1Score}-${s.team2Score}`)
      .join("  ");
  };

  const isPlayed = match.status === DoublesMatchStatus.played;

  return (
    <div className="border rounded-lg bg-white shadow-sm overflow-hidden min-w-[160px] sm:min-w-[220px]">
      <div
        className={`flex items-center justify-between p-1.5 sm:p-2 border-b ${
          isPlayed && match.winnerId === match.team1?.id
            ? "bg-green-50 font-bold"
            : ""
        }`}
      >
        <span className="text-xs sm:text-sm truncate flex-1">
          {match.team1?.teamName || "TBD"}
        </span>
      </div>
      <div
        className={`flex items-center justify-between p-1.5 sm:p-2 ${
          isPlayed && match.winnerId === match.team2?.id
            ? "bg-green-50 font-bold"
            : ""
        }`}
      >
        <span className="text-xs sm:text-sm truncate flex-1">
          {match.team2?.teamName || "TBD"}
        </span>
      </div>
      {isPlayed && (
        <div className="bg-gray-50 px-2 py-1 text-center">
          <span className="text-[10px] sm:text-xs font-mono font-bold">{formatScore()}</span>
        </div>
      )}
    </div>
  );
}
