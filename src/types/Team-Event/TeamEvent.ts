import {
  TeamEventStatus,
  TeamEventSeriesPhase,
  TeamEventSeriesStatus,
  TeamEventMatchType,
  TeamEventMatchStatus,
  TeamEventMatchSide,
} from "@/common/enum/team-event.enum";

// --- Entities ---

export interface User {
  id: number;
  name: string;
  lastname: string;
  email: string;
  photo: string | null;
}

export interface TeamEventPlayer {
  id: number;
  teamId: number;
  playerId: number;
  player: User;
  joinedAt: string;
  leftAt: string | null;
}

export interface TeamEventTeam {
  id: number;
  categoryId: number;
  name: string;
  captainId: number | null;
  captain: User | null;
  players: TeamEventPlayer[];
  createdAt: string;
}

export interface TeamEventMatch {
  id: number;
  seriesId: number;
  matchType: TeamEventMatchType;
  matchOrder: number;
  homePlayer1: TeamEventPlayer;
  homePlayer1Id: number;
  homePlayer2: TeamEventPlayer | null;
  homePlayer2Id: number | null;
  awayPlayer1: TeamEventPlayer;
  awayPlayer1Id: number;
  awayPlayer2: TeamEventPlayer | null;
  awayPlayer2Id: number | null;
  homeGames: number;
  awayGames: number;
  hasTiebreak: boolean;
  homeTiebreakScore: number | null;
  awayTiebreakScore: number | null;
  winningSide: TeamEventMatchSide | null;
  status: TeamEventMatchStatus;
}

export interface TeamEventSeries {
  id: number;
  categoryId: number;
  roundNumber: number;
  matchday: number;
  homeTeam: TeamEventTeam;
  homeTeamId: number;
  awayTeam: TeamEventTeam;
  awayTeamId: number;
  phase: TeamEventSeriesPhase;
  scheduledWeekStart: string | null;
  scheduledWeekEnd: string | null;
  status: TeamEventSeriesStatus;
  homeMatchesWon: number;
  awayMatchesWon: number;
  winner: TeamEventTeam | null;
  winnerId: number | null;
  matches: TeamEventMatch[];
}

export interface TeamEventCategory {
  id: number;
  eventId: number;
  name: string;
  maxPlayersPerTeam: number;
  teams: TeamEventTeam[];
  series: TeamEventSeries[];
  createdAt: string;
}

export interface TeamEvent {
  id: number;
  name: string;
  description: string | null;
  startDate: string;
  endDate: string | null;
  status: TeamEventStatus;
  rounds: number;
  singlesPerSeries: number;
  doublesPerSeries: number;
  gamesPerMatch: number;
  noAdvantage: boolean;
  maxSinglesPerPlayerRegular: number;
  categories: TeamEventCategory[];
  createdAt: string;
  updatedAt: string;
}

// --- Standings ---

export interface TeamStandingResponse {
  position: number;
  teamId: number;
  teamName: string;
  matchesPlayed: number;
  matchesWon: number;
  matchesLost: number;
  matchDiff: number;
  gamesFor: number;
  gamesAgainst: number;
  gamesDiff: number;
  seriesPlayed: number;
  seriesWon: number;
  seriesLost: number;
}

export interface PlayerStatsResponse {
  playerId: number;
  playerName: string;
  teamId: number;
  teamName: string;
  totalPlayed: number;
  singlesPlayed: number;
  doublesPlayed: number;
  won: number;
  lost: number;
  gamesFor: number;
  gamesAgainst: number;
  seriesRested: number;
}

// --- Requests ---

export interface CreateTeamEventRequest {
  name: string;
  description?: string;
  startDate: string;
  endDate?: string;
  status?: TeamEventStatus;
  rounds?: number;
  singlesPerSeries?: number;
  doublesPerSeries?: number;
  gamesPerMatch?: number;
  noAdvantage?: boolean;
  maxSinglesPerPlayerRegular?: number;
}

export interface CreateTeamEventCategoryRequest {
  name: string;
  maxPlayersPerTeam?: number;
}

export interface UpdateTeamEventCategoryRequest {
  name?: string;
  maxPlayersPerTeam?: number;
}

export interface CreateTeamRequest {
  name: string;
  captainId?: number;
}

export interface AddPlayerRequest {
  playerId: number;
}

export interface ReplacePlayerRequest {
  newPlayerId: number;
}

export interface MatchResultRequest {
  matchType: TeamEventMatchType;
  homePlayer1Id: number;
  homePlayer2Id?: number;
  awayPlayer1Id: number;
  awayPlayer2Id?: number;
  homeGames: number;
  awayGames: number;
  hasTiebreak?: boolean;
  homeTiebreakScore?: number;
  awayTiebreakScore?: number;
}

export interface LoadSeriesResultRequest {
  matches: MatchResultRequest[];
}

export interface FinalizeEventRequest {
  team1Id: number;
  team2Id: number;
}

export interface SetLineupMatchRequest {
  matchType: TeamEventMatchType;
  homePlayer1Id: number;
  homePlayer2Id?: number;
  awayPlayer1Id: number;
  awayPlayer2Id?: number;
}

export interface SetLineupRequest {
  matches: SetLineupMatchRequest[];
}

export interface LoadMatchScoreRequest {
  homeGames: number;
  awayGames: number;
  hasTiebreak?: boolean;
  homeTiebreakScore?: number;
  awayTiebreakScore?: number;
}
