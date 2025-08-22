import { Fixture } from "@/types/Fixture/Fixture";
import { Sets } from "@/types/Set/Sets";
import { User } from "@/types/User/User";
import { Shift } from "../Shift/Shift";
export interface Match {
  id: number;
  idUser1: any;
  idUser2: any;
  result: string;
  user1: User;
  user2: User;
  shift: Shift;
  user2Name: string;
  sets: Sets[];
  status: string;
  round: number;
  playoff: {
    id: number;
    roundType: string;
  };
  user1Name: string;
  user1position: number;
  user1photo: string;
  user2photo: string;
  user2position: number;
  finalResult: string;
  fixture: {
    id: number;
    jornada: number;
    tournamentCategories: {
      id: number;
    }
  };
  rivalName: string;
  winner: string;
  tournamentCategoryId?: number;
  idWinner: number;
  isBye: boolean;
}
