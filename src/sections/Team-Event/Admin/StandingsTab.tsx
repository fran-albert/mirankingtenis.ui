"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { TeamEvent } from "@/types/Team-Event/TeamEvent";
import { TeamEventStatus } from "@/common/enum/team-event.enum";
import { TeamEventSeriesPhase } from "@/common/enum/team-event.enum";
import { useTeamEventStandings } from "@/hooks/Team-Event/useTeamEventStandings";
import { useTeamEventPlayerStats } from "@/hooks/Team-Event/useTeamEventPlayerStats";
import { useTeamEventTeams } from "@/hooks/Team-Event/useTeamEventTeams";
import { useTeamEventSeries } from "@/hooks/Team-Event/useTeamEventSeries";
import { useStandingsMutations } from "@/hooks/Team-Event/useTeamEventMutations";
import { StandingsTable } from "../StandingsTable";
import { PlayerStatsTable } from "../PlayerStatsTable";
import { Trophy } from "lucide-react";

interface StandingsTabProps {
  event: TeamEvent;
  categoryId: number;
}

export function StandingsTab({ event, categoryId }: StandingsTabProps) {
  const { standings, isLoading: standingsLoading } = useTeamEventStandings(event.id, categoryId);
  const { playerStats, isLoading: statsLoading } = useTeamEventPlayerStats(event.id, categoryId);
  const { teams } = useTeamEventTeams(event.id, categoryId);
  const { series } = useTeamEventSeries(event.id, categoryId);
  const { finalizeMutation } = useStandingsMutations(event.id, categoryId);

  const [team1Id, setTeam1Id] = useState("");
  const [team2Id, setTeam2Id] = useState("");

  const hasFinalSeries = series.some(
    (s) => s.phase === TeamEventSeriesPhase.final
  );
  const canFinalize = event.status === TeamEventStatus.active && !hasFinalSeries;

  const handleFinalize = () => {
    if (!team1Id || !team2Id) {
      toast.error("Seleccioná los dos equipos para la final");
      return;
    }
    if (team1Id === team2Id) {
      toast.error("Los equipos deben ser distintos");
      return;
    }
    if (!confirm("¿Generar la serie final entre estos dos equipos?")) return;

    finalizeMutation.mutate(
      { team1Id: Number(team1Id), team2Id: Number(team2Id) },
      {
        onSuccess: () => toast.success("Final generada correctamente"),
        onError: () => toast.error("Error al generar la final"),
      }
    );
  };

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

      {canFinalize && (
        <div className="border rounded-lg p-4 space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Generar Final
          </h3>
          <p className="text-sm text-muted-foreground">
            Seleccioná los dos equipos que jugarán la final.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Equipo 1</Label>
              <Select value={team1Id} onValueChange={setTeam1Id}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar equipo" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((t) => (
                    <SelectItem key={t.id} value={String(t.id)}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Equipo 2</Label>
              <Select value={team2Id} onValueChange={setTeam2Id}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar equipo" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((t) => (
                    <SelectItem key={t.id} value={String(t.id)}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            onClick={handleFinalize}
            disabled={finalizeMutation.isPending}
          >
            {finalizeMutation.isPending
              ? "Generando..."
              : "Generar serie final"}
          </Button>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold mb-3">Estadísticas de jugadores</h3>
        {statsLoading ? (
          <p className="text-muted-foreground">Cargando estadísticas...</p>
        ) : (
          <PlayerStatsTable stats={playerStats} />
        )}
      </div>
    </div>
  );
}
