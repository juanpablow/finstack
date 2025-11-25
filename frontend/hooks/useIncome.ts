import { incomeApi } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useIncome(month: number, year: number) {
  return useQuery({
    queryKey: ["income", month, year],
    queryFn: () => incomeApi.get(month, year),
  });
}

export function useSetIncome() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { amount: number; month: number; year: number }) =>
      incomeApi.set(data),
    onSuccess: (_data: any, variables: any) => {
      queryClient.invalidateQueries({
        queryKey: ["income", variables.month, variables.year],
      });
      queryClient.invalidateQueries({
        queryKey: ["budget", variables.month, variables.year],
      });
    },
  });
}
