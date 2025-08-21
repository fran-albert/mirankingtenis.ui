import axiosInstance from "@/services/axiosConfig";

export interface ResetPasswordResponse {
  message: string;
  newPassword?: string;
}

export async function resetUserPassword(userId: number): Promise<ResetPasswordResponse> {
  const response = await axiosInstance.post<ResetPasswordResponse>(
    `users/${userId}/reset-password`
  );
  return response.data;
}