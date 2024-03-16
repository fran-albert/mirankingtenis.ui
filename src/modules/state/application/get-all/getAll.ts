import { State } from "@/modules/state/domain/State";
import { StateRepository } from "@/modules/state/domain/StateRepository";

export function getAll(stateRepository: StateRepository) {
  return async (): Promise<State[]> => {
    return await stateRepository.getAll();
  };
}
