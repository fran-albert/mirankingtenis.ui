import { TrophyType } from "@/common/enum/trophy.enum";
import { User } from "@/types/User/User";
import { TournamentCategory } from "@/types/Tournament-Category/TournamentCategory";

export interface Trophy {
  id: number;
  name: string;
  description: string;
  dateWon: string; // ISO date string
  trophyType: TrophyType;
  relatedTournamentId?: number;
  user: User;
  tournamentCategory: TournamentCategory;
}

export interface TrophyStatistics {
  totalTrophies: number;
  totalChampionships: number;
  totalSubChampionships: number;
  masterTrophies: number;
  leagueTrophies: number;
  recentTrophies: Trophy[];
}

export interface UserTrophyCount {
  userId: number;
  userName: string;
  totalTrophies: number;
  championships: number;
  subChampionships: number;
}

export interface TrophyFilters {
  trophyType?: TrophyType;
  tournamentType?: 'master' | 'league';
  dateFrom?: string;
  dateTo?: string;
  categoryId?: number;
}