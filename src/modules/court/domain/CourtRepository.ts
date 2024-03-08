import { Court } from "./Court";

export interface CourtRepository {
  getAll: () => Promise<Court[]>;
}
