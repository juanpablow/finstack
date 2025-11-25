import { expensesApi } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useExpenses(filters?: {
  month?: number;
  year?: number;
  category_id?: string;
}) {
  return useQuery({
    queryKey: ["expenses", filters],
    queryFn: () => expensesApi.getAll(filters),
  });
}

export function useExpense(id: string) {
  return useQuery({
    queryKey: ["expense", id],
    queryFn: () => expensesApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      category_id: string;
      name: string;
      amount: number;
      month: number;
      year: number;
      description?: string;
    }) => expensesApi.create(data),
    onSuccess: (_data: any, variables: any) => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({
        queryKey: ["budget", variables.month, variables.year],
      });
    },
  });
}

export function useUpdateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      id: string;
      name?: string;
      amount?: number;
      description?: string;
    }) => {
      const { id, ...data } = params;
      return expensesApi.update(id, data);
    },
    onSuccess: (_data: any, variables: any) => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["expense", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["budget"] });
    },
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => expensesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["budget"] });
    },
  });
}
