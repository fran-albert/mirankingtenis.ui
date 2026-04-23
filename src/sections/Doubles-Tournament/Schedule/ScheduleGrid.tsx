"use client";
import React, { useState } from "react";
import { DoublesMatchStatus } from "@/common/enum/doubles-event.enum";
import { DoublesSchedule, ScheduleMatch, ScheduleTurn } from "@/types/Doubles-Event/DoublesEvent";
import { getPlayoffRoundLabel } from "@/common/constants/doubles-event.constants";

interface ScheduleGridProps {
  schedule: DoublesSchedule;
  onMatchClick?: (match: ScheduleMatch) => void;
}

export function ScheduleGrid({ schedule, onMatchClick }: ScheduleGridProps) {
  const [searchQuery, setSearchQuery] = useState("");

  if (!schedule || (schedule.days.length === 0 && schedule.turns.length === 0)) {
    return (
      <p className="text-gray-500 text-center py-8">
        No hay partidos programados
      </p>
    );
  }

  const { courts, days } = schedule;

  // Fallback: if backend hasn't grouped by days yet, use turns directly
  const effectiveDays =
    days && days.length > 0
      ? days
      : [{ date: "", label: "", turns: schedule.turns }];

  const isMultiDay = effectiveDays.length > 1;

  return (
    <div>
      <div className="mb-3">
        <input
          type="text"
          placeholder="Buscar equipo..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-xs px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400"
        />
      </div>
      {isMultiDay ? (
        <MultiDayGrid
          courts={courts}
          days={effectiveDays}
          searchQuery={searchQuery}
          onMatchClick={onMatchClick}
        />
      ) : (
        <DayTable
          courts={courts}
          turns={effectiveDays[0].turns}
          searchQuery={searchQuery}
          onMatchClick={onMatchClick}
        />
      )}
    </div>
  );
}

