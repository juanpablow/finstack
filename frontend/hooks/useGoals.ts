import { goalsApi } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGoals() {
  return useQuery({
    queryKey: ["goals"],
    queryFn: () => goalsApi.getAll(),
  });
}

export function useSetGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { category_id: string; percentage: number }) =>
      goalsApi.set(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["goals"],
      });
      queryClient.invalidateQueries({
        queryKey: ["budget"],
      });
    },
  });
}

export function useSetMultipleGoals() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      goals: Array<{ category_id: string; percentage: number }>;
    }) => goalsApi.setMultiple(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["goals"],
      });
      queryClient.invalidateQueries({
        queryKey: ["budget"],
      });
    },
  });
}
