import { UserInfoDto } from "../User/UserInfo.dto";

export interface ShiftInfoDto {
  id?: number;
  court?: string;
  startHour?: string;
  endHour?: string;
}

export interface SetInfoDto {
  id: number;
  pointsPlayer1: number;
  pointsPlayer2: number;
  setNumber: number;
  winner: number;
  deletedAt?: Date;
}

export interface FixtureInfoDto {
  id: number;
  jornada: number;
  tournamentCategories?: {
    id: number;
  };
}

export interface PlayoffInfoDto {
  id: number;
  roundType: string;
}

export enum MatchStatus {
  PENDING = "pending",
  PLAYED = "played",
  CANCELLED = "cancelled",
  VICTORY = 'Victoria',
  DEFEAT = 'Derrota',
}

export interface MatchByUserResponseDto {
  id: number;
  user1: UserInfoDto;
  user2?: UserInfoDto | null;
  status: MatchStatus;
  fixture?: FixtureInfoDto | null;
  playoff?: PlayoffInfoDto | null;
  shift?: ShiftInfoDto | null;
  winner?: string;
  sets: SetInfoDto[];
  finalResult: MatchStatus;
  isBye?: boolean;
  message?: string;
}

// Tipo extendido que incluye el rivalName calculado para compatibilidad con componentes existentes
export interface MatchByUserWithRival extends MatchByUserResponseDto {
  rivalName: string;
  // Propiedades adicionales para compatibilidad con componentes existentes
  idUser1?: any;
  idUser2?: any;
  result?: string;
  user2Name?: string;
  round?: number;
  user1Name?: string;
  user1position?: number;
  user1photo?: string;
  user2photo?: string;
  user2position?: number;
  idWinner?: number;
  tournamentCategoryId?: number;
}