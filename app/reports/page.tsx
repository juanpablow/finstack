"use client"

import { useState } from "react"
import { Header } from "@/components/layout/Header"
import { Home, AlertCircle, Check, Layers, Car, Heart } from "lucide-react"
import { BudgetView } from "@/components/reports/BudgetView"
import { GoalsView } from "@/components/reports/GoalsView"
import { CategoryButtons } from "@/components/reports/CategoryButtons"
import { CategoryCard } from "@/components/reports/CategoryCard"
import { Category } from "@/types/reports"
import { useCurrencyFormat } from "@/hooks/useCurrencyFormat"

export default function ReportsPage() {
  const { formatCurrency, parseCurrencyValue } = useCurrencyFormat()
  const [selectedMonth] = useState("November/2025")
  const [activeTab, setActiveTab] = useState<"budget" | "goals">("budget")
  const [activeCategory, setActiveCategory] = useState("Gastos fixos")
  const [monthlyIncome, setMonthlyIncome] = useState("R$ 0,00")
  const [isEditingIncome, setIsEditingIncome] = useState(false)
  
  const defaultGoalPercentages = {
    "Gastos fixos": 40,
    "Conforto": 10,
    "Prazeres": 10,
    "Liberdade": 25,
    "Conhecimento": 5,
    "Emergências": 10,
  }
  
  const [goalPercentages, setGoalPercentages] = useState(defaultGoalPercentages)
  
  const [categoryExpenses, setCategoryExpenses] = useState<Record<string, Array<{ id: string; name: string; value: number }>>>({
    "Gastos fixos": [],
    "Emergências": [],
    "Liberdade": [],
    "Conhecimento": [],
    "Conforto": [],
    "Prazeres": [],
  })

  const handleResetGoals = () => {
    setGoalPercentages(defaultGoalPercentages)
  }

  const handleSaveGoals = () => {
    // TODO: Implement save to database/localStorage
    alert("Metas salvas com sucesso!")
  }

  const handleAddExpense = (categoryName: string, expenseName: string, value: number) => {
    const newExpense = {
      id: Date.now().toString(),
      name: expenseName,
      value: value,
    }
    setCategoryExpenses(prev => ({
      ...prev,
      [categoryName]: [...prev[categoryName], newExpense],
    }))
  }

  const handleEditExpense = (categoryName: string, id: string, name: string, value: number) => {
    setCategoryExpenses(prev => ({
      ...prev,
      [categoryName]: prev[categoryName].map(exp => 
        exp.id === id ? { ...exp, name, value } : exp
      ),
    }))
  }

  const handleDeleteExpense = (categoryName: string, id: string) => {
    setCategoryExpenses(prev => ({
      ...prev,
      [categoryName]: prev[categoryName].filter(exp => exp.id !== id),
    }))
  }

  const categories: Category[] = [
    { name: "Gastos fixos", budget: 0, spent: 0, remaining: 0, used: "0.00%", total: "0.00%", icon: Home, color: "#1B4965" },
    { name: "Emergências", budget: 0, spent: 0, remaining: 0, used: "0.00%", total: "0.00%", icon: AlertCircle, color: "#E23B1D" },
    { name: "Liberdade", budget: 0, spent: 0, remaining: 0, used: "0.00%", total: "0.00%", icon: Check, color: "#1DE2C4" },
    { name: "Conhecimento", budget: 0, spent: 0, remaining: 0, used: "0.00%", total: "0.00%", icon: Layers, color: "#F1F11F" },
    { name: "Conforto", budget: 0, spent: 0, remaining: 0, used: "0.00%", total: "0.00%", icon: Car, color: "#8B5CF6" },
    { name: "Prazeres", budget: 0, spent: 0, remaining: 0, used: "0.00%", total: "0.00%", icon: Heart, color: "#EC4899" },
  ]

  const categoryColors: Record<string, string> = {
    "Gastos fixos": "#1B4965",
    "Emergências": "#E23B1D",
    "Liberdade": "#1DE2C4",
    "Conhecimento": "#F1F11F",
    "Conforto": "#8B5CF6",
    "Prazeres": "#EC4899",
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-6 py-8">
        {/* Top Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="bg-white rounded-2xl shadow-md px-6 py-4">
            <p className="text-xs text-gray-600 mb-1">renda mensal</p>
            {isEditingIncome ? (
              <input
                type="text"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(formatCurrency(e.target.value))}
                onBlur={() => setIsEditingIncome(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setIsEditingIncome(false)
                  }
                }}
                className="text-2xl font-bold text-gray-900 outline-none border-b-2 border-primary w-full"
                autoFocus
              />
            ) : (
              <p
                onClick={() => setIsEditingIncome(true)}
                className="text-2xl font-bold text-gray-900 cursor-pointer hover:text-primary transition-colors"
              >
                {monthlyIncome}
              </p>
            )}
          </div>

          <div className="flex gap-3">
            {activeTab === "budget" && (
              <button className="px-6 py-3 bg-primary text-white font-semibold rounded-lg transition-colors cursor-pointer">
                {selectedMonth}
              </button>
            )}
            <button
              onClick={() => setActiveTab("budget")}
              className={`px-6 py-3 font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === "budget"
                  ? "bg-primary text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Orçamento
            </button>
            <button
              onClick={() => setActiveTab("goals")}
              className={`px-6 py-3 font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === "goals" ? "bg-primary text-white" : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Metas
            </button>
          </div>
        </div>

        {/* Goals Header */}
        {activeTab === "goals" && (
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Metas</h2>
            <p className="text-gray-600">Edite os itens abaixo para ajustar as suas metas</p>
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
            onGoalPercentageChange={(categoryName, percentage) => {
              setGoalPercentages(prev => ({ ...prev, [categoryName]: percentage }))
            }}
            onReset={handleResetGoals}
            onSave={handleSaveGoals}
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
              onAddExpense={(name, value) => handleAddExpense(activeCategory, name, value)}
              onEditExpense={(id, name, value) => handleEditExpense(activeCategory, id, name, value)}
              onDeleteExpense={(id) => handleDeleteExpense(activeCategory, id)}
            />
          </>
        )}
      </main>
    </div>
  )
}
