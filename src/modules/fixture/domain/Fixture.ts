import { Category } from "@/modules/category/domain/Category";

export interface Fixture {
  idCategory: number;
  jornada: number;
  matches: { idUser1: number; idUser2: number }[];
}
