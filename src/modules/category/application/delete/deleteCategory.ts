import { Category } from "../../domain/Category";
import { CategoryRepository } from "../../domain/CategoryRepository";

export function deleteCategory(categoryRepository: CategoryRepository) {
    return async (id: number): Promise<string> => {
        return await categoryRepository.deleteCategory(id);
    };
}
