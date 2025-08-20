import axiosInstance from "@/services/axiosConfig";

export async function deleteShift(idShift: number): Promise<void> {
  await axiosInstance.delete(`shift/${idShift}`);
}