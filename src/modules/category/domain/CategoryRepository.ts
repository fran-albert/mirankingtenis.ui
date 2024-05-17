import { Category } from "./Category";

export interface CategoryRepository {
  getAllCategories: () => Promise<Category[]>;
  createCategory: (newCategory: Category) => Promise<Category | undefined>;
  deleteCategory: (id: number) => Promise<string>;
  getTotalCategories: () => Promise<number>;
}
