import axiosInstance from "@/services/axiosConfig";

export const deleteCategory = async (idCategory: number): Promise<string> => {
    const response = await axiosInstance.delete(`categories/${idCategory}`);
    return response.data;
};