import { Fixture } from "@/modules/fixture/domain/Fixture";
import { Sets } from "@/modules/sets/domain/Sets";
import { Shift } from "@/modules/shift/domain/Shift";
import { User } from "@/modules/users/domain/User";
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
  idWinner: number;
}
