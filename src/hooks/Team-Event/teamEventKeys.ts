export const teamEventKeys = {
  all: ["team-events"] as const,
  detail: (id: number) => ["team-event", id] as const,
  categories: (eventId: number) =>
    ["team-event-categories", eventId] as const,
  teams: (eventId: number, categoryId: number) =>
    ["team-event-teams", eventId, categoryId] as const,
  series: (eventId: number, categoryId: number) =>
    ["team-event-series", eventId, categoryId] as const,
  seriesDetail: (eventId: number, categoryId: number, seriesId: number) =>
    ["team-event-series", eventId, categoryId, seriesId] as const,
  standings: (eventId: number, categoryId: number) =>
    ["team-event-standings", eventId, categoryId] as const,
  playerStats: (eventId: number, categoryId: number) =>
    ["team-event-player-stats", eventId, categoryId] as const,
};
