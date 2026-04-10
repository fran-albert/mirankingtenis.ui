import axiosInstance from "@/services/axiosConfig";
import {
  CreateDoublesTurnRequest,
  DoublesTurn,
} from "@/types/Doubles-Event/DoublesEvent";

export const getDoublesTurns = async (eventId: number): Promise<DoublesTurn[]> => {
  const response = await axiosInstance.get(`doubles-events/${eventId}/turns`);
  return response.data as DoublesTurn[];
};

export const createDoublesTurn = async (
  eventId: number,
  data: CreateDoublesTurnRequest
): Promise<DoublesTurn> => {
  const response = await axiosInstance.post(`doubles-events/${eventId}/turns`, data);
  return response.data as DoublesTurn;
};

export const updateDoublesTurn = async (
  id: number,
  data: Partial<CreateDoublesTurnRequest>
): Promise<DoublesTurn> => {
  const response = await axiosInstance.patch(`doubles-turns/${id}`, data);
  return response.data as DoublesTurn;
};

export const deleteDoublesTurn = async (id: number): Promise<void> => {
  await axiosInstance.delete(`doubles-turns/${id}`);
};
