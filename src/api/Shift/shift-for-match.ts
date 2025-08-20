import axiosInstance from "@/services/axiosConfig";
import { Shift } from "@/types/Shift/Shift";

interface ShiftForMatchRequest {
  idCourt: number;
  startHour: string;
}

export async function shiftForMatch(shift: ShiftForMatchRequest, idMatch: number): Promise<Shift> {
  const response = await axiosInstance.post(
    `shift/forMatch/${idMatch}`,
    shift
  );
  const data = response.data as Shift;
  return data;
}