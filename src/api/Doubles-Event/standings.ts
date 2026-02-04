import axiosInstance from "@/services/axiosConfig";
import { ZoneStanding } from "@/types/Doubles-Event/DoublesEvent";

export const getDoublesStandingsByCategory = async (
  categoryId: number
): Promise<ZoneStanding[]> => {
  const response = await axiosInstance.get(
    `doubles-event-categories/${categoryId}/standings`
  );
  return response.data as ZoneStanding[];
};

export const getDoublesStandingsByEvent = async (
  eventId: number
): Promise<
  { categoryId: number; categoryName: string; zones: ZoneStanding[] }[]
> => {
  const response = await axiosInstance.get(
    `doubles-events/${eventId}/standings`
  );
  return response.data;
};
