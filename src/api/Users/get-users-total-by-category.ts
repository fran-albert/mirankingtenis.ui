import axiosInstance from "@/services/axiosConfig";

export const getUsersTotalByCategory = async (idCategory: number) => {
  try {
    const { data } = await axiosInstance.get<number>(`users/by-category/total/${idCategory}`);
    return data;
  } catch (error: any) {
    // Lanzar el error de Axios correctamente para que sea capturado
    throw error || "Error desconocido";
  }
};