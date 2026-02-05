"use client";
import React from "react";
import { DoublesSchedule } from "@/types/Doubles-Event/DoublesEvent";

interface ScheduleGridProps {
  schedule: DoublesSchedule;
}

export function ScheduleGrid({ schedule }: ScheduleGridProps) {
  if (!schedule || schedule.turns.length === 0) {
    return (
      <p className="text-gray-500 text-center py-8">
        No hay partidos programados
      </p>
    );
  }

  const { courts, turns } = schedule;

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

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-300 text-xs">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2 text-left min-w-[100px]">
              Turno
            </th>
            {courts.map((court, i) => (
              <th
                key={i}
                className="border border-gray-300 p-2 text-center min-w-[140px]"
              >
                <div className="font-bold">{court.venue}</div>
                <div className="text-gray-500">{court.name}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {turns.map((turn) => (
            <tr key={turn.turnNumber}>
              <td className="border border-gray-300 p-2 bg-gray-50 font-medium">
                <div>T{turn.turnNumber}</div>
                <div className="text-gray-500 text-[10px]">
                  {formatTime(turn.startTime)}
                  {turn.endTime && ` - ${formatTime(turn.endTime)}`}
                </div>
              </td>
              {turn.slots.map((slot, i) => (
                <td
                  key={i}
                  className={`border border-gray-300 p-1 text-center ${
                    slot.match
                      ? getCategoryColor(slot.match.categoryName)
                      : "bg-white"
                  }`}
                >
                  {slot.match ? (
                    <div className="space-y-0.5">
                      <div className="font-medium text-[11px] leading-tight">
                        {slot.match.team1Name}
                      </div>
                      <div className="text-gray-400 text-[10px]">vs</div>
                      <div className="font-medium text-[11px] leading-tight">
                        {slot.match.team2Name}
                      </div>
                      {slot.match.score && (
                        <div className="text-[10px] font-bold text-gray-700 mt-0.5">
                          {slot.match.score}
                        </div>
                      )}
                      <div className="text-[9px] text-gray-400">
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
