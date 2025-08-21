import axiosInstance from "@/services/axiosConfig";
import { Shift } from "@/types/Shift/Shift";

export async function updateShift(newShift: Shift, idShift: number): Promise<Shift> {
  const response = await axiosInstance.patch(`shift/${idShift}`, newShift);
  const data = response.data as Shift;
  return data;
}