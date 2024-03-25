import axiosInstance from "@/services/axiosConfig";
import { Shift } from "../domain/Shift";
import { ShiftRepository } from "../domain/ShiftRepository";

export function createApiShiftRepository(): ShiftRepository {
  async function shiftForMatch(shift: Shift, idMatch: number): Promise<Shift> {
    const response = await axiosInstance.post(
      `shift/forMatch/${idMatch}`,
      shift
    );
    const data = response.data as Shift;
    return data;
  }

  async function updateShift(newShift: Shift, idShift: number): Promise<Shift> {
    const response = await axiosInstance.patch(`shift/${idShift}`, newShift);
    const data = response.data as Shift;
    return data;
  }

  async function deleteShift(idShift: number): Promise<void> {
    await axiosInstance.delete(`shift/${idShift}`);
  }

  return {
    shiftForMatch,
    deleteShift,
    updateShift,
  };
}
