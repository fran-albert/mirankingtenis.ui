"use client";
import React from "react";
import { ZoneStanding, DoublesMatch } from "@/types/Doubles-Event/DoublesEvent";
import { DoublesMatchPhase } from "@/common/enum/doubles-event.enum";
import { ZoneStandingsTable } from "./ZoneStandingsTable";
import { ZoneMatchList } from "./ZoneMatchList";

interface ZoneViewProps {
  standings: ZoneStanding[];
  matches: DoublesMatch[];
}

export function ZoneView({ standings, matches }: ZoneViewProps) {
  const zoneMatches = matches.filter((m) => m.phase === DoublesMatchPhase.zone);

  if (standings.length === 0) {
    return (
      <p className="text-gray-500 text-center py-8">
        No hay zonas configuradas
      </p>
    );
  }

  return (
    <div className="space-y-8">
      {standings.map((zone) => {
        const zMatches = zoneMatches.filter((m) => m.zoneName === zone.zoneName);
        return (
          <div key={zone.zoneName}>
            <h3 className="text-lg font-bold mb-3">{zone.zoneName}</h3>
            <ZoneStandingsTable standings={zone.standings} />
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-gray-600 mb-2">
                Partidos
              </h4>
              <ZoneMatchList matches={zMatches} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
