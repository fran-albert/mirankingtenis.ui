"use client";
import React from "react";
import { TeamStanding } from "@/types/Doubles-Event/DoublesEvent";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ZoneStandingsTableProps {
  standings: TeamStanding[];
}

export function ZoneStandingsTable({ standings }: ZoneStandingsTableProps) {
  const formatDiff = (won: number, lost: number) => {
    const diff = won - lost;
    return diff > 0 ? `+${diff}` : `${diff}`;
  };

  return (
    <div className="overflow-x-auto -mx-2 px-2">
      <Table className="min-w-[600px]">
        <TableHeader>
          <TableRow>
            <TableHead className="w-8 px-2">Pos</TableHead>
            <TableHead className="px-2">Equipo</TableHead>
            <TableHead className="text-center px-1">PJ</TableHead>
            <TableHead className="text-center px-1">PG</TableHead>
            <TableHead className="text-center px-1">PP</TableHead>
            <TableHead className="text-center px-1">Sets</TableHead>
            <TableHead className="text-center px-1">Dif. Sets</TableHead>
            <TableHead className="text-center px-1">Games</TableHead>
            <TableHead className="text-center px-1">Dif. Games</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {standings.map((s) => (
            <TableRow key={s.team.id}>
              <TableCell className="font-bold px-2">{s.position}</TableCell>
              <TableCell className="font-medium px-2 text-sm whitespace-nowrap">{s.team.teamName}</TableCell>
              <TableCell className="text-center px-1">{s.played}</TableCell>
              <TableCell className="text-center px-1 font-bold">{s.won}</TableCell>
              <TableCell className="text-center px-1">{s.lost}</TableCell>
              <TableCell className="text-center px-1">
                {s.setsWon}-{s.setsLost}
              </TableCell>
              <TableCell className="text-center px-1 font-medium">
                {formatDiff(s.setsWon, s.setsLost)}
              </TableCell>
              <TableCell className="text-center px-1">
                {s.gamesWon}-{s.gamesLost}
              </TableCell>
              <TableCell className="text-center px-1 font-medium">
                {formatDiff(s.gamesWon, s.gamesLost)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
