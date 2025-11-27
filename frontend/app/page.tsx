"use client";

import { WelcomeCard } from "@/components/dashboard/WelcomeCard";
import { LoadingState } from "@/components/layout/LoadingState";
import { PageLayout } from "@/components/layout/PageLayout";
import { BudgetView } from "@/components/reports/BudgetView";
import { CategoryButtons } from "@/components/reports/CategoryButtons";
import { CategoryCard } from "@/components/reports/CategoryCard";
import { GoalsView } from "@/components/reports/GoalsView";
import { IncomeDisplay } from "@/components/reports/IncomeDisplay";
import { MonthSelector } from "@/components/reports/MonthSelector";
import { TabNavigation } from "@/components/reports/TabNavigation";
import { useCurrencyFormat } from "@/hooks/useCurrencyFormat";
import { useMonthNavigation } from "@/hooks/useMonthNavigation";
import { useReportsData } from "@/hooks/useReportsData";
import { useReportsMutations } from "@/hooks/useReportsMutations";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useMemo, useState, useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);
  const { formatCurrency, parseCurrencyValue } = useCurrencyFormat();
  const { selectedMonth, selectedYear, handlePreviousMonth, handleNextMonth } =
    useMonthNavigation();
  const [activeTab, setActiveTab] = useState<"budget" | "goals">("budget");
  const [activeCategory, setActiveCategory] = useState("Gastos fixos");
  const [monthlyIncome, setMonthlyIncome] = useState("R$ 0,00");

  const {
    categoriesData,
    categoriesLoading,
    incomeLoading,
    categories,
    categoryColors,
    goalPercentages,
    categoryExpenses,
  } = useReportsData({
    selectedMonth,
    selectedYear,
    formatCurrency,
    setMonthlyIncome,
  });

  const {
    handleSetIncome,
    handleResetGoals,
    handleSaveGoals,
    handleAddExpense,
    handleEditExpense,
    handleDeleteExpense,
  } = useReportsMutations({
    selectedMonth,
    selectedYear,
    categoriesData,
    parseCurrencyValue,
  });

  // Calculate total expenses for welcome card
  const totalExpenses = useMemo(() => {
    return Object.values(categoryExpenses).reduce(
      (sum, expenses) =>
        sum + expenses.reduce((expSum, exp) => expSum + exp.value, 0),
      0
    );
  }, [categoryExpenses]);

  // Get user name from session
  const userName =
    session?.user?.name || session?.user?.email?.split("@")[0] || "Usuário";

  // Loading state - show loading while checking authentication
  if (status === "loading" || categoriesLoading || incomeLoading) {
    return <LoadingState />;
  }

  // Don't render anything if not authenticated (middleware will redirect)
  if (status === "unauthenticated") {
    return null;
  }

  return (
    <PageLayout>
      {/* Welcome Card */}
      <div className="mb-8">
        <WelcomeCard
          name={userName}
          monthlyIncome={parseCurrencyValue(monthlyIncome)}
          monthlyExpenses={totalExpenses}
        />
      </div>

      {/* Top Section */}
      <div className="mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {/* Month Selector - Only on Budget */}
          {activeTab === "budget" ? (
            <div className="flex justify-center lg:justify-start">
              <MonthSelector
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                onPreviousMonth={handlePreviousMonth}
                onNextMonth={handleNextMonth}
              />
            </div>
          ) : (
            <div></div>
          )}

          {/* Income Display - Only on Budget */}
          {activeTab === "budget" ? (
            <div className="flex justify-center">
              <IncomeDisplay
                monthlyIncome={monthlyIncome}
                isLoading={incomeLoading}
                onSaveIncome={handleSetIncome}
                formatCurrency={formatCurrency}
                parseCurrencyValue={parseCurrencyValue}
              />
            </div>
          ) : (
            <div></div>
          )}

          {/* Tab Navigation - Always in same position */}
          <div className="flex justify-center lg:justify-end">
            <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
        </div>
      </div>

      {/* Section Headers */}
      {activeTab === "budget" && (
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Orçamento</h2>
          <p className="text-gray-600">
            Acompanhe seus gastos e veja quanto ainda pode gastar em cada
            categoria
          </p>
        </div>
      )}

      {activeTab === "goals" && (
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Metas</h2>
          <p className="text-gray-600">
            Edite os itens abaixo para ajustar as suas metas
          </p>
        </div>
      )}

      {/* Main Content - Conditional Rendering */}
      {activeTab === "budget" ? (
        <BudgetView
          categories={categories}
          categoryColors={categoryColors}
          monthlyIncome={parseCurrencyValue(monthlyIncome)}
          goalPercentages={goalPercentages}
          categoryExpenses={categoryExpenses}
        />
      ) : (
        <GoalsView
          categories={categories}
          categoryColors={categoryColors}
          goalPercentages={goalPercentages}
          monthlyIncome={parseCurrencyValue(monthlyIncome)}
          onGoalPercentageChange={() => {}}
          onReset={handleResetGoals}
          onSave={() => handleSaveGoals(goalPercentages)}
        />
      )}

      {/* Category Action Buttons */}
      {activeTab === "budget" && (
        <>
          <CategoryButtons
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />

          {/* Bottom Section - Dynamic Category Card */}
          <CategoryCard
            categoryName={activeCategory}
            expenses={categoryExpenses[activeCategory] || []}
            onAddExpense={(name, value) =>
              handleAddExpense(activeCategory, name, value)
            }
            onEditExpense={(id, name, value) =>
              handleEditExpense(id, name, value)
            }
            onDeleteExpense={(id) => handleDeleteExpense(id)}
          />
        </>
      )}
    </PageLayout>
  );
}
