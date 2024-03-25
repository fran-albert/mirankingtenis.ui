import { ShiftRepository } from "../../domain/ShiftRepository";

export function deleteShift(shiftRepository: ShiftRepository) {
  return async (id: number): Promise<void> => {
    await shiftRepository.deleteShift(id);
  };
}
