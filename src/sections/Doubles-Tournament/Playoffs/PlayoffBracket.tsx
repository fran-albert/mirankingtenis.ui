"use client";
import React, { useMemo } from "react";
import { DoublesMatch } from "@/types/Doubles-Event/DoublesEvent";
import { DOUBLES_PLAYOFF_ROUNDS } from "@/common/constants/doubles-event.constants";
import { PlayoffMatchCard } from "./PlayoffMatchCard";

interface PlayoffBracketProps {
  matches: DoublesMatch[];
}

export function PlayoffBracket({ matches }: PlayoffBracketProps) {
  // Group matches by round, sorted by canonical round order
  const roundGroups = useMemo(() => {
    const map = new Map<string, DoublesMatch[]>();
    matches.forEach((m) => {
      const round = m.round || "Sin Ronda";
      if (!map.has(round)) map.set(round, []);
      map.get(round)!.push(m);
    });
    // Sort matches within each round by positionInBracket
    map.forEach((roundMatches) => {
      roundMatches.sort(
        (a, b) => (a.positionInBracket || 0) - (b.positionInBracket || 0)
      );
    });
    // Sort rounds by canonical order from constants
    const roundOrder = DOUBLES_PLAYOFF_ROUNDS.map((r) => r.value);
    return Array.from(map.entries()).sort((a, b) => {
      const idxA = roundOrder.indexOf(a[0]);
      const idxB = roundOrder.indexOf(b[0]);
      return (idxA === -1 ? 999 : idxA) - (idxB === -1 ? 999 : idxB);
    });
  }, [matches]);

  if (matches.length === 0) {
    return (
      <p className="text-gray-500 text-center py-8">
        No hay partidos de llaves
      </p>
    );
  }

  return (
    <div className="flex gap-4 sm:gap-8 overflow-x-auto py-4 -mx-2 px-2">
      {roundGroups.map(([round, roundMatches]) => (
        <div key={round} className="flex flex-col gap-3 sm:gap-4 min-w-[180px] sm:min-w-[240px]">
          <h4 className="text-xs sm:text-sm font-bold text-center text-gray-600 uppercase">
            {round}
          </h4>
          <div className="flex flex-col gap-3 sm:gap-4 justify-around flex-1">
            {roundMatches.map((match) => (
              <PlayoffMatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
