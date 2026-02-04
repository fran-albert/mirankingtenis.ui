import axiosInstance from "@/services/axiosConfig";
import {
  DoublesEvent,
  CreateDoublesEventRequest,
} from "@/types/Doubles-Event/DoublesEvent";

export const getAllDoublesEvents = async (): Promise<DoublesEvent[]> => {
  const response = await axiosInstance.get("doubles-events");
  return response.data as DoublesEvent[];
};

export const getDoublesEvent = async (id: number): Promise<DoublesEvent> => {
  const response = await axiosInstance.get(`doubles-events/${id}`);
  return response.data as DoublesEvent;
};

export const createDoublesEvent = async (
  data: CreateDoublesEventRequest
): Promise<DoublesEvent> => {
  const response = await axiosInstance.post("doubles-events", data);
  return response.data as DoublesEvent;
};

export const updateDoublesEvent = async (
  id: number,
  data: Partial<CreateDoublesEventRequest>
): Promise<DoublesEvent> => {
  const response = await axiosInstance.patch(`doubles-events/${id}`, data);
  return response.data as DoublesEvent;
};

export const deleteDoublesEvent = async (id: number): Promise<void> => {
  await axiosInstance.delete(`doubles-events/${id}`);
};
