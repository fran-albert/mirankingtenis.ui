
import { Court } from "../../domain/Court";
import { CourtRepository } from "../../domain/CourtRepository";

export function createCourt(courtRepository: CourtRepository) {
    return async (newCategory: Court): Promise<Court | undefined> => {
        return await courtRepository.createCourt(newCategory);
    };
}
