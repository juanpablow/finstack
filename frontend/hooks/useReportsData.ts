import { CATEGORY_ICONS } from "@/lib/constants";
import { Category } from "@/types/reports";
import { Home } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useBudget } from "./useBudget";
import { useCategories } from "./useCategories";
import { useExpenses } from "./useExpenses";
import { useGoals } from "./useGoals";
import { useIncome } from "./useIncome";

interface UseReportsDataParams {
  selectedMonth: number;
  selectedYear: number;
  formatCurrency: (value: string) => string;
  setMonthlyIncome: (value: string) => void;
}

export function useReportsData({
  selectedMonth,
  selectedYear,
  formatCurrency,
  setMonthlyIncome,
}: UseReportsDataParams) {
  const { data: categoriesData, isLoading: categoriesLoading } =
    useCategories();
  const { data: incomeData, isLoading: incomeLoading } = useIncome(
    selectedMonth,
    selectedYear
  );
  const { data: goalsData } = useGoals();
  const { data: budgetData } = useBudget(selectedMonth, selectedYear);
  const { data: expensesData } = useExpenses({
    month: selectedMonth,
    year: selectedYear,
  });

  // Sync income from API
  useEffect(() => {
    if (incomeData) {
      const amountInCents = (incomeData.amount * 100).toString();
      setMonthlyIncome(formatCurrency(amountInCents));
    }
  }, [incomeData, formatCurrency, setMonthlyIncome]);

  // Goal percentages from API
  const goalPercentages = useMemo(() => {
    if (!goalsData || !categoriesData) return {};

    const percentages: Record<string, number> = {};
    categoriesData.forEach((cat: any) => {
      const goal = goalsData.find((g: any) => g.category_id === cat.id);
      percentages[cat.name] = goal?.percentage || 0;
    });
    return percentages;
  }, [goalsData, categoriesData]);

  // Category expenses from API
  const categoryExpenses = useMemo(() => {
    if (!expensesData || !categoriesData) return {};

    const expenses: Record<
      string,
      Array<{ id: string; name: string; value: number }>
    > = {};
    categoriesData.forEach((cat: any) => {
      const catExpenses = expensesData
        .filter((exp: any) => exp.category_id === cat.id)
        .map((exp: any) => ({
          id: exp.id,
          name: exp.expense_name,
          value: exp.amount,
        }));
      expenses[cat.name] = catExpenses;
    });
    return expenses;
  }, [expensesData, categoriesData]);

  // Map categories from API to UI format
  const categories: Category[] = useMemo(() => {
    if (!categoriesData || !budgetData) return [];

    return categoriesData.map((cat: any) => {
      const budget = budgetData.find((b: any) => b.category_id === cat.id);
      return {
        name: cat.name,
        budget: budget?.budget_amount || 0,
        spent: budget?.spent_amount || 0,
        remaining: budget?.remaining_amount || 0,
        used: budget?.used_percentage
          ? `${budget.used_percentage.toFixed(2)}%`
          : "0.00%",
        total: budget?.goal_percentage
          ? `${budget.goal_percentage.toFixed(2)}%`
          : "0.00%",
        icon: CATEGORY_ICONS[cat.name as keyof typeof CATEGORY_ICONS] || Home,
        color: cat.color,
      };
    });
  }, [categoriesData, budgetData]);

  const categoryColors: Record<string, string> = useMemo(() => {
    if (!categoriesData) return {};

    const colors: Record<string, string> = {};
    categoriesData.forEach((cat: any) => {
      colors[cat.name] = cat.color;
    });
    return colors;
  }, [categoriesData]);

  return {
    categoriesData,
    categoriesLoading,
    incomeLoading,
    categories,
    categoryColors,
    goalPercentages,
    categoryExpenses,
  };
}
