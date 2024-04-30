import { Category } from "@/modules/category/domain/Category";
import { createApiCategoryRepository } from "@/modules/category/infra/ApiCategoryRepository";
import { create } from "zustand";

interface CategoriesState {
  categories: Category[];
  activeCategory: number;
  setCategories: (categories: Category[]) => void;
  setActiveCategory: (activeCategory: number) => void;
  loadCategories: () => Promise<void>;
}

const useCategoriesStore = create<CategoriesState>((set) => ({
  categories: [],
  activeCategory: 1,
  setCategories: (categories) => set(() => ({ categories })),
  setActiveCategory: (activeCategory) => set(() => ({ activeCategory })),
  loadCategories: async () => {
    const categoryRepository = createApiCategoryRepository();
    const fetchedCategories = await categoryRepository.getAllCategories();
    set({ categories: fetchedCategories });
  },
}));

export default useCategoriesStore;
