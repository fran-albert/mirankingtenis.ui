"use client";
import React, { useState } from "react";
import { useDoublesEvents } from "@/hooks/Doubles-Event/useDoublesEvents";
import { useDoublesEvent } from "@/hooks/Doubles-Event/useDoublesEvents";
import { useDoublesCategories } from "@/hooks/Doubles-Event/useDoublesCategories";
import { useDoublesMatches } from "@/hooks/Doubles-Event/useDoublesMatches";
import { useDoublesStandings } from "@/hooks/Doubles-Event/useDoublesStandings";
import { useDoublesSchedule } from "@/hooks/Doubles-Event/useDoublesSchedule";
import { DoublesMatchPhase } from "@/common/enum/doubles-event.enum";
import Loading from "@/components/Loading/loading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CategorySelector } from "@/sections/Doubles-Tournament/CategorySelector";
import { ScheduleGrid } from "@/sections/Doubles-Tournament/Schedule/ScheduleGrid";
import { ZoneView } from "@/sections/Doubles-Tournament/Zones/ZoneView";
import { PlayoffBracket } from "@/sections/Doubles-Tournament/Playoffs/PlayoffBracket";

export default function ClientDoublesTournamentComponent() {
  const { events, isLoading: eventsLoading } = useDoublesEvents();

  // Pick the first active event, or the most recent one
  const activeEvent =
    events.find((e) => e.status === "active") || events[0];
  const eventId = activeEvent?.id || 0;

  const { event, isLoading: eventLoading } = useDoublesEvent(eventId, !!eventId);
  const { categories } = useDoublesCategories(eventId, !!eventId);
  const { schedule } = useDoublesSchedule(eventId, !!eventId);

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const activeCategoryId = selectedCategoryId || categories[0]?.id || 0;

  const { matches } = useDoublesMatches(activeCategoryId, !!activeCategoryId);
  const { standings } = useDoublesStandings(
    activeCategoryId,
    !!activeCategoryId
  );

  const playoffMatches = matches.filter(
    (m) => m.phase === DoublesMatchPhase.playoff
  );

  if (eventsLoading || eventLoading) return <Loading isLoading={true} />;

  if (!activeEvent) {
    return (
      <div className="max-w-5xl mx-auto py-12 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Torneo Dobles</h1>
        <p className="text-gray-500">No hay eventos disponibles</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-4 sm:py-8 px-2 sm:px-4">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-2">
        {activeEvent.name}
      </h1>
      {activeEvent.description && (
        <p className="text-gray-500 text-center text-sm sm:text-base mb-4">
          {activeEvent.description}
        </p>
      )}
      <p className="text-xs sm:text-sm text-gray-400 text-center mb-4 sm:mb-6">
        {new Date(activeEvent.startDate).toLocaleDateString("es-AR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
        {activeEvent.endDate &&
          ` - ${new Date(activeEvent.endDate).toLocaleDateString("es-AR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}`}
      </p>

      {categories.length > 0 && (
        <div className="mb-4 sm:mb-6">
          <CategorySelector
            categories={categories}
            selectedId={activeCategoryId}
            onSelect={setSelectedCategoryId}
          />
        </div>
      )}

      <Tabs defaultValue="schedule">
        <TabsList className="mb-4 w-full justify-center">
          <TabsTrigger value="schedule" className="text-xs sm:text-sm">Grilla</TabsTrigger>
          <TabsTrigger value="zones" className="text-xs sm:text-sm">Zonas y Posiciones</TabsTrigger>
          <TabsTrigger value="playoffs" className="text-xs sm:text-sm">Llaves</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule">
          {schedule ? (
            <ScheduleGrid schedule={schedule} />
          ) : (
            <p className="text-gray-500 text-center py-8">
              No hay grilla disponible
            </p>
          )}
        </TabsContent>

        <TabsContent value="zones">
          <ZoneView standings={standings} matches={matches} />
        </TabsContent>

        <TabsContent value="playoffs">
          <PlayoffBracket matches={playoffMatches} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
