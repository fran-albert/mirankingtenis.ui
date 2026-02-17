"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TeamStandingResponse } from "@/types/Team-Event/TeamEvent";

interface StandingsTableProps {
  standings: TeamStandingResponse[];
}

export function StandingsTable({ standings }: StandingsTableProps) {
  if (standings.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-8">
        No hay datos de posiciones todavía.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">#</TableHead>
          <TableHead>Equipo</TableHead>
          <TableHead className="text-center">PJ</TableHead>
          <TableHead className="text-center">PG</TableHead>
          <TableHead className="text-center">PP</TableHead>
          <TableHead className="text-center">Dif</TableHead>
          <TableHead className="text-center">GF</TableHead>
          <TableHead className="text-center">GC</TableHead>
          <TableHead className="text-center">DG</TableHead>
          <TableHead className="text-center">SG</TableHead>
          <TableHead className="text-center">SP</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {standings.map((s) => (
          <TableRow key={s.teamId}>
            <TableCell className="font-bold">{s.position}</TableCell>
            <TableCell className="font-medium">{s.teamName}</TableCell>
            <TableCell className="text-center">{s.matchesPlayed}</TableCell>
            <TableCell className="text-center font-semibold text-green-600">
              {s.matchesWon}
            </TableCell>
            <TableCell className="text-center text-red-600">
              {s.matchesLost}
            </TableCell>
            <TableCell className="text-center">{s.matchDiff}</TableCell>
            <TableCell className="text-center">{s.gamesFor}</TableCell>
            <TableCell className="text-center">{s.gamesAgainst}</TableCell>
            <TableCell className="text-center">{s.gamesDiff}</TableCell>
            <TableCell className="text-center">{s.seriesWon}</TableCell>
            <TableCell className="text-center">{s.seriesLost}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
