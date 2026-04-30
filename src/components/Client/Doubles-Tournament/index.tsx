"use client";
import React, { useState } from "react";
import Image from "next/image";
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

interface ClientDoublesTournamentComponentProps {
  eventId?: number;
}

export default function ClientDoublesTournamentComponent({
  eventId: eventIdProp,
}: ClientDoublesTournamentComponentProps) {
  const { events, isLoading: eventsLoading } = useDoublesEvents();

  const activeEvent = events.find((e) => e.status === "active") || events[0];
  const eventId = eventIdProp ?? activeEvent?.id ?? 0;

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

  if ((!eventIdProp && eventsLoading) || eventLoading) {
    return <Loading isLoading={true} />;
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 text-slate-900 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Torneo Dobles</h1>
          <p className="text-gray-500">Torneo no encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900">
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="mb-3 flex justify-center sm:mb-4">
            <Image
              src="/firmat-open-2.png"
              alt="Firmat Open 2"
              width={220}
              height={330}
              priority
              className="h-28 w-auto sm:h-36"
            />
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-2">
            {event.name}
          </h1>
          {event.description && (
            <p className="text-gray-500 text-center text-sm sm:text-base mb-3">
              {event.description}
            </p>
          )}
          <p className="text-xs sm:text-sm text-gray-400 text-center">
            {new Date(event.startDate).toLocaleDateString("es-AR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
            {event.endDate &&
              ` - ${new Date(event.endDate).toLocaleDateString("es-AR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}`}
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-2 sm:px-4">
        {categories.length > 0 && (
          <div className="mb-4 sm:mb-6 rounded-lg border bg-white p-3 sm:p-4">
            <CategorySelector
              categories={categories}
              selectedId={activeCategoryId}
              onSelect={setSelectedCategoryId}
            />
          </div>
        )}

        <Tabs defaultValue="schedule">
          <TabsList className="mb-4 w-full justify-center overflow-x-auto bg-white border">
            <TabsTrigger value="schedule" className="text-xs sm:text-sm">
              Grilla
            </TabsTrigger>
            <TabsTrigger value="zones" className="text-xs sm:text-sm">
              <span className="sm:hidden">Zonas</span>
              <span className="hidden sm:inline">Zonas y Posiciones</span>
            </TabsTrigger>
            <TabsTrigger value="playoffs" className="text-xs sm:text-sm">
              Llaves
            </TabsTrigger>
          </TabsList>

          <TabsContent value="schedule">
            <div className="rounded-lg border bg-white p-2 sm:p-4">
              {schedule ? (
                <ScheduleGrid schedule={schedule} />
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No hay grilla disponible
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="zones">
            <div className="rounded-lg border bg-white p-3 sm:p-4">
              <ZoneView standings={standings} matches={matches} />
            </div>
          </TabsContent>

          <TabsContent value="playoffs">
            <div className="rounded-lg border bg-white p-3 sm:p-4">
              <PlayoffBracket matches={playoffMatches} />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
