import axiosInstance from "@/services/axiosConfig";
import { CourtRepository } from "../domain/CourtRepository";
import { Court } from "../domain/Court";

export function createApiCourtRepository(): CourtRepository {
  async function getAll(): Promise<Court[]> {
    const response = await axiosInstance.get(`court`);
    const court = response.data as Court[];
    return court;
  }

  async function getTotalCourts(): Promise<number> {
    const response = await axiosInstance.get(`court`);
    const court = response.data as Court[];
    const totalCourts = court.length;
    return totalCourts;
  }

  async function createCourt(newCourt: Court): Promise<Court> {
    const response = await axiosInstance.post("court", newCourt);
    const c = response.data as Court;
    return c;
  }

  async function deleteCourt(idCourt: number): Promise<string> {
    const response = await axiosInstance.delete(`court/${idCourt}`);
    const court = response.data;
    return court;
  }


  return {
    getAll, createCourt, deleteCourt, getTotalCourts
  };
}
