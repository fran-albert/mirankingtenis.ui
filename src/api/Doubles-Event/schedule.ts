import axiosInstance from "@/services/axiosConfig";
import { DoublesSchedule } from "@/types/Doubles-Event/DoublesEvent";

export const getDoublesSchedule = async (
  eventId: number
): Promise<DoublesSchedule> => {
  const response = await axiosInstance.get(
    `doubles-events/${eventId}/schedule`
  );
  return response.data as DoublesSchedule;
};
