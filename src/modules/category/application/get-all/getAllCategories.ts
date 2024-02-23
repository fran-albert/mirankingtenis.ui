import { Category } from "../../domain/Category";
import { CategoryRepository } from "../../domain/CategoryRepository";

export function getAllCategories(categoryRepository: CategoryRepository) {
  return async (): Promise<Category[]> => {
    return await categoryRepository.getAllCategories();
  };
}
