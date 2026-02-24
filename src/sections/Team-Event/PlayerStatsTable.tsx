"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlayerStatsResponse, TeamEventTeam } from "@/types/Team-Event/TeamEvent";
import { OptimizedAvatar } from "@/components/ui/optimized-avatar";

interface PlayerStatsTableProps {
  stats: PlayerStatsResponse[];
  teams?: TeamEventTeam[];
}

function getPlayerPhoto(
  playerId: number,
  teams: TeamEventTeam[]
): string | null {
  for (const team of teams) {
    const found = team.players.find((p) => p.playerId === playerId);
    if (found) return found.player.photo;
  }
  return null;
}

function getPlayerInitials(name: string): string {
  const parts = name.split(" ").filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return parts[0]?.substring(0, 2).toUpperCase() ?? "?";
}

export function PlayerStatsTable({ stats, teams = [] }: PlayerStatsTableProps) {
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
        {stats.map((p) => {
          const photo = teams.length > 0 ? getPlayerPhoto(p.playerId, teams) : null;
          return (
            <TableRow key={`${p.playerId}-${p.teamId}`}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <OptimizedAvatar
                    src={photo}
                    alt={p.playerName}
                    size="thumbnail"
                    className="h-6 w-6 shrink-0"
                    fallbackText={getPlayerInitials(p.playerName)}
                  />
                  <span className="font-medium truncate">{p.playerName}</span>
                </div>
              </TableCell>
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
          );
        })}
      </TableBody>
    </Table>
  );
}
