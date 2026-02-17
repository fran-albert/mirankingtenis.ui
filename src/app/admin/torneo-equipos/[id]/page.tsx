"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useTeamEvent } from "@/hooks/Team-Event/useTeamEvents";
import { useTeamEventCategories } from "@/hooks/Team-Event/useTeamEventCategories";
import { useUsers } from "@/hooks/Users/useUsers";
import Loading from "@/components/Loading/loading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
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
  const { categories, isLoading: categoriesLoading } = useTeamEventCategories(eventId, !!event);
  const [activeTab, setActiveTab] = useState("config");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const { users } = useUsers({
    auth: true,
    fetchUsers: !!event && activeTab === "teams",
  });

  // Auto-select first category, reconcile if deleted
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

  if (eventLoading) return <Loading isLoading={true} />;
  if (!event) return <div className="p-6">Torneo no encontrado</div>;

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);
  const showCategorySelector = categories.length > 1;
  const hasCategorySelected = selectedCategoryId !== null && selectedCategory !== undefined;
  const needsCategoryTabs = ["teams", "fixture", "results", "standings"];

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

      {showCategorySelector && (
        <div className="mb-4 max-w-xs">
          <Label className="text-sm mb-1 block">Categoría</Label>
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
      )}

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

        {categoriesLoading && needsCategoryTabs.includes(activeTab) ? (
          <div className="py-8 text-center text-muted-foreground">
            Cargando categorías...
          </div>
        ) : !hasCategorySelected && needsCategoryTabs.includes(activeTab) ? (
          <div className="py-8 text-center text-muted-foreground">
            Creá una categoría en la pestaña de Configuración para gestionar equipos, fixture y resultados.
          </div>
        ) : (
          <>
            <TabsContent value="teams">
              {hasCategorySelected && (
                <TeamsTab
                  eventId={event.id}
                  categoryId={selectedCategoryId!}
                  maxPlayersPerTeam={selectedCategory!.maxPlayersPerTeam}
                  allUsers={users}
                />
              )}
            </TabsContent>

            <TabsContent value="fixture">
              {hasCategorySelected && (
                <FixtureTab
                  event={event}
                  categoryId={selectedCategoryId!}
                  onSeriesClick={() => {
                    setActiveTab("results");
                  }}
                />
              )}
            </TabsContent>

            <TabsContent value="results">
              {hasCategorySelected && (
                <ResultsTab
                  eventId={event.id}
                  categoryId={selectedCategoryId!}
                  singlesPerSeries={event.singlesPerSeries}
                  doublesPerSeries={event.doublesPerSeries}
                  gamesPerMatch={event.gamesPerMatch}
                />
              )}
            </TabsContent>

            <TabsContent value="standings">
              {hasCategorySelected && (
                <StandingsTab event={event} categoryId={selectedCategoryId!} />
              )}
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}
