import { Shift } from "../../domain/Shift";
import { ShiftRepository } from "../../domain/ShiftRepository";

export function shiftForMatch(shiftRepository: ShiftRepository) {
  return async (shift: Shift, idMatch: number): Promise<Shift | undefined> => {
    return await shiftRepository.shiftForMatch(shift, idMatch);
  };
}
