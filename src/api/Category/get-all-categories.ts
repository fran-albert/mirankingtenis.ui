import axiosInstance from "@/services/axiosConfig";
import { Category } from "@/modules/category/domain/Category";

export const getAllCategories = async (): Promise<Category[]> => {
    const response = await axiosInstance.get(`categories`);
    return response.data as Category[];
};