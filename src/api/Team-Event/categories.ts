import axiosInstance from "@/services/axiosConfig";
import {
  TeamEventCategory,
  CreateTeamEventCategoryRequest,
  UpdateTeamEventCategoryRequest,
} from "@/types/Team-Event/TeamEvent";

export const getCategoriesByEvent = async (
  eventId: number
): Promise<TeamEventCategory[]> => {
  const response = await axiosInstance.get(
    `team-events/${eventId}/categories`
  );
  return response.data as TeamEventCategory[];
};

export const getCategory = async (
  eventId: number,
  categoryId: number
): Promise<TeamEventCategory> => {
  const response = await axiosInstance.get(
    `team-events/${eventId}/categories/${categoryId}`
  );
  return response.data as TeamEventCategory;
};

export const createCategory = async (
  eventId: number,
  data: CreateTeamEventCategoryRequest
): Promise<TeamEventCategory> => {
  const response = await axiosInstance.post(
    `team-events/${eventId}/categories`,
    data
  );
  return response.data as TeamEventCategory;
};

export const updateCategory = async (
  eventId: number,
  categoryId: number,
  data: UpdateTeamEventCategoryRequest
): Promise<TeamEventCategory> => {
  const response = await axiosInstance.patch(
    `team-events/${eventId}/categories/${categoryId}`,
    data
  );
  return response.data as TeamEventCategory;
};

export const deleteCategory = async (
  eventId: number,
  categoryId: number
): Promise<void> => {
  await axiosInstance.delete(
    `team-events/${eventId}/categories/${categoryId}`
  );
};
