import { Category } from "@/modules/category/domain/Category";
import { City } from "@/modules/city/domain/City";
import { Ranking } from "@/modules/ranking/domain/Ranking";

export interface User {
  id: number;
  name: string;
  lastname: string;
  email: string;
  phone: string;
  photo: string;
  password: string;
  city: City;
  ranking: Ranking;
  role: Array<{
    role: string;
  }>;
  category: Category;
  idCategory: string | number;
  idCity: string | number;
  position?: number;
  rankingInitial: number;
}
