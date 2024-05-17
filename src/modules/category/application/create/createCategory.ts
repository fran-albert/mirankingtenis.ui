import { Category } from "../../domain/Category";
import { CategoryRepository } from "../../domain/CategoryRepository";

export function createCategory(categoryRepository: CategoryRepository) {
    return async (newCategory: Category): Promise<Category | undefined> => {
        return await categoryRepository.createCategory(newCategory);
    };
}
