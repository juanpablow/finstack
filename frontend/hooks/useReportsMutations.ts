import { DEFAULT_GOAL_PERCENTAGES } from "@/lib/constants";
import {
  useCreateExpense,
  useDeleteExpense,
  useUpdateExpense,
} from "./useExpenses";
import { useSetMultipleGoals } from "./useGoals";
import { useSetIncome } from "./useIncome";

interface UseReportsMutationsParams {
  selectedMonth: number;
  selectedYear: number;
  categoriesData: any;
  parseCurrencyValue: (value: string) => number;
}

export function useReportsMutations({
  selectedMonth,
  selectedYear,
  categoriesData,
  parseCurrencyValue,
}: UseReportsMutationsParams) {
  const setIncomeMutation = useSetIncome();
  const setGoalsMutation = useSetMultipleGoals();
  const createExpenseMutation = useCreateExpense();
  const updateExpenseMutation = useUpdateExpense();
  const deleteExpenseMutation = useDeleteExpense();

  const handleSetIncome = async (value: string) => {
    const amount = parseCurrencyValue(value);

    if (amount === 0) return;

    try {
      await setIncomeMutation.mutateAsync({
        amount,
        month: selectedMonth,
        year: selectedYear,
      });
    } catch (error) {
      console.error("Error setting income:", error);
    }
  };

  const handleResetGoals = () => {
    if (!categoriesData) return;

    const goals = categoriesData.map((cat: any) => ({
      category_id: cat.id,
      percentage:
        DEFAULT_GOAL_PERCENTAGES[
          cat.name as keyof typeof DEFAULT_GOAL_PERCENTAGES
        ] || 0,
    }));

    setGoalsMutation.mutate({
      goals,
    });
  };

  const handleSaveGoals = (goalPercentages: Record<string, number>) => {
    if (!categoriesData) return;

    const goals = categoriesData.map((cat: any) => ({
      category_id: cat.id,
      percentage: goalPercentages[cat.name] || 0,
    }));

    setGoalsMutation.mutate(
      {
        goals,
      },
      {
        onSuccess: () => {
          alert("Metas salvas com sucesso!");
        },
        onError: (error: any) => {
          alert(`Erro ao salvar metas: ${error.message}`);
        },
      }
    );
  };

  const handleAddExpense = async (
    categoryName: string,
    expenseName: string,
    value: number
  ) => {
    const category = categoriesData?.find((c: any) => c.name === categoryName);
    if (!category) return;

    try {
      await createExpenseMutation.mutateAsync({
        category_id: category.id,
        name: expenseName,
        amount: value,
        month: selectedMonth,
        year: selectedYear,
      });
    } catch (error) {
      console.error("Error adding expense:", error);
      alert("Erro ao adicionar despesa");
    }
  };

  const handleEditExpense = async (id: string, name: string, value: number) => {
    try {
      await updateExpenseMutation.mutateAsync({
        id,
        name,
        amount: value,
      });
    } catch (error) {
      console.error("Error editing expense:", error);
      alert("Erro ao editar despesa");
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      await deleteExpenseMutation.mutateAsync(id);
    } catch (error) {
      console.error("Error deleting expense:", error);
      alert("Erro ao deletar despesa");
    }
  };

  return {
    handleSetIncome,
    handleResetGoals,
    handleSaveGoals,
    handleAddExpense,
    handleEditExpense,
    handleDeleteExpense,
  };
}
