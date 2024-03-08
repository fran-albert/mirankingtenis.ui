import { Shift } from "./Shift";

export interface ShiftRepository {
  shiftForMatch: (shift: Shift, idMatch: number) => Promise<Shift | undefined>;
}