function MultiDayGrid({
  courts,
  days,
  searchQuery,
  onMatchClick,
}: {
  courts: { venue: string; name: string }[];
  days: { date: string; label: string; turns: ScheduleTurn[] }[];
  searchQuery: string;
  onMatchClick?: (match: ScheduleMatch) => void;
}) {
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const currentDay = days[selectedDayIdx];

  return (
    <div>
      <div className="flex gap-1 sm:gap-2 mb-4 overflow-x-auto">
        {days.map((day, idx) => (
          <button
            key={day.date}
            onClick={() => setSelectedDayIdx(idx)}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors capitalize whitespace-nowrap ${
              idx === selectedDayIdx
                ? "bg-slate-700 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {day.label}
          </button>
        ))}
      </div>
      <DayTable
        courts={courts}
        turns={currentDay.turns}
        searchQuery={searchQuery}
        onMatchClick={onMatchClick}
      />
    </div>
  );
}

function matchesSearch(match: ScheduleMatch, query: string): boolean {
  if (!query) return false;
  const q = query.toLowerCase();
  return (
    match.team1Name.toLowerCase().includes(q) ||
    match.team2Name.toLowerCase().includes(q)
  );
}

function DayTable({
  courts,
  turns,
  searchQuery,
  onMatchClick,
}: {
  courts: { venue: string; name: string }[];
  turns: ScheduleTurn[];
  searchQuery: string;
  onMatchClick?: (match: ScheduleMatch) => void;
}) {
  const formatTime = (iso: string | null) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "America/Buenos_Aires",
    });
  };

  const categoryColors: Record<string, string> = {};
  const colorPalette = [
    "bg-blue-100 border-blue-300",
    "bg-green-100 border-green-300",
    "bg-yellow-100 border-yellow-300",
    "bg-pink-100 border-pink-300",
    "bg-purple-100 border-purple-300",
    "bg-orange-100 border-orange-300",
  ];
  let colorIdx = 0;

  const getCategoryColor = (catName: string) => {
    if (!categoryColors[catName]) {
      categoryColors[catName] = colorPalette[colorIdx % colorPalette.length];
      colorIdx++;
    }
    return categoryColors[catName];
  };

  const TeamName = ({ name }: { name: string }) => {
    const parts = name.split(" / ");
    if (parts.length <= 1) return <>{name}</>;
    return (
      <>
        {parts.map((p, i) => (
          <span key={i} className="block">{p}</span>
        ))}
      </>
    );
  };

  if (turns.length === 0) {
    return (
      <p className="text-gray-400 text-center py-4 text-sm">
        No hay partidos este día
      </p>
    );
  }

  return (
    <div className="overflow-x-auto -mx-2 px-2">
      <table className="min-w-full border-collapse border border-gray-300 text-[10px] sm:text-xs">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-1 sm:p-2 text-left min-w-[70px] sm:min-w-[100px]">
              Turno
            </th>
            {courts.map((court, i) => (
              <th
                key={i}
                className="border border-gray-300 p-1 sm:p-2 text-center min-w-[110px] sm:min-w-[140px]"
              >
                <div className="font-bold text-[10px] sm:text-xs">{court.venue}</div>
                <div className="text-gray-500 text-[9px] sm:text-[11px]">{court.name}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {turns.map((turn) => (
            <tr key={`${turn.turnNumber}-${turn.startTime || "sin-hora"}`}>
              <td className="border border-gray-300 p-1 sm:p-2 bg-gray-50 font-medium">
                <div>{`T${turn.turnNumber}${turn.isMixed ? " - Mixto" : ""}`}</div>
                <div className="text-gray-500 text-[9px] sm:text-[10px]">
                  {formatTime(turn.startTime)}
                </div>
              </td>
              {turn.slots.map((slot, i) => {
                const isHighlighted =
                  !!searchQuery && !!slot.match && matchesSearch(slot.match, searchQuery);
                const hasWinner = !!slot.match?.winnerTeamNumber;
                const isClickable =
                  !!slot.match &&
                  slot.match.status === DoublesMatchStatus.pending &&
                  !!onMatchClick;

                const content = slot.match ? (
                  <div className={`space-y-0.5 ${isClickable ? "relative min-h-[78px] sm:min-h-[86px]" : ""}`}>
                    {isClickable && (
                      <div className="flex justify-end mb-1">
                        <span className="inline-flex items-center gap-1 rounded-full border border-slate-600 bg-white/80 px-1.5 py-0.5 text-[8px] sm:text-[9px] font-semibold uppercase tracking-wide text-slate-700 shadow-sm">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Editable
                        </span>
                      </div>
                    )}
                    {hasWinner ? (
                      <>
                        <div className={`text-[10px] sm:text-[11px] leading-tight ${
                          slot.match.winnerTeamNumber === 1
                            ? "text-green-700 font-bold"
                            : "text-gray-400"
                        }`}>
                          <TeamName name={slot.match.team1Name} />
                          {slot.match.winnerTeamNumber === 1 && slot.match.score && (
                            <span className="ml-1 text-[9px] sm:text-[10px]">{slot.match.score}</span>
                          )}
                        </div>
                        <div className={`text-[10px] sm:text-[11px] leading-tight ${
                          slot.match.winnerTeamNumber === 2
                            ? "text-green-700 font-bold"
                            : "text-gray-400"
                        }`}>
                          <TeamName name={slot.match.team2Name} />
                          {slot.match.winnerTeamNumber === 2 && slot.match.score && (
                            <span className="ml-1 text-[9px] sm:text-[10px]">{slot.match.score}</span>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-[10px] sm:text-[11px] leading-tight font-medium">
                          <TeamName name={slot.match.team1Name} />
                        </div>
                        <div className="text-gray-400 text-[9px] sm:text-[10px]">vs</div>
                        <div className="text-[10px] sm:text-[11px] leading-tight font-medium">
                          <TeamName name={slot.match.team2Name} />
                        </div>
                      </>
                    )}
                    <div className="text-[8px] sm:text-[9px] text-gray-400">
                      {slot.match.phase === "playoff" && slot.match.round
                        ? `${getPlayoffRoundLabel(slot.match.round)} · ${slot.match.categoryName}`
                        : slot.match.categoryName}
                    </div>
                    {isClickable && (
                      <div className="text-[8px] sm:text-[9px] font-medium text-slate-600">
                        Click para editar
                      </div>
                    )}
                  </div>
                ) : null;

                return (
                  <td
                    key={i}
                    className={`border border-gray-300 p-0.5 sm:p-1 text-center ${
                      slot.match
                        ? getCategoryColor(slot.match.categoryName)
                        : slot.hasTurn
                          ? "bg-slate-50"
                          : "bg-white"
                    } ${isHighlighted ? "ring-2 ring-yellow-400 ring-inset" : ""} ${
                      isClickable
                        ? "cursor-pointer ring-2 ring-slate-500/60 ring-inset shadow-[inset_0_0_0_1px_rgba(255,255,255,0.65)] hover:bg-slate-100"
                        : ""
                    }`}
                  >
                    {isClickable && slot.match ? (
                      <button
                        type="button"
                        className="w-full h-full text-inherit"
                        onClick={() => onMatchClick?.(slot.match!)}
                      >
                        {content}
                      </button>
                    ) : (
                      content
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
