import { categoriesApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.getAll(),
    staleTime: 1000 * 60 * 60, // 1 hour (categories rarely change)
  });
}
