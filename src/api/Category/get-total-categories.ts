import axiosInstance from "@/services/axiosConfig";
import { Category } from "@/modules/category/domain/Category";

export const getTotalCategories = async (): Promise<number> => {
    const response = await axiosInstance.get(`categories`);
    const categories = response.data as Category[];
    return categories.length;
};