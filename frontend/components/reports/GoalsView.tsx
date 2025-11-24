import { Category } from "@/types/reports"
import { useState, useEffect, JSX } from "react"
import { CategoryLegend } from "./CategoryLegend"

interface GoalsViewProps {
  categories: Category[]
  categoryColors: Record<string, string>
  goalPercentages: Record<string, number>
  monthlyIncome: number
  onGoalPercentageChange: (categoryName: string, percentage: number) => void
  onReset: () => void
  onSave: () => void
}

export function GoalsView({ categories, categoryColors, goalPercentages, monthlyIncome, onGoalPercentageChange, onReset, onSave }: GoalsViewProps) {
  const [localPercentages, setLocalPercentages] = useState(goalPercentages)

  useEffect(() => {
    setLocalPercentages(goalPercentages)
  }, [goalPercentages])

  const handleSliderChange = (categoryName: string, value: number) => {
    setLocalPercentages(prev => ({ ...prev, [categoryName]: value }))
    onGoalPercentageChange(categoryName, value)
  }

  const totalPercentage = Object.values(localPercentages).reduce((sum, val) => sum + val, 0)
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Card - Donut Chart */}
      <div className="bg-white rounded-2xl shadow-md p-8 h-full">
        <div className="flex flex-col items-center mb-8">
          {/* Total Percentage Above Chart */}
          <div className="mb-6 text-center">
            <p className={`text-5xl font-bold ${totalPercentage > 100 ? 'text-red-600' : 'text-gray-900'}`}>
              {totalPercentage}%
            </p>
            {totalPercentage > 100 && (
              <p className="text-sm text-red-600 font-semibold mt-2">
                Ultrapassou {totalPercentage - 100}% da meta
              </p>
            )}
          </div>
          
          <div className="relative w-64 h-64 mb-6">
            <svg className="w-full h-full" viewBox="0 0 200 200">
              <g transform="rotate(-90 100 100)">
                {/* Background circle */}
                <circle cx="100" cy="100" r="80" fill="none" stroke="#E5E7EB" strokeWidth="40" />
                
                {/* Category segments */}
                {categories.reduce<{ segments: JSX.Element[], offset: number }>((acc, cat) => {
                  const percentage = localPercentages[cat.name] || 0
                  const circumference = 2 * Math.PI * 80
                  const segmentLength = (percentage / 100) * circumference
                  
                  acc.segments.push(
                    <circle
                      key={cat.name}
                      cx="100"
                      cy="100"
                      r="80"
                      fill="none"
                      stroke={cat.color}
                      strokeWidth="40"
                      strokeDasharray={`${segmentLength} ${circumference}`}
                      strokeDashoffset={-acc.offset}
                      style={{ transition: 'stroke-dasharray 0.3s ease, stroke-dashoffset 0.3s ease' }}
                    />
                  )
                  
                  acc.offset += segmentLength
                  return acc
                }, { segments: [], offset: 0 }).segments}
              </g>
            </svg>
          </div>

          {/* Legend */}
          <CategoryLegend categories={categories} categoryColors={categoryColors} />
        </div>
      </div>

      {/* Right Card - Goals Sliders */}
      <div className="bg-white rounded-2xl shadow-md p-8 flex flex-col" style={{ height: '600px' }}>
        <div className="flex-1 overflow-y-auto space-y-8 pr-4">
          {categories.map((cat) => {
            const currentPercentage = localPercentages[cat.name] || 0
            return (
              <div key={cat.name}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-gray-900">{cat.name}</h3>
                  <span className="text-sm text-gray-600">{currentPercentage}%</span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={currentPercentage}
                    onChange={(e) => handleSliderChange(cat.name, parseInt(e.target.value))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, ${cat.color} ${currentPercentage}%, #D1D5DB ${currentPercentage}%)`,
                    }}
                  />
                  
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>
            )
          })}
        </div>
        
        {/* Total Percentage */}
        <div className="pt-6 border-t border-gray-200 shrink-0">
          
          {/* Action Buttons */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={onReset}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
            >
              Resetar
            </button>
            <button
              onClick={onSave}
              className="flex-1 px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
