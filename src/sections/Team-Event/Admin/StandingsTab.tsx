"use client";
import { TeamEvent } from "@/types/Team-Event/TeamEvent";
import { useTeamEventStandings } from "@/hooks/Team-Event/useTeamEventStandings";
import { useTeamEventPlayerStats } from "@/hooks/Team-Event/useTeamEventPlayerStats";
import { useTeamEventTeams } from "@/hooks/Team-Event/useTeamEventTeams";
import { StandingsTable } from "../StandingsTable";
import { PlayerStatsTable } from "../PlayerStatsTable";

interface StandingsTabProps {
  event: TeamEvent;
  categoryId: number;
}

export function StandingsTab({ event, categoryId }: StandingsTabProps) {
  const { standings, isLoading: standingsLoading } = useTeamEventStandings(event.id, categoryId);
  const { playerStats, isLoading: statsLoading } = useTeamEventPlayerStats(event.id, categoryId);
  const { teams } = useTeamEventTeams(event.id, categoryId);

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-3">Tabla de posiciones</h3>
        {standingsLoading ? (
          <p className="text-muted-foreground">Cargando posiciones...</p>
        ) : (
          <StandingsTable standings={standings} />
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Estadísticas de jugadores</h3>
        {statsLoading ? (
          <p className="text-muted-foreground">Cargando estadísticas...</p>
        ) : (
          <PlayerStatsTable stats={playerStats} teams={teams} />
        )}
      </div>
    </div>
  );
}
