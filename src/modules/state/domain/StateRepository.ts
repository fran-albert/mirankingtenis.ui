import { State } from "./State";

export interface StateRepository {
  getAll: () => Promise<State[]>;
}
