import {
  DoublesEventStatus,
  DoublesMatchStatus,
  DoublesMatchPhase,
} from "@/common/enum/doubles-event.enum";

export interface DoublesEvent {
  id: number;
  name: string;
  description: string | null;
  startDate: string;
  endDate: string | null;
  status: DoublesEventStatus;
  categories: DoublesEventCategory[];
  createdAt: string;
  updatedAt: string;
}

export interface DoublesEventCategory {
  id: number;
  eventId: number;
  name: string;
  gender: string;
  level: string;
  pointsForWin: number;
  pointsForLoss: number;
  pointsForNotPlayed: number;
}

export interface DoublesTeam {
  id: number;
  categoryId: number;
  teamName: string;
  player1Name: string;
  player1Id: number | null;
  player2Name: string;
  player2Id: number | null;
  zoneName: string | null;
}

export interface DoublesMatchSet {
  id: number;
  matchId: number;
  setNumber: number;
  team1Score: number;
  team2Score: number;
}

export interface DoublesMatch {
  id: number;
  categoryId: number;
  team1: DoublesTeam;
  team2: DoublesTeam | null;
  winner: DoublesTeam | null;
  winnerId: number | null;
  status: DoublesMatchStatus;
  phase: DoublesMatchPhase;
  venue: string | null;
  courtName: string | null;
  turnNumber: number | null;
  startTime: string | null;
  endTime: string | null;
  zoneName: string | null;
  round: string | null;
  positionInBracket: number | null;
  sets: DoublesMatchSet[];
}

export interface TeamStanding {
  position: number;
  team: {
    id: number;
    teamName: string;
    player1Name: string;
    player2Name: string;
  };
  played: number;
  won: number;
  lost: number;
  points: number;
  setsWon: number;
  setsLost: number;
  gamesWon: number;
  gamesLost: number;
}

export interface ZoneStanding {
  zoneName: string;
  standings: TeamStanding[];
}

export interface ScheduleMatch {
  id: number;
  team1Name: string;
  team2Name: string;
  categoryName: string;
  phase: string;
  status: string;
  score: string;
  winnerTeamNumber: 1 | 2 | null;
}

export interface ScheduleSlot {
  venue: string;
  courtName: string;
  match: ScheduleMatch | null;
}

export interface ScheduleTurn {
  turnNumber: number;
  startTime: string | null;
  endTime: string | null;
  matchesCount: number;
  slots: ScheduleSlot[];
}

export interface ScheduleDay {
  date: string;
  label: string;
  turns: ScheduleTurn[];
}

export interface DoublesSchedule {
  venues: string[];
  courts: { venue: string; name: string }[];
  turns: ScheduleTurn[];
  days: ScheduleDay[];
}

export interface CreateDoublesEventRequest {
  name: string;
  description?: string;
  startDate: string;
  endDate?: string;
  status?: DoublesEventStatus;
}

export interface CreateDoublesCategoryRequest {
  name: string;
  gender: string;
  level: string;
  pointsForWin?: number;
  pointsForLoss?: number;
  pointsForNotPlayed?: number;
}

export interface CreateDoublesTeamRequest {
  player1Name: string;
  player1Id?: number;
  player2Name: string;
  player2Id?: number;
  teamName?: string;
  zoneName?: string;
}

export interface CreateDoublesMatchRequest {
  team1Id: number;
  team2Id?: number;
  phase: DoublesMatchPhase;
  venue?: string;
  courtName?: string;
  turnNumber?: number;
  startTime?: string;
  endTime?: string;
  zoneName?: string;
  round?: string;
  positionInBracket?: number;
}

export interface UpdateDoublesMatchResultRequest {
  sets: { setNumber: number; team1Score: number; team2Score: number }[];
  winnerId?: number;
}
