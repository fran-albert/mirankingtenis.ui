import axiosInstance from "@/services/axiosConfig";
import { StateRepository } from "../domain/StateRepository";
import { State } from "../domain/State";

export function createApiStateRepository(): StateRepository {
  async function getAll(): Promise<State[]> {
    const response = await axiosInstance.get("states");
    const states = response.data as State[];
    return states;
  }

  return {
    getAll,
  };
}
