"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useTeamEvent } from "@/hooks/Team-Event/useTeamEvents";
import { useTeamEventCategories } from "@/hooks/Team-Event/useTeamEventCategories";
import { useTeamEventSeries } from "@/hooks/Team-Event/useTeamEventSeries";
import { useTeamEventStandings } from "@/hooks/Team-Event/useTeamEventStandings";
import { useTeamEventPlayerStats } from "@/hooks/Team-Event/useTeamEventPlayerStats";
import { useTeamEventTeams } from "@/hooks/Team-Event/useTeamEventTeams";
import Loading from "@/components/Loading/loading";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
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
  const { categories, isLoading: categoriesLoading } = useTeamEventCategories(eventId, hasEvent);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  useEffect(() => {
    if (categories.length === 0) {
      setSelectedCategoryId(null);
      return;
    }
    const currentExists = categories.some((c) => c.id === selectedCategoryId);
    if (!currentExists) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [categories, selectedCategoryId]);

  const hasCategorySelected = selectedCategoryId !== null;
  const { series } = useTeamEventSeries(eventId, selectedCategoryId ?? 0, hasCategorySelected);
  const { standings } = useTeamEventStandings(eventId, selectedCategoryId ?? 0, hasCategorySelected);
  const { playerStats } = useTeamEventPlayerStats(eventId, selectedCategoryId ?? 0, hasCategorySelected);
  const { teams } = useTeamEventTeams(eventId, selectedCategoryId ?? 0, hasCategorySelected);

  if (eventLoading) return <Loading isLoading={true} />;

  if (!event) {
    return (
      <div className="max-w-5xl mx-auto py-12 px-4 text-center">
        <p className="text-gray-500">Torneo no encontrado</p>
      </div>
    );
  }

  const showCategorySelector = categories.length > 1;

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

      {showCategorySelector && (
        <div className="flex justify-center mb-4">
          <div className="w-64">
            <Label className="text-sm mb-1 block text-center">Categoría</Label>
            <Select
              value={selectedCategoryId ? String(selectedCategoryId) : undefined}
              onValueChange={(v) => setSelectedCategoryId(Number(v))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {categoriesLoading ? (
        <div className="py-8 text-center text-muted-foreground">
          Cargando...
        </div>
      ) : !hasCategorySelected ? (
        <div className="py-8 text-center text-muted-foreground">
          No hay categorías disponibles.
        </div>
      ) : (
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
      )}
    </div>
  );
}
