
import { CourtRepository } from "../../domain/CourtRepository";

export function deleteCourt(courtRepository: CourtRepository) {
    return async (id: number): Promise<string> => {
        return await courtRepository.deleteCourt(id);
    };
}
