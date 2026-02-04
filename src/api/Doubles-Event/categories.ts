import axiosInstance from "@/services/axiosConfig";
import {
  DoublesEventCategory,
  CreateDoublesCategoryRequest,
} from "@/types/Doubles-Event/DoublesEvent";

export const getDoublesCategories = async (
  eventId: number
): Promise<DoublesEventCategory[]> => {
  const response = await axiosInstance.get(
    `doubles-events/${eventId}/categories`
  );
  return response.data as DoublesEventCategory[];
};

export const createDoublesCategory = async (
  eventId: number,
  data: CreateDoublesCategoryRequest
): Promise<DoublesEventCategory> => {
  const response = await axiosInstance.post(
    `doubles-events/${eventId}/categories`,
    data
  );
  return response.data as DoublesEventCategory;
};

export const updateDoublesCategory = async (
  id: number,
  data: Partial<CreateDoublesCategoryRequest>
): Promise<DoublesEventCategory> => {
  const response = await axiosInstance.patch(
    `doubles-event-categories/${id}`,
    data
  );
  return response.data as DoublesEventCategory;
};

export const deleteDoublesCategory = async (id: number): Promise<void> => {
  await axiosInstance.delete(`doubles-event-categories/${id}`);
};
