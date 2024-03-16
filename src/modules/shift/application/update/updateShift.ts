import { Shift } from "../../domain/Shift";
import { ShiftRepository } from "../../domain/ShiftRepository";

export function updateShift(shiftRepository: ShiftRepository) {
  return async (
    newShift: Shift,
    idShift: number
  ): Promise<Shift | undefined> => {
    return await shiftRepository.updateShift(newShift, idShift);
  };
}
