import axiosInstance from "@/services/axiosConfig";
import { Category } from "@/modules/category/domain/Category";

export const createCategory = async (newCategory: Category): Promise<Category> => {
    const response = await axiosInstance.post("categories", newCategory);
    return response.data as Category;
};