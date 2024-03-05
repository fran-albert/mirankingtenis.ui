import { Fixture } from "@/modules/fixture/domain/Fixture";
import { Sets } from "@/modules/sets/domain/Sets";
import { User } from "@/modules/users/domain/User";
export interface Match {
  id: number;
  idUser1: number | User[] | null;
  idUser2: number | User[] | null;
  result: string;
  user1: User;
  user2: User;
  shift: string;
  user1Name: string;
  user2Name: string;
  sets: Sets[];
  status: string;
  round: number;
  user1Name: string;
  user2Name: string;
  finalResult: string;
  fixture: {
    id: number;
    jornada: number;
  };
  rivalName: string;
}
