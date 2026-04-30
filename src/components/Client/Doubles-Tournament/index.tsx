"use client";
import React, { useState } from "react";
import { useDoublesEvents } from "@/hooks/Doubles-Event/useDoublesEvents";
import { useDoublesEvent } from "@/hooks/Doubles-Event/useDoublesEvents";
import { useDoublesCategories } from "@/hooks/Doubles-Event/useDoublesCategories";
import { useDoublesMatches } from "@/hooks/Doubles-Event/useDoublesMatches";
import { useDoublesStandings } from "@/hooks/Doubles-Event/useDoublesStandings";
import { useDoublesSchedule } from "@/hooks/Doubles-Event/useDoublesSchedule";
import {
  DoublesMatchPhase,
  DoublesMatchStatus,
} from "@/common/enum/doubles-event.enum";
import {
  DoublesMatch,
  DoublesSchedule,
  ScheduleMatch,
  TeamStanding,
  ZoneStanding,
} from "@/types/Doubles-Event/DoublesEvent";
import {
  DOUBLES_PLAYOFF_ROUNDS,
  getPlayoffRoundLabel,
} from "@/common/constants/doubles-event.constants";
import Loading from "@/components/Loading/loading";
import { Button } from "@/components/ui/button";
import { Calendar, Check, ChevronDown, Clock, MapPin, Trophy } from "lucide-react";

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
              <PublicSchedule schedule={schedule} />
            )}

            {activeTab === "zones" && (
              <PublicZones standings={standings} matches={matches} />
            )}

            {activeTab === "playoffs" && (
              <PublicBracket matches={playoffMatches} />
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function TeamName({ name }: { name: string }) {
  const parts = name.split(" / ");
  if (parts.length <= 1) return <>{name}</>;
  return (
    <>
      {parts.map((part, idx) => (
        <span key={`${part}-${idx}`} className="block leading-tight">
          {part}
        </span>
      ))}
    </>
  );
}

function PublicSchedule({ schedule }: { schedule: DoublesSchedule | undefined }) {
  if (!schedule || (schedule.days.length === 0 && schedule.turns.length === 0)) {
    return (
      <EmptyState
        icon={<Calendar className="w-12 h-12 text-white/5" />}
        text="No hay grilla disponible"
      />
    );
  }

  const days =
    schedule.days && schedule.days.length > 0
      ? schedule.days
      : [{ date: "", label: "", turns: schedule.turns }];

  return (
    <div className="space-y-8">
      {days.map((day, dayIdx) => (
        <div key={day.date || dayIdx} className="space-y-4">
          {day.label && (
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-tennis-accent" />
              <h3 className="text-xs font-bold uppercase tracking-[0.24em] text-tennis-accent">
                {day.label}
              </h3>
            </div>
          )}
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {day.turns.flatMap((turn) =>
              turn.slots
                .filter((slot) => slot.match)
                .map((slot, slotIdx) => (
                  <ScheduleMatchCard
                    key={`${turn.turnNumber}-${slotIdx}-${slot.match?.id}`}
                    turnNumber={turn.turnNumber}
                    startTime={turn.startTime}
                    venue={slot.venue}
                    courtName={slot.courtName}
                    match={slot.match!}
                  />
                ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function ScheduleMatchCard({
  turnNumber,
  startTime,
  venue,
  courtName,
  match,
}: {
  turnNumber: number;
  startTime: string | null;
  venue: string;
  courtName: string;
  match: ScheduleMatch;
}) {
  const hasWinner = !!match.winnerTeamNumber;
  const team1Winner = match.winnerTeamNumber === 1;
  const team2Winner = match.winnerTeamNumber === 2;

  return (
    <div className="bg-white/[0.06] hover:bg-white/[0.10] transition-all rounded-xl border border-white/10 border-l-2 border-l-tennis-accent/70 overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-3 py-2">
        <div className="flex items-center gap-2 min-w-0 text-[10px] font-bold uppercase tracking-wider text-gray-500">
          <Clock className="h-3.5 w-3.5 text-tennis-accent" />
          <span>T{turnNumber}</span>
          {startTime && (
            <span>
              {new Date(startTime).toLocaleTimeString("es-AR", {
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "America/Buenos_Aires",
              })}
            </span>
          )}
        </div>
        <span className="rounded bg-white/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-gray-400">
          {match.phase === "playoff" && match.round
            ? getPlayoffRoundLabel(match.round)
            : match.categoryName}
        </span>
      </div>

      <div className="p-3 space-y-3">
        <TeamScoreLine
          name={match.team1Name}
          isWinner={team1Winner}
          score={team1Winner ? match.score : undefined}
          muted={hasWinner && !team1Winner}
        />
        <div className="flex items-center gap-2">
          <span className="h-px flex-1 bg-white/10" />
          <span className="text-[10px] font-bold text-gray-600">VS</span>
          <span className="h-px flex-1 bg-white/10" />
        </div>
        <TeamScoreLine
          name={match.team2Name}
          isWinner={team2Winner}
          score={team2Winner ? match.score : undefined}
          muted={hasWinner && !team2Winner}
        />
      </div>

      <div className="flex items-center gap-2 border-t border-white/10 px-3 py-2 text-[10px] text-gray-500">
        <MapPin className="h-3.5 w-3.5" />
        <span className="truncate">
          {venue} · {courtName}
        </span>
      </div>
    </div>
  );
}

function TeamScoreLine({
  name,
  isWinner,
  muted,
  score,
}: {
  name: string;
  isWinner: boolean;
  muted?: boolean;
  score?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 min-w-0">
        <span
          className={`h-2 w-2 rounded-full shrink-0 ${
            isWinner ? "bg-tennis-accent" : "bg-white/20"
          }`}
        />
        <span
          className={`text-xs sm:text-sm font-bold truncate ${
            isWinner
              ? "text-tennis-accent"
              : muted
                ? "text-gray-500"
                : "text-gray-200"
          }`}
        >
          <TeamName name={name} />
        </span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {isWinner && <Check className="h-3.5 w-3.5 text-tennis-accent" />}
        {score && (
          <span className="font-mono text-xs font-bold text-tennis-accent">
            {score}
          </span>
        )}
      </div>
    </div>
  );
}

function PublicZones({
  standings,
  matches,
}: {
  standings: ZoneStanding[];
  matches: DoublesMatch[];
}) {
  if (standings.length === 0) {
    return (
      <EmptyState
        icon={<Trophy className="w-12 h-12 text-white/5" />}
        text="No hay zonas configuradas"
      />
    );
  }

  const zoneMatches = matches.filter((match) => match.phase === DoublesMatchPhase.zone);

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      {standings.map((zone) => (
        <div key={zone.zoneName} className="rounded-2xl border border-white/10 bg-white/[0.04] overflow-hidden">
          <div className="border-b border-white/10 px-4 py-3">
            <h3 className="text-sm font-bold uppercase tracking-[0.22em] text-white">
              {zone.zoneName}
            </h3>
          </div>
          <StandingsBlock standings={zone.standings} />
          <div className="border-t border-white/10 p-3 space-y-2">
            {zoneMatches
              .filter((match) => match.zoneName === zone.zoneName)
              .map((match) => (
                <DoublesMatchMiniCard key={match.id} match={match} />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function StandingsBlock({ standings }: { standings: TeamStanding[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-xs">
        <thead className="text-[10px] uppercase tracking-wider text-gray-500">
          <tr className="border-b border-white/10">
            <th className="px-3 py-2 text-left">#</th>
            <th className="px-3 py-2 text-left">Equipo</th>
            <th className="px-2 py-2 text-center">PJ</th>
            <th className="px-2 py-2 text-center">PG</th>
            <th className="px-2 py-2 text-center">Pts</th>
            <th className="px-2 py-2 text-center">Sets</th>
            <th className="px-2 py-2 text-center">Games</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((standing) => (
            <tr key={standing.team.id} className="border-b border-white/5 last:border-b-0">
              <td className="px-3 py-2 font-mono font-bold text-tennis-accent">
                {standing.position}
              </td>
              <td className="px-3 py-2 font-bold text-gray-200 whitespace-nowrap">
                {standing.team.teamName}
              </td>
              <td className="px-2 py-2 text-center text-gray-400">{standing.played}</td>
              <td className="px-2 py-2 text-center font-bold text-emerald-400">{standing.won}</td>
              <td className="px-2 py-2 text-center font-bold text-white">{standing.points}</td>
              <td className="px-2 py-2 text-center text-gray-400">
                {standing.setsWon}-{standing.setsLost}
              </td>
              <td className="px-2 py-2 text-center text-gray-400">
                {standing.gamesWon}-{standing.gamesLost}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DoublesMatchMiniCard({ match }: { match: DoublesMatch }) {
  const isPlayed = match.status === DoublesMatchStatus.played;
  const team1Winner = match.winnerId === match.team1?.id;
  const team2Winner = match.winnerId === match.team2?.id;
  const score = [...(match.sets || [])]
    .sort((a, b) => a.setNumber - b.setNumber)
    .map((set) => `${set.team1Score}-${set.team2Score}`)
    .join(" ");

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-xs">
        <span className={`font-bold text-right ${team1Winner ? "text-tennis-accent" : "text-gray-300"}`}>
          <TeamName name={match.team1?.teamName || "TBD"} />
        </span>
        <span className="min-w-[58px] text-center font-mono text-[11px] font-bold text-gray-500">
          {isPlayed ? score || "Jugado" : "vs"}
        </span>
        <span className={`font-bold ${team2Winner ? "text-tennis-accent" : "text-gray-300"}`}>
          <TeamName name={match.team2?.teamName || "BYE"} />
        </span>
      </div>
    </div>
  );
}

function PublicBracket({ matches }: { matches: DoublesMatch[] }) {
  if (matches.length === 0) {
    return (
      <EmptyState
        icon={<Trophy className="w-12 h-12 text-white/5" />}
        text="No hay partidos de llaves"
      />
    );
  }

  const roundOrder = DOUBLES_PLAYOFF_ROUNDS.map((round) => round.value);
  const groups = new Map<string, DoublesMatch[]>();

  matches.forEach((match) => {
    const round = match.round || "Sin Ronda";
    if (!groups.has(round)) groups.set(round, []);
    groups.get(round)!.push(match);
  });

  const rounds = Array.from(groups.entries()).sort(([a], [b]) => {
    const aIdx = roundOrder.indexOf(a);
    const bIdx = roundOrder.indexOf(b);
    return (aIdx === -1 ? 999 : aIdx) - (bIdx === -1 ? 999 : bIdx);
  });

  return (
    <div className="relative overflow-x-auto pb-4 no-scrollbar">
      <div className="flex items-start gap-12 min-w-max px-1">
        {rounds.map(([round, roundMatches], roundIdx) => (
          <div key={round} className="flex flex-col gap-4 min-w-[220px]">
            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] text-center">
              {round === "Sin Ronda" ? round : getPlayoffRoundLabel(round)}
            </h4>
            <div className="flex flex-col gap-6">
              {[...roundMatches]
                .sort((a, b) => (a.positionInBracket || 0) - (b.positionInBracket || 0))
                .map((match) => (
                  <div key={match.id} className="relative">
                    <BracketMatchCard match={match} />
                    {roundIdx < rounds.length - 1 && (
                      <div className="absolute left-full top-1/2 hidden h-px w-12 bg-white/10 md:block" />
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BracketMatchCard({ match }: { match: DoublesMatch }) {
  const isPlayed = match.status === DoublesMatchStatus.played;
  const team1Winner = isPlayed && match.winnerId === match.team1?.id;
  const team2Winner = isPlayed && match.winnerId === match.team2?.id;

  return (
    <div className="w-56 overflow-hidden rounded-lg border border-white/10 bg-white/5 shadow-lg transition-transform hover:scale-[1.02]">
      <BracketTeamLine
        name={match.team1?.teamName || "TBD"}
        isWinner={team1Winner}
        sets={match.sets.map((set) => set.team1Score)}
      />
      <BracketTeamLine
        name={match.team2?.teamName || "BYE"}
        isWinner={team2Winner}
        sets={match.sets.map((set) => set.team2Score)}
      />
    </div>
  );
}

function BracketTeamLine({
  name,
  isWinner,
  sets,
}: {
  name: string;
  isWinner: boolean;
  sets: number[];
}) {
  return (
    <div className={`flex items-center justify-between gap-2 border-b border-white/10 last:border-b-0 p-3 ${isWinner ? "bg-tennis-accent/10" : ""}`}>
      <div className="flex items-center gap-2 min-w-0">
        <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
        <span className={`text-xs font-bold truncate ${isWinner ? "text-tennis-accent" : "text-gray-300"}`}>
          <TeamName name={name} />
        </span>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {isWinner && <Check className="w-3 h-3 text-tennis-accent" />}
        {sets.length > 0 ? (
          sets.map((score, idx) => (
            <span
              key={idx}
              className={`min-w-4 text-center font-mono text-xs font-bold ${
                isWinner ? "text-tennis-accent" : "text-gray-500"
              }`}
            >
              {score}
            </span>
          ))
        ) : (
          <span className="font-mono text-xs font-bold text-gray-600">-</span>
        )}
      </div>
    </div>
  );
}

function EmptyState({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="py-20 text-center border border-dashed border-white/10 rounded-2xl">
      <div className="mx-auto mb-4 flex justify-center">{icon}</div>
      <p className="text-gray-500 text-sm italic font-medium">{text}</p>
    </div>
  );
}
