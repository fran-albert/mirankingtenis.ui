import { Category } from "@/modules/category/domain/Category";
import { HistoryRanking } from "@/types/History-Ranking/HistoryRanking";
import { Ranking } from "@/modules/ranking/domain/Ranking";
import { State } from "../State/State";
import { City } from "../City/City";

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
    state: State;
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
