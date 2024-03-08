import { CityRepository } from "../domain/CityRepository";
import { City } from "../domain/City";
import axiosInstance from "@/services/axiosConfig";

export function createApiCityRepository(): CityRepository {
  async function getAllByState(idState: number): Promise<City[]> {
    const response = await axiosInstance.get(`cities/byState/${idState}`);
    const cities = response.data as City[];
    return cities;
  }

  return {
    getAllByState,
  };
}
