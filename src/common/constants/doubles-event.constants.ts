export interface DoublesShift {
  turnNumber: number;
  label: string;
  startTime: string;
  endTime: string;
}

export const DOUBLES_SHIFTS: DoublesShift[] = [
  { turnNumber: 1, label: "Turno 1", startTime: "09:00", endTime: "10:30" },
  { turnNumber: 2, label: "Turno 2", startTime: "10:30", endTime: "12:00" },
  { turnNumber: 3, label: "Turno 3", startTime: "14:00", endTime: "15:30" },
  { turnNumber: 4, label: "Turno 4", startTime: "15:30", endTime: "17:00" },
  { turnNumber: 5, label: "Turno 5", startTime: "17:00", endTime: "18:30" },
  { turnNumber: 6, label: "Turno 6", startTime: "18:30", endTime: "20:00" },
  { turnNumber: 7, label: "Turno 7", startTime: "20:00", endTime: "21:30" },
  { turnNumber: 8, label: "Turno 8", startTime: "21:30", endTime: "23:00" },
];

export interface DoublesVenue {
  id: string;
  name: string;
  courts: string[];
}

export const DOUBLES_VENUES: DoublesVenue[] = [
  { id: "la-villa", name: "LA VILLA TENIS CLUB", courts: ["C1", "C2", "C3", "C4"] },
  { id: "firmat-fbc", name: "FIRMAT FBC TENIS", courts: ["C1", "C2", "C3", "C4"] },
];

export interface DoublesZone {
  id: string;
  name: string;
}

export const DOUBLES_ZONES: DoublesZone[] = [
  { id: "zona-1", name: "Zona 1" },
  { id: "zona-2", name: "Zona 2" },
  { id: "zona-3", name: "Zona 3" },
  { id: "zona-4", name: "Zona 4" },
  { id: "zona-5", name: "Zona 5" },
  { id: "zona-6", name: "Zona 6" },
  { id: "zona-7", name: "Zona 7" },
  { id: "zona-8", name: "Zona 8" },
];

export interface DoublesPlayoffRoundOption {
  id: string;
  value: string;
  label: string;
}

export const DOUBLES_PLAYOFF_ROUNDS: DoublesPlayoffRoundOption[] = [
  { id: "roundOf32", value: "roundOf32", label: "32avos de Final" },
  { id: "roundOf16", value: "roundOf16", label: "16avos de Final" },
  { id: "quarterFinals", value: "quarterFinals", label: "Cuartos de Final" },
  { id: "semiFinals", value: "semiFinals", label: "Semifinales" },
  { id: "final", value: "final", label: "Final" },
  { id: "thirdPlace", value: "thirdPlace", label: "3er Puesto" },
];

export function getPlayoffRoundLabel(round: string | null): string {
  if (!round) return "";
  const found = DOUBLES_PLAYOFF_ROUNDS.find((r) => r.value === round);
  return found?.label || round;
}

export interface EventDay {
  date: string; // "YYYY-MM-DD"
  label: string; // "viernes 6/2"
}

export function getEventDays(startDate: string, endDate: string | null): EventDay[] {
  const dayNames = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

  const start = new Date(startDate.split("T")[0] + "T12:00:00");
  const end = endDate ? new Date(endDate.split("T")[0] + "T12:00:00") : start;

  const days: EventDay[] = [];
  const current = new Date(start);

  while (current <= end) {
    const yyyy = current.getFullYear();
    const mm = String(current.getMonth() + 1).padStart(2, "0");
    const dd = String(current.getDate()).padStart(2, "0");
    const dateStr = `${yyyy}-${mm}-${dd}`;
    const label = `${dayNames[current.getDay()]} ${current.getDate()}/${current.getMonth() + 1}`;
    days.push({ date: dateStr, label });
    current.setDate(current.getDate() + 1);
  }

  return days;
}

export function buildDateTime(eventDate: string, time: string): string {
  // Extract just the date part (YYYY-MM-DD) from eventDate
  const dateOnly = eventDate.split("T")[0];
  // Build ISO string directly with the time (treating as Argentina time, UTC-3)
  // We add the timezone offset to ensure it's interpreted correctly
  return `${dateOnly}T${time}:00.000-03:00`;
}
