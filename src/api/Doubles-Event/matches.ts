import axiosInstance from "@/services/axiosConfig";
import {
  DoublesMatch,
  CreateDoublesMatchRequest,
  UpdateDoublesMatchResultRequest,
} from "@/types/Doubles-Event/DoublesEvent";

export const getDoublesMatches = async (
  categoryId: number
): Promise<DoublesMatch[]> => {
  const response = await axiosInstance.get(
    `doubles-event-categories/${categoryId}/matches`
  );
  return response.data as DoublesMatch[];
};

export const getDoublesZoneMatches = async (
  categoryId: number
): Promise<DoublesMatch[]> => {
  const response = await axiosInstance.get(
    `doubles-event-categories/${categoryId}/matches/zone`
  );
  return response.data as DoublesMatch[];
};

export const getDoublesPlayoffMatches = async (
  categoryId: number
): Promise<DoublesMatch[]> => {
  const response = await axiosInstance.get(
    `doubles-event-categories/${categoryId}/matches/playoff`
  );
  return response.data as DoublesMatch[];
};

export const createDoublesMatch = async (
  categoryId: number,
  data: CreateDoublesMatchRequest
): Promise<DoublesMatch> => {
  const response = await axiosInstance.post(
    `doubles-event-categories/${categoryId}/matches`,
    data
  );
  return response.data as DoublesMatch;
};

export const updateDoublesMatch = async (
  id: number,
  data: Partial<CreateDoublesMatchRequest>
): Promise<DoublesMatch> => {
  const response = await axiosInstance.patch(`doubles-matches/${id}`, data);
  return response.data as DoublesMatch;
};

export const updateDoublesMatchResult = async (
  id: number,
  data: UpdateDoublesMatchResultRequest
): Promise<DoublesMatch> => {
  const response = await axiosInstance.patch(
    `doubles-matches/${id}/result`,
    data
  );
  return response.data as DoublesMatch;
};

export const deleteDoublesMatch = async (id: number): Promise<void> => {
  await axiosInstance.delete(`doubles-matches/${id}`);
};
