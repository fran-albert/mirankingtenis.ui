import { User } from "../User/User";

export interface UserDoubleExpressPointsHistory {
  id?: number;
  user: User;
  points: number;
  reason: string;
  createdAt: Date;
}
