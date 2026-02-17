"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlayerStatsResponse } from "@/types/Team-Event/TeamEvent";

interface PlayerStatsTableProps {
  stats: PlayerStatsResponse[];
}

export function PlayerStatsTable({ stats }: PlayerStatsTableProps) {
  if (stats.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-8">
        No hay estadísticas de jugadores todavía.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Jugador</TableHead>
          <TableHead>Equipo</TableHead>
          <TableHead className="text-center">PJ</TableHead>
          <TableHead className="text-center">S</TableHead>
          <TableHead className="text-center">D</TableHead>
          <TableHead className="text-center">PG</TableHead>
          <TableHead className="text-center">PP</TableHead>
          <TableHead className="text-center">GF</TableHead>
          <TableHead className="text-center">GC</TableHead>
          <TableHead className="text-center">Desc.</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {stats.map((p) => (
          <TableRow key={`${p.playerId}-${p.teamId}`}>
            <TableCell className="font-medium">{p.playerName}</TableCell>
            <TableCell className="text-muted-foreground">
              {p.teamName}
            </TableCell>
            <TableCell className="text-center">{p.totalPlayed}</TableCell>
            <TableCell className="text-center">{p.singlesPlayed}</TableCell>
            <TableCell className="text-center">{p.doublesPlayed}</TableCell>
            <TableCell className="text-center font-semibold text-green-600">
              {p.won}
            </TableCell>
            <TableCell className="text-center text-red-600">
              {p.lost}
            </TableCell>
            <TableCell className="text-center">{p.gamesFor}</TableCell>
            <TableCell className="text-center">{p.gamesAgainst}</TableCell>
            <TableCell className="text-center">{p.seriesRested}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
