import axiosInstance from "@/services/axiosConfig";
import {
  DoublesTeam,
  CreateDoublesTeamRequest,
} from "@/types/Doubles-Event/DoublesEvent";

export const getDoublesTeams = async (
  categoryId: number
): Promise<DoublesTeam[]> => {
  const response = await axiosInstance.get(
    `doubles-event-categories/${categoryId}/teams`
  );
  return response.data as DoublesTeam[];
};

export const createDoublesTeam = async (
  categoryId: number,
  data: CreateDoublesTeamRequest
): Promise<DoublesTeam> => {
  const response = await axiosInstance.post(
    `doubles-event-categories/${categoryId}/teams`,
    data
  );
  return response.data as DoublesTeam;
};

export const updateDoublesTeam = async (
  id: number,
  data: Partial<CreateDoublesTeamRequest>
): Promise<DoublesTeam> => {
  const response = await axiosInstance.patch(`doubles-teams/${id}`, data);
  return response.data as DoublesTeam;
};

export const deleteDoublesTeam = async (id: number): Promise<void> => {
  await axiosInstance.delete(`doubles-teams/${id}`);
};
