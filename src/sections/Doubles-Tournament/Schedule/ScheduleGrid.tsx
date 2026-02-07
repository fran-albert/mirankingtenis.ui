"use client";
import React, { useState } from "react";
import { DoublesSchedule, ScheduleTurn } from "@/types/Doubles-Event/DoublesEvent";

interface ScheduleGridProps {
  schedule: DoublesSchedule;
}

export function ScheduleGrid({ schedule }: ScheduleGridProps) {
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

  if (isMultiDay) {
    return <MultiDayGrid courts={courts} days={effectiveDays} />;
  }

  return <DayTable courts={courts} turns={effectiveDays[0].turns} />;
}

function MultiDayGrid({
  courts,
  days,
}: {
  courts: { venue: string; name: string }[];
  days: { date: string; label: string; turns: ScheduleTurn[] }[];
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
      <DayTable courts={courts} turns={currentDay.turns} />
    </div>
  );
}

function DayTable({
  courts,
  turns,
}: {
  courts: { venue: string; name: string }[];
  turns: ScheduleTurn[];
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
            <tr key={turn.turnNumber}>
              <td className="border border-gray-300 p-1 sm:p-2 bg-gray-50 font-medium">
                <div>T{turn.turnNumber}</div>
                <div className="text-gray-500 text-[9px] sm:text-[10px]">
                  {formatTime(turn.startTime)}
                  {turn.endTime && ` - ${formatTime(turn.endTime)}`}
                </div>
              </td>
              {turn.slots.map((slot, i) => (
                <td
                  key={i}
                  className={`border border-gray-300 p-0.5 sm:p-1 text-center ${
                    slot.match
                      ? getCategoryColor(slot.match.categoryName)
                      : "bg-white"
                  }`}
                >
                  {slot.match ? (
                    <div className="space-y-0.5">
                      <div className={`text-[10px] sm:text-[11px] leading-tight ${
                        slot.match.winnerTeamNumber === 1 ? "font-bold" : "font-medium"
                      }`}>
                        {slot.match.team1Name}
                      </div>
                      <div className="text-gray-400 text-[9px] sm:text-[10px]">vs</div>
                      <div className={`text-[10px] sm:text-[11px] leading-tight ${
                        slot.match.winnerTeamNumber === 2 ? "font-bold" : "font-medium"
                      }`}>
                        {slot.match.team2Name}
                      </div>
                      {slot.match.score && (
                        <div className="text-[9px] sm:text-[10px] font-bold text-gray-700 mt-0.5">
                          {slot.match.score}
                        </div>
                      )}
                      <div className="text-[8px] sm:text-[9px] text-gray-400">
                        {slot.match.categoryName}
                      </div>
                    </div>
                  ) : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
