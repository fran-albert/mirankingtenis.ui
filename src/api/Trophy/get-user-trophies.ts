import { Trophy, TrophyFilters } from "@/types/Trophy/Trophy";
import axiosInstance from "@/services/axiosConfig";

export const getUserTrophies = async (
  userId: number,
  filters?: TrophyFilters
): Promise<Trophy[]> => {
  const params = new URLSearchParams();
  
  if (filters?.trophyType) {
    params.append('trophyType', filters.trophyType);
  }
  if (filters?.tournamentType) {
    params.append('tournamentType', filters.tournamentType);
  }
  if (filters?.dateFrom) {
    params.append('dateFrom', filters.dateFrom);
  }
  if (filters?.dateTo) {
    params.append('dateTo', filters.dateTo);
  }
  if (filters?.categoryId) {
    params.append('categoryId', filters.categoryId.toString());
  }

  const queryString = params.toString();
  const url = queryString 
    ? `trophy/user/${userId}?${queryString}`
    : `trophy/user/${userId}`;
    
  const response = await axiosInstance.get(url);
  return response.data as Trophy[];
};