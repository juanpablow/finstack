import { Category } from "@/types/reports"
import { CategoryLegend } from "./CategoryLegend"

interface BudgetViewProps {
  categories: Category[]
  categoryColors: Record<string, string>
  monthlyIncome: number
  goalPercentages: Record<string, number>
  categoryExpenses: Record<string, Array<{ id: string; name: string; value: number }>>
}

export function BudgetView({ categories, categoryColors, monthlyIncome, goalPercentages, categoryExpenses }: BudgetViewProps) {
  const totalToSpend = monthlyIncome
  const totalSpent = Object.values(categoryExpenses).reduce((sum, expenses) => 
    sum + expenses.reduce((expSum, exp) => expSum + exp.value, 0), 0
  )

  // Calcular os segmentos do donut chart baseado nos gastos de cada categoria
  const radius = 80
  const circumference = 2 * Math.PI * radius

  const segments = categories.reduce<Array<{color: string, offset: number, length: number, percentage: number}>>((acc, cat) => {
    const expenses = categoryExpenses[cat.name] || []
    const spent = expenses.reduce((sum, exp) => sum + exp.value, 0)
    const percentage = totalSpent > 0 ? (spent / totalSpent) * 100 : 0
    const segmentLength = (circumference * percentage) / 100
    
    const currentOffset = acc.reduce((sum, seg) => sum + seg.length, 0)
    
    const segment = {
      color: categoryColors[cat.name],
      offset: currentOffset,
      length: segmentLength,
      percentage
    }
    
    return [...acc, segment]
  }, [])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Orçamento Card */}
      <div className="bg-white rounded-2xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-primary mb-8">ORÇAMENTO</h2>

        {/* Donut Chart */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-64 h-64 mb-6">
            <svg className="w-full h-full" viewBox="0 0 200 200" style={{ transform: "rotate(-90deg)" }}>
              {/* Background circle */}
              <circle cx="100" cy="100" r="80" fill="none" stroke="#E5E7EB" strokeWidth="40" />
              
              {/* Colored segments */}
              {segments.map((segment, index) => (
                segment.length > 0 && (
                  <circle
                    key={index}
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke={segment.color}
                    strokeWidth="40"
                    strokeDasharray={`${segment.length} ${circumference}`}
                    strokeDashoffset={-segment.offset}
                    style={{ transition: "stroke-dasharray 0.3s ease, stroke-dashoffset 0.3s ease" }}
                  />
                )
              ))}
            </svg>
            
            {/* Center text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-lg font-bold text-gray-900">
                R$ {monthlyIncome.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* Legend */}
          <CategoryLegend categories={categories} categoryColors={categoryColors} />
        </div>
      </div>

      {/* Resumo Card */}
      <div className="bg-white rounded-2xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-primary mb-6">RESUMO</h2>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 text-sm font-bold text-gray-900">Budget</th>
                <th className="text-left py-3 text-sm font-bold text-gray-900">Valor gasto</th>
                <th className="text-left py-3 text-sm font-bold text-gray-900">Devo gastar</th>
                <th className="text-left py-3 text-sm font-bold text-gray-900">Utilizado</th>
                <th className="text-left py-3 text-sm font-bold text-gray-900">Total</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, index) => {
                const percentage = goalPercentages[cat.name] || 0
                const budgetAmount = (monthlyIncome * percentage) / 100
                const expenses = categoryExpenses[cat.name] || []
                const spent = expenses.reduce((sum, exp) => sum + exp.value, 0)
                const usedPercentage = budgetAmount > 0 ? (spent / budgetAmount) * 100 : 0
                return (
                  <tr key={cat.name} className={index < categories.length - 1 ? "border-b border-gray-200" : ""}>
                    <td className="py-4 text-sm text-gray-700">{cat.name}</td>
                    <td className="py-4 text-sm text-gray-700">R$ {budgetAmount.toFixed(2)}</td>
                    <td className="py-4 text-sm text-gray-700">R$ {spent.toFixed(2)}</td>
                    <td className="py-4 text-sm text-green-600 font-semibold">{usedPercentage.toFixed(2)}%</td>
                    <td className="py-4 text-sm text-gray-700">{percentage.toFixed(2)}%</td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {/* Totals */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t-2 border-gray-300">
            <div>
              <p className="text-xl font-bold text-green-600">
                R$ {totalSpent.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-gray-600 font-semibold">TOTAL GASTOS</p>
            </div>
            <div>
              <p className="text-xl font-bold text-green-600">
                R$ {totalToSpend.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-gray-600 font-semibold">TOTAL A GASTAR</p>
            </div>
            <div>
              <p className="text-xl font-bold text-green-600">
                {totalToSpend > 0 ? ((totalSpent / totalToSpend) * 100).toFixed(2) : '0.00'}%
              </p>
              <p className="text-xs text-gray-600 font-semibold">UTILIZADO</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
