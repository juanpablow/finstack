"use client"

import { Plus, Minus, Download } from "lucide-react"

interface WelcomeCardProps {
  name: string
  monthlyIncome: number
  monthlyExpenses: number
}

export function WelcomeCard({ name, monthlyIncome, monthlyExpenses }: WelcomeCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-1">Olá</h2>
          <p className="text-3xl font-bold text-gray-900">{name}!</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600 font-semibold mb-2">Acesso rápido</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8 mb-8">
        <div className="border-r border-gray-200 pr-8">
          <p className="text-sm text-gray-700 font-semibold mb-2">Receitas do mês atual</p>
          <p className="text-2xl font-bold text-green-600">
            R$ {monthlyIncome.toFixed(2).replace(".", ",")}
          </p>
        </div>

        <div className="border-r border-gray-200 pr-8">
          <p className="text-sm text-gray-700 font-semibold mb-2">Despesas do mês atual</p>
          <p className="text-2xl font-bold text-red-600">
            R$ {monthlyExpenses.toFixed(2).replace(".", ",")}
          </p>
        </div>

        <div className="flex items-center gap-6 pl-4">
          <button className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-lg font-semibold text-gray-700">Receita</span>
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
              <Plus className="w-6 h-6 text-green-600" />
            </div>
          </button>

          <button className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-lg font-semibold text-gray-700">Despesas</span>
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
              <Minus className="w-6 h-6 text-red-600" />
            </div>
          </button>

          <button className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-lg font-semibold text-gray-700">Importar</span>
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
              <Download className="w-6 h-6 text-blue-600" />
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
