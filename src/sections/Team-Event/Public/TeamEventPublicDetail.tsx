"use client";
import { useParams } from "next/navigation";
import { useTeamEvent } from "@/hooks/Team-Event/useTeamEvents";
import { useTeamEventSeries } from "@/hooks/Team-Event/useTeamEventSeries";
import { useTeamEventStandings } from "@/hooks/Team-Event/useTeamEventStandings";
import { useTeamEventPlayerStats } from "@/hooks/Team-Event/useTeamEventPlayerStats";
import { useTeamEventTeams } from "@/hooks/Team-Event/useTeamEventTeams";
import Loading from "@/components/Loading/loading";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TeamEventStatus } from "@/common/enum/team-event.enum";
import { TeamEventTeam, TeamEventPlayer } from "@/types/Team-Event/TeamEvent";
import { FixtureView } from "../FixtureView";
import { StandingsTable } from "../StandingsTable";
import { PlayerStatsTable } from "../PlayerStatsTable";

const statusLabels: Record<TeamEventStatus, string> = {
  [TeamEventStatus.draft]: "Borrador",
  [TeamEventStatus.registration]: "Inscripción",
  [TeamEventStatus.active]: "En curso",
  [TeamEventStatus.finished]: "Finalizado",
};

export function TeamEventPublicDetail() {
  const params = useParams();
  const eventId = Number(params.id);
  const { event, isLoading: eventLoading } = useTeamEvent(eventId);
  const hasEvent = !!event;
  const { series } = useTeamEventSeries(eventId, hasEvent);
  const { standings } = useTeamEventStandings(eventId, hasEvent);
  const { playerStats } = useTeamEventPlayerStats(eventId, hasEvent);
  const { teams } = useTeamEventTeams(eventId, hasEvent);

  if (eventLoading) return <Loading isLoading={true} />;

  if (!event) {
    return (
      <div className="max-w-5xl mx-auto py-12 px-4 text-center">
        <p className="text-gray-500">Torneo no encontrado</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-4 sm:py-8 px-2 sm:px-4">
      <div className="text-center mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1">
          {event.name}
        </h1>
        {event.description && (
          <p className="text-muted-foreground mb-2">{event.description}</p>
        )}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <span>
            {new Date(event.startDate).toLocaleDateString("es-AR", {
              timeZone: "America/Buenos_Aires",
            })}
            {event.endDate &&
              ` - ${new Date(event.endDate).toLocaleDateString("es-AR", {
                timeZone: "America/Buenos_Aires",
              })}`}
          </span>
          <Badge variant="outline">{statusLabels[event.status]}</Badge>
        </div>
      </div>

      <Tabs defaultValue="fixture">
        <TabsList className="mb-4 w-full justify-center">
          <TabsTrigger value="fixture">Fixture</TabsTrigger>
          <TabsTrigger value="standings">Posiciones</TabsTrigger>
          <TabsTrigger value="stats">Estadísticas</TabsTrigger>
          <TabsTrigger value="teams">Equipos</TabsTrigger>
        </TabsList>

        <TabsContent value="fixture">
          <FixtureView series={series} />
        </TabsContent>

        <TabsContent value="standings">
          <StandingsTable standings={standings} />
        </TabsContent>

        <TabsContent value="stats">
          <PlayerStatsTable stats={playerStats} />
        </TabsContent>

        <TabsContent value="teams">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {teams.map((team: TeamEventTeam) => {
              const activePlayers = team.players.filter(
                (p: TeamEventPlayer) => !p.leftAt
              );
              return (
                <Card key={team.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{team.name}</CardTitle>
                    {team.captain && (
                      <p className="text-xs text-muted-foreground">
                        Capitán: {team.captain.name} {team.captain.lastname}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {activePlayers.map((p: TeamEventPlayer) => (
                        <li key={p.id} className="text-sm">
                          {p.player.name} {p.player.lastname}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          {teams.length === 0 && (
            <p className="text-muted-foreground text-center py-8">
              No hay equipos registrados todavía.
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
