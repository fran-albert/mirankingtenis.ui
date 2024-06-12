import create from 'zustand';
import { Category } from '@/modules/category/domain/Category';
import { createApiCategoryRepository } from '@/modules/category/infra/ApiCategoryRepository';

interface CategoryState {
    categories: Category[];
    loading: boolean;
    error: string | null;
    fetchCategories: () => Promise<void>;
}

const categoryRepository = createApiCategoryRepository();

export const useCategoriesStore = create<CategoryState>((set) => ({
    categories: [],
    loading: false,
    error: null,

    fetchCategories: async () => {
        set({ loading: true, error: null });
        try {
            const categories = await categoryRepository.getAllCategories();
            set({ categories, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    }
}));
