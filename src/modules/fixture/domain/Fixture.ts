import { GroupMatchesDto } from "@/common/types/group-matches.dto";

export interface Fixture {
  idCategory?: number;
  jornada: number;
  matches?: { idUser1: number; idUser2: number }[];
  idTournamentCategory?: number;
  groupMatches?: GroupMatchesDto[];
}
