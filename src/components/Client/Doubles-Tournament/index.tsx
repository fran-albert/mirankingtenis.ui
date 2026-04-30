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
import { Button } from "@/components/ui/button";
import { ScheduleGrid } from "@/sections/Doubles-Tournament/Schedule/ScheduleGrid";
import { ZoneView } from "@/sections/Doubles-Tournament/Zones/ZoneView";
import { PlayoffBracket } from "@/sections/Doubles-Tournament/Playoffs/PlayoffBracket";
import { Calendar, ChevronDown, Trophy } from "lucide-react";

interface ClientDoublesTournamentComponentProps {
  eventId?: number;
}

export default function ClientDoublesTournamentComponent({
  eventId: eventIdProp,
}: ClientDoublesTournamentComponentProps) {
  const { events, isLoading: eventsLoading } = useDoublesEvents();

  // Pick the first active event, or the most recent one
  const activeEvent =
    events.find((e) => e.status === "active") || events[0];
  const eventId = eventIdProp ?? activeEvent?.id ?? 0;

  const { event, isLoading: eventLoading } = useDoublesEvent(eventId, !!eventId);
  const { categories } = useDoublesCategories(eventId, !!eventId);
  const { schedule } = useDoublesSchedule(eventId, !!eventId);

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [activeTab, setActiveTab] = useState("schedule");
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
      <div className="dark min-h-screen bg-[#0F1D32] text-white flex items-center justify-center px-4">
        <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Torneo Dobles</h1>
        <p className="text-gray-400">Torneo no encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dark min-h-screen bg-[#0F1D32] text-white font-sans selection:bg-tennis-accent selection:text-black overflow-x-hidden">
      <div className="border-b border-white/10 bg-[#0F1D32]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 min-w-0">
            <Trophy className="text-tennis-accent w-6 h-6 shrink-0" />
            <div className="min-w-0">
              <h1 className="text-sm font-bold tracking-tight truncate">
                {event.name}
              </h1>
              <p className="hidden sm:block text-[10px] uppercase tracking-[0.2em] text-gray-500">
                Torneo Dobles
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {categories.length > 1 && (
              <div className="relative flex items-center">
                <select
                  value={activeCategoryId || ""}
                  onChange={(e) => setSelectedCategoryId(Number(e.target.value))}
                  className="appearance-none bg-white/5 border border-white/10 rounded-md text-[10px] sm:text-xs font-bold text-gray-300 hover:text-white transition-colors pl-2 pr-6 h-8 sm:h-9 cursor-pointer focus:outline-none focus:ring-1 focus:ring-tennis-accent"
                >
                  {categories.map((category) => (
                    <option
                      key={category.id}
                      value={category.id}
                      className="bg-[#0F1D32] text-white"
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3 h-3 absolute right-1.5 pointer-events-none text-gray-500" />
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab("playoffs")}
              className={`text-xs sm:text-sm font-semibold ${
                activeTab === "playoffs"
                  ? "text-tennis-accent"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Ver Llaves
            </Button>
            <Button
              size="sm"
              onClick={() => setActiveTab("schedule")}
              className="bg-tennis-accent hover:bg-tennis-accent/90 text-white font-bold text-xs sm:text-sm h-8 sm:h-9 px-3"
            >
              Partidos
            </Button>
          </div>
        </div>

        <div className="border-t border-white/10 bg-tennis-card/50 overflow-x-auto no-scrollbar">
          <div className="max-w-7xl mx-auto px-4 h-12 flex items-center gap-6 whitespace-nowrap text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-400">
            <button
              onClick={() => setActiveTab("schedule")}
              className={`h-full px-1 transition-all ${
                activeTab === "schedule"
                  ? "text-white border-b-2 border-tennis-accent"
                  : "hover:text-white"
              }`}
            >
              Grilla
            </button>
            <button
              onClick={() => setActiveTab("zones")}
              className={`h-full px-1 transition-all ${
                activeTab === "zones"
                  ? "text-white border-b-2 border-tennis-accent"
                  : "hover:text-white"
              }`}
            >
              Zonas y Posiciones
            </button>
            <button
              onClick={() => setActiveTab("playoffs")}
              className={`h-full px-1 transition-all ${
                activeTab === "playoffs"
                  ? "text-white border-b-2 border-tennis-accent"
                  : "hover:text-white"
              }`}
            >
              Llaves
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        <section className="space-y-3">
          {event.description && (
            <p className="text-sm sm:text-base text-gray-400 max-w-3xl">
              {event.description}
            </p>
          )}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>
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
            </span>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-white flex items-center gap-2">
              <span className="w-8 h-[2px] bg-white" />
              {activeTab === "playoffs"
                ? "Llaves"
                : activeTab === "zones"
                  ? "Zonas y Posiciones"
                  : "Grilla de Partidos"}
            </h2>
          </div>

          <div className="bg-tennis-card rounded-2xl border border-white/10 p-4 sm:p-6 shadow-2xl min-h-[400px]">
            {activeTab === "schedule" && (
              <div className="bg-white text-slate-900 rounded-xl p-3 sm:p-4 overflow-hidden">
                {schedule ? (
                  <ScheduleGrid schedule={schedule} />
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No hay grilla disponible
                  </p>
                )}
              </div>
            )}

            {activeTab === "zones" && (
              <div className="bg-white text-slate-900 rounded-xl p-3 sm:p-4">
                <ZoneView standings={standings} matches={matches} />
              </div>
            )}

            {activeTab === "playoffs" && (
              <div className="bg-white text-slate-900 rounded-xl p-3 sm:p-4">
                <PlayoffBracket matches={playoffMatches} />
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
