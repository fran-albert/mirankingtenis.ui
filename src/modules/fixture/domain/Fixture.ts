import { Category } from "@/modules/category/domain/Category";
import { Match } from "@/modules/match/domain/Match";

export interface Fixture {
  idCategory: number;
  jornada: number;
  matches: { idUser1: number; idUser2: number }[];
}
