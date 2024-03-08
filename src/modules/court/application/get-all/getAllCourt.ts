import { Court } from "../../domain/Court";
import { CourtRepository } from "../../domain/CourtRepository";

export function getAll(courtRepository : CourtRepository) {
  return async (): Promise<Court[]> => {
    return await courtRepository.getAll();
  };
}
 