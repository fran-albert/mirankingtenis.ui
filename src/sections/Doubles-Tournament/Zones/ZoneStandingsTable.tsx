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
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10">Pos</TableHead>
          <TableHead>Equipo</TableHead>
          <TableHead className="text-center">PJ</TableHead>
          <TableHead className="text-center">PG</TableHead>
          <TableHead className="text-center">PP</TableHead>
          <TableHead className="text-center">Pts</TableHead>
          <TableHead className="text-center">Sets +/-</TableHead>
          <TableHead className="text-center">Games +/-</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {standings.map((s) => (
          <TableRow key={s.team.id}>
            <TableCell className="font-bold">{s.position}</TableCell>
            <TableCell className="font-medium">{s.team.teamName}</TableCell>
            <TableCell className="text-center">{s.played}</TableCell>
            <TableCell className="text-center">{s.won}</TableCell>
            <TableCell className="text-center">{s.lost}</TableCell>
            <TableCell className="text-center font-bold">{s.points}</TableCell>
            <TableCell className="text-center">
              {s.setsWon}-{s.setsLost}
            </TableCell>
            <TableCell className="text-center">
              {s.gamesWon}-{s.gamesLost}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
