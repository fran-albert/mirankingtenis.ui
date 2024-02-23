import { City } from "../../domain/City";
import { CityRepository } from "../../domain/CityRepository";

export function getAllCitiesByState(cityRepository: CityRepository, idState: number) {
  return async (): Promise<City[]> => {
    return await cityRepository.getAllByState(idState);
  };
}
