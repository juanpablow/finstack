import { budgetApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function useBudget(month: number, year: number) {
  return useQuery({
    queryKey: ["budget", month, year],
    queryFn: () => budgetApi.getSummary(month, year),
  });
}
