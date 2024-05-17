import { Court } from "./Court";

export interface CourtRepository {
  getAll: () => Promise<Court[]>;
  createCourt: (court: Court) => Promise<Court>;
  deleteCourt: (id: number) => Promise<string>;
  getTotalCourts: () => Promise<number>;
}
