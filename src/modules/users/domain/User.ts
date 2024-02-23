import { Category } from "@/modules/category/domain/Category";
import { Ranking } from "@/modules/ranking/domain/Ranking";

export interface User {
  id: number;
  name: string;
  lastname: string;
  email: string;
  phone: string;
  photo: string;
  password: string;
  gender: string;
  ranking: Ranking;
  role: string;
  category: Category;
  idCategory: number;
  idCity: number;
}
