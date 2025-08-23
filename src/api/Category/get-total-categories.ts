import axiosInstance from "@/services/axiosConfig";
import { Category } from "@/types/Category/Category";

export const getTotalCategories = async (): Promise<number> => {
    const response = await axiosInstance.get(`categories`);
    const categories = response.data as Category[];
    return categories.length;
};