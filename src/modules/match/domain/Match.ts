import { Fixture } from "@/modules/fixture/domain/Fixture";
import { User } from "@/modules/users/domain/User";
export interface Match {
  id: number;
  idUser1: number | User[] | null;
  idUser2: number | User[] | null;
  result: string;
  user1: User;
  user2: User;
  shift: string;
  round: number;
  fixture: {
    id: number, 
    jornada: number
  }
}
