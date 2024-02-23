import { City } from "./City";

export interface CityRepository {
  getAllByState: (idState: number) => Promise<City[]>;
}
