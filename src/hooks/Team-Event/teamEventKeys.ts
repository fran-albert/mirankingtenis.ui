export const teamEventKeys = {
  all: ["team-events"] as const,
  detail: (id: number) => ["team-event", id] as const,
  teams: (eventId: number) => ["team-event-teams", eventId] as const,
  series: (eventId: number) => ["team-event-series", eventId] as const,
  seriesDetail: (eventId: number, seriesId: number) =>
    ["team-event-series", eventId, seriesId] as const,
  standings: (eventId: number) => ["team-event-standings", eventId] as const,
  playerStats: (eventId: number) =>
    ["team-event-player-stats", eventId] as const,
};
