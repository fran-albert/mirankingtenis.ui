import { Shift } from "./Shift";

export interface ShiftRepository {
  shiftForMatch: (shift: Shift, idMatch: number) => Promise<Shift | undefined>;
  updateShift: (newShift: Shift, idShift: number) => Promise<Shift | undefined>;
  deleteShift: (idShift: number) => Promise<void>;
}
