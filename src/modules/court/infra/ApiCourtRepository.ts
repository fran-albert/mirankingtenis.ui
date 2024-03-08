import axiosInstance from "@/services/axiosConfig";
import { CourtRepository } from "../domain/CourtRepository";
import { Court } from "../domain/Court";

export function createApiCourtRepository(): CourtRepository {
  async function getAll(): Promise<Court[]> {
    const response = await axiosInstance.get(`court`);
    const court = response.data as Court[];
    return court;
  }

  return {
    getAll,
  };
}
