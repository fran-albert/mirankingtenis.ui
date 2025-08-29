import axiosInstance from "@/services/axiosConfig";

export const countUserTrophies = async (userId: number): Promise<number> => {
  const response = await axiosInstance.get(`trophy/user/${userId}/trophies-count`);
  return response.data as number;
};