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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamEventStatus, TeamEventSeriesStatus } from "@/common/enum/team-event.enum";
import { TeamEventTeam, TeamEventPlayer } from "@/types/Team-Event/TeamEvent";
import { StandingsTable } from "../StandingsTable";
import { PlayerStatsTable } from "../PlayerStatsTable";
import { RichScoreCard } from "../components/RichScoreCard";
import { SeriesMatchCard } from "../components/CompactMatchRow";
import { BracketView } from "../components/BracketView";
import { OptimizedAvatar } from "@/components/ui/optimized-avatar";
import { Search, Trophy, Calendar, ChevronDown, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TeamEventPublicDetailProps {
  isPublicView?: boolean;
}

export function TeamEventPublicDetail({ isPublicView = false }: TeamEventPublicDetailProps) {
  const params = useParams();
  const eventId = Number(params.id);
  const { event, isLoading: eventLoading } = useTeamEvent(eventId);
  const hasEvent = !!event;
  const { categories, isLoading: categoriesLoading } = useTeamEventCategories(eventId, hasEvent);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("fixture");

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

  // Dinamizar series destacadas
  const activeSeries = series.filter(s => s.status === TeamEventSeriesStatus.inProgress);
  const pendingSeries = series.filter(s => s.status === TeamEventSeriesStatus.pending);
  const displayFeatured = [...activeSeries, ...pendingSeries].slice(0, 2);

  return (
    <div className={`dark min-h-screen bg-[#040B1D] text-white font-sans selection:bg-tennis-accent selection:text-black ${isPublicView ? 'overflow-x-hidden' : ''}`}>
      {/* Top Navbar */}
      <div className="border-b border-white/5 bg-[#040B1D]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Trophy className="text-tennis-accent w-6 h-6" />
            <h1 className="text-sm font-bold tracking-tight">{event.name}</h1>
          </div>
          
          {!isPublicView && (
            <div className="flex-1 max-w-md relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              <Input 
                placeholder="Buscar equipo o jugador..." 
                className="bg-white/5 border-white/10 pl-10 h-9 text-sm focus-visible:ring-tennis-accent text-white"
              />
            </div>
          )}

          <div className="flex items-center gap-2">
             {categories.length > 1 && (
               <div className="relative flex items-center">
                 <select
                   value={selectedCategoryId ?? ""}
                   onChange={(e) => setSelectedCategoryId(Number(e.target.value))}
                   className="appearance-none bg-white/5 border border-white/10 rounded-md text-[10px] sm:text-xs font-bold text-gray-300 hover:text-white transition-colors pl-2 pr-6 h-8 sm:h-9 cursor-pointer focus:outline-none focus:ring-1 focus:ring-tennis-accent"
                 >
                   {categories.map((c) => (
                     <option key={c.id} value={c.id} className="bg-[#040B1D] text-white">
                       {c.name}
                     </option>
                   ))}
                 </select>
                 <ChevronDown className="w-3 h-3 absolute right-1.5 pointer-events-none text-gray-500" />
               </div>
             )}
             <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab("bracket")}
                className={`text-[10px] sm:text-xs font-semibold ${activeTab === 'bracket' ? 'text-tennis-accent' : 'text-gray-400 hover:text-white'}`}
             >
                Ver Cuadro
             </Button>
             <Button
                size="sm"
                onClick={() => setActiveTab("fixture")}
                className="bg-tennis-accent hover:bg-tennis-accent/90 text-black font-bold text-[10px] sm:text-xs h-8 sm:h-9"
             >
                {isPublicView ? "Partidos" : "Partidos de Hoy"}
             </Button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="border-t border-white/5 bg-tennis-card/50 overflow-x-auto no-scrollbar">
          <div className="max-w-7xl mx-auto px-4 h-12 flex items-center gap-6 whitespace-nowrap text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gray-400">
             <button 
                onClick={() => setActiveTab("fixture")}
                className={`h-full px-1 transition-all ${activeTab === "fixture" ? "text-white border-b-2 border-tennis-accent" : "hover:text-white"}`}
             >
                Enfrentamientos
             </button>
             <button 
                onClick={() => setActiveTab("bracket")}
                className={`h-full px-1 transition-all ${activeTab === "bracket" ? "text-white border-b-2 border-tennis-accent" : "hover:text-white"}`}
             >
                Cuadro
             </button>
             <button 
                onClick={() => setActiveTab("standings")}
                className={`h-full px-1 transition-all ${activeTab === "standings" ? "text-white border-b-2 border-tennis-accent" : "hover:text-white"}`}
             >
                Posiciones
             </button>
             <button 
                onClick={() => setActiveTab("teams")}
                className={`h-full px-1 transition-all ${activeTab === "teams" ? "text-white border-b-2 border-tennis-accent" : "hover:text-white"}`}
             >
                Equipos
             </button>
             <button 
                onClick={() => setActiveTab("stats")}
                className={`h-full px-1 transition-all ${activeTab === "stats" ? "text-white border-b-2 border-tennis-accent" : "hover:text-white"}`}
             >
                Estadísticas
             </button>
             
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-12">
        {activeTab !== "bracket" && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-tennis-accent flex items-center gap-2">
                <span className="w-8 h-[2px] bg-tennis-accent" />
                Partidos Destacados
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayFeatured.length > 0 ? (
                displayFeatured.map((s) => (
                  <RichScoreCard 
                    key={s.id}
                    status={s.status === TeamEventSeriesStatus.inProgress ? "LIVE" : "PRÓXIMO"}
                    time={s.scheduledWeekStart ? new Date(s.scheduledWeekStart).toLocaleDateString() : undefined}
                    matchInfo={`Copa Equipos • Jornada ${s.matchday}`}
                    player1={{ lastname: s.homeTeam?.name || "TBD" }}
                    player2={{ lastname: s.awayTeam?.name || "TBD" }}
                    score1={[s.homeMatchesWon]}
                    score2={[s.awayMatchesWon]}
                  />
                ))
              ) : (
                <div className="col-span-2 py-12 text-center text-gray-500 border border-dashed border-white/10 rounded-xl">
                   No hay partidos destacados para mostrar.
                </div>
              )}
            </div>
          </section>
        )}

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-white flex items-center gap-2">
              <span className="w-8 h-[2px] bg-white" />
              {activeTab === "bracket" ? "Cuadro del Torneo" : activeTab === "standings" ? "Tabla de Posiciones" : "Enfrentamientos"}
            </h2>
          </div>

          <div className="bg-tennis-card rounded-2xl border border-white/5 p-4 sm:p-6 shadow-2xl min-h-[400px]">
              {activeTab === "fixture" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {series.map((s) => (
                    <SeriesMatchCard key={s.id} series={s} />
                  ))}
                  {series.length === 0 && (
                     <div className="col-span-2 py-20 text-center">
                        <Calendar className="w-12 h-12 text-white/5 mx-auto mb-4" />
                        <p className="text-gray-500 text-sm">El fixture aún no fue generado.</p>
                     </div>
                  )}
                </div>
              )}

              {activeTab === "bracket" && (
                <BracketView series={series} />
              )}

              {activeTab === "standings" && (
                <div className="bg-white/5 rounded-lg overflow-hidden border border-white/10 overflow-x-auto">
                  <StandingsTable standings={standings} />
                </div>
              )}

              {activeTab === "stats" && (
                 <div className="overflow-x-auto">
                   <PlayerStatsTable stats={playerStats} teams={teams} />
                 </div>
              )}

              {activeTab === "teams" && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {teams.map((team: TeamEventTeam) => {
                    const activePlayers = team.players.filter((p: TeamEventPlayer) => !p.leftAt);
                    return (
                      <Card key={team.id} className="bg-white/[0.03] border-white/5 text-white shadow-none">
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-tennis-accent/10 flex items-center justify-center">
                              <Shield className="w-4 h-4 text-tennis-accent" />
                            </div>
                            <div>
                              <CardTitle className="text-sm font-bold text-tennis-accent">{team.name}</CardTitle>
                              {team.captain && (
                                <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                                  Cap. {team.captain.name} {team.captain.lastname}
                                </p>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <ul className="space-y-2.5">
                            {activePlayers.map((p: TeamEventPlayer) => {
                              const isCaptain = team.captainId === p.playerId;
                              return (
                                <li key={p.id} className="flex items-center gap-2.5">
                                  <OptimizedAvatar
                                    src={p.player.photo}
                                    alt={`${p.player.name} ${p.player.lastname}`}
                                    size="thumbnail"
                                    className="h-7 w-7 ring-1 ring-white/10"
                                    fallbackText={`${p.player.name[0]}${p.player.lastname[0]}`.toUpperCase()}
                                  />
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    <span className="text-xs text-gray-200 truncate">
                                      {p.player.name} {p.player.lastname}
                                    </span>
                                    {isCaptain && (
                                      <span className="text-[9px] font-bold text-tennis-accent bg-tennis-accent/10 px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0">
                                        Cap
                                      </span>
                                    )}
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
          </div>
        </section>
      </main>
    </div>
  );
}
