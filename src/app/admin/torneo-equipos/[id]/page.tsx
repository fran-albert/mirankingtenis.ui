"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useTeamEvent } from "@/hooks/Team-Event/useTeamEvents";
import { useUsers } from "@/hooks/Users/useUsers";
import Loading from "@/components/Loading/loading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { TeamEventStatus } from "@/common/enum/team-event.enum";
import { ConfigTab } from "@/sections/Team-Event/Admin/ConfigTab";
import { TeamsTab } from "@/sections/Team-Event/Admin/TeamsTab";
import { FixtureTab } from "@/sections/Team-Event/Admin/FixtureTab";
import { ResultsTab } from "@/sections/Team-Event/Admin/ResultsTab";
import { StandingsTab } from "@/sections/Team-Event/Admin/StandingsTab";

const statusLabels: Record<TeamEventStatus, string> = {
  [TeamEventStatus.draft]: "Borrador",
  [TeamEventStatus.registration]: "Inscripción",
  [TeamEventStatus.active]: "En curso",
  [TeamEventStatus.finished]: "Finalizado",
};

export default function TeamEventManagePage() {
  const params = useParams();
  const eventId = Number(params.id);
  const { event, isLoading: eventLoading } = useTeamEvent(eventId);
  const [activeTab, setActiveTab] = useState("config");
  const { users } = useUsers({
    auth: true,
    fetchUsers: !!event && activeTab === "teams",
  });

  if (eventLoading) return <Loading isLoading={true} />;
  if (!event) return <div className="p-6">Torneo no encontrado</div>;

  return (
    <div className="px-2 sm:px-4 md:px-6 py-4 sm:py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold">{event.name}</h1>
          <p className="text-gray-500 text-sm">
            {new Date(event.startDate).toLocaleDateString("es-AR", {
              timeZone: "America/Buenos_Aires",
            })}
            {event.endDate &&
              ` - ${new Date(event.endDate).toLocaleDateString("es-AR", {
                timeZone: "America/Buenos_Aires",
              })}`}
          </p>
        </div>
        <Badge variant="outline">{statusLabels[event.status]}</Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4 overflow-x-auto flex-wrap">
          <TabsTrigger value="config" className="text-xs sm:text-sm px-2 sm:px-3">
            Configuración
          </TabsTrigger>
          <TabsTrigger value="teams" className="text-xs sm:text-sm px-2 sm:px-3">
            Equipos
          </TabsTrigger>
          <TabsTrigger value="fixture" className="text-xs sm:text-sm px-2 sm:px-3">
            Fixture
          </TabsTrigger>
          <TabsTrigger value="results" className="text-xs sm:text-sm px-2 sm:px-3">
            Resultados
          </TabsTrigger>
          <TabsTrigger value="standings" className="text-xs sm:text-sm px-2 sm:px-3">
            Posiciones
          </TabsTrigger>
        </TabsList>

        <TabsContent value="config">
          <ConfigTab event={event} />
        </TabsContent>

        <TabsContent value="teams">
          <TeamsTab
            eventId={event.id}
            maxPlayersPerTeam={event.maxPlayersPerTeam}
            allUsers={users}
          />
        </TabsContent>

        <TabsContent value="fixture">
          <FixtureTab
            event={event}
            onSeriesClick={(seriesId) => {
              setActiveTab("results");
            }}
          />
        </TabsContent>

        <TabsContent value="results">
          <ResultsTab
            eventId={event.id}
            singlesPerSeries={event.singlesPerSeries}
            doublesPerSeries={event.doublesPerSeries}
            gamesPerMatch={event.gamesPerMatch}
          />
        </TabsContent>

        <TabsContent value="standings">
          <StandingsTab event={event} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
