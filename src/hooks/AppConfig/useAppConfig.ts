"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllConfigs, updateConfig, AppConfig } from "@/api/AppConfig/update-config.action";

export const useAppConfigs = (enabled: boolean = true) => {
  const { data, isLoading, isError, error, isFetching } = useQuery<AppConfig[]>({
    queryKey: ['app-configs'],
    queryFn: getAllConfigs,
    staleTime: 1000 * 60 * 5,
    enabled,
  });

  return {
    configs: data || [],
    isLoading,
    isError,
    error,
    isFetching,
  };
};

export const useUpdateConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) =>
      updateConfig(key, value),
    onSuccess: () => {
      // Invalidar ambas queries para que se refresquen los datos
      queryClient.invalidateQueries({ queryKey: ['app-configs'] });
      queryClient.invalidateQueries({ queryKey: ['default-tournaments'] });
    },
  });
};
