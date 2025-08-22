import axiosInstance from "@/services/axiosConfig";

export const countFixturesByCategory = async (idCategory: number): Promise<number> => {
    const response = await axiosInstance.get(`fixture/count-fixtures-by-category/${idCategory}`);
    return response.data;
}