import { Category } from "@/modules/category/domain/Category";
import { City } from "@/modules/city/domain/City";
import { HistoryRanking } from "@/modules/historyRanking/domain/HistoryRanking";
import { Ranking } from "@/modules/ranking/domain/Ranking";

export interface User {
  id: number;
  name: string;
  lastname: string;
  email: string;
  phone: string;
  gender: string
  photo: string;
  password: string;
  registerDate: string;
  lastLoginDate: string;
  isActive: boolean;
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
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
  signupDate: Date;
  idPlayer: number;
  user2name: string;
  user1name: string;
}
