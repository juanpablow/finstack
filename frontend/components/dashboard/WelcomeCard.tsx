"use client";

import { formatCurrencyBRL } from "@/lib/formatters";

interface WelcomeCardProps {
  name: string;
  monthlyIncome: number;
  monthlyExpenses: number;
}

export function WelcomeCard({
  name,
  monthlyIncome,
  monthlyExpenses,
}: WelcomeCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
      <div className="flex flex-col sm:flex-row items-start justify-between mb-6 md:mb-8 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
            Olá
          </h2>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">
            {name}!
          </p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-sm text-gray-600 font-semibold mb-2">
            Acesso rápido
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        <div className="md:border-r border-gray-200 md:pr-8 pb-4 md:pb-0 border-b md:border-b-0">
          <p className="text-sm text-gray-700 font-semibold mb-2">
            Receitas do mês atual
          </p>
          <p className="text-xl sm:text-2xl font-bold text-green-600">
            R$ {formatCurrencyBRL(monthlyIncome)}
          </p>
        </div>

        <div className="border-gray-200 md:pr-8 pb-4 md:pb-0 border-b md:border-b-0">
          <p className="text-sm text-gray-700 font-semibold mb-2">
            Despesas do mês atual
          </p>
          <p className="text-xl sm:text-2xl font-bold text-red-600">
            R$ {formatCurrencyBRL(monthlyExpenses)}
          </p>
        </div>
      </div>
    </div>
  );
}
