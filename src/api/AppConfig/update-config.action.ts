import axiosInstance from "@/services/axiosConfig";

export interface AppConfig {
  id: number;
  key: string;
  value: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export const updateConfig = async (key: string, value: string): Promise<AppConfig> => {
  const { data } = await axiosInstance.patch<AppConfig>(`app-config/${key}`, { value });
  return data;
};

export const getAllConfigs = async (): Promise<AppConfig[]> => {
  const { data } = await axiosInstance.get<AppConfig[]>('app-config');
  return data;
};
