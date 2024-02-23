import { Category } from "./Category";

export interface CategoryRepository {
  getAllCategories: () => Promise<Category[]>;
}
