"use client"

import { Header } from "@/components/layout/Header"
import { WelcomeCard } from "@/components/dashboard/WelcomeCard"
import { DashboardCard } from "@/components/dashboard/DashboardCard"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        {/* Welcome Card */}
        <div className="mb-8">
          <WelcomeCard name="Juan Pablo" monthlyIncome={0} monthlyExpenses={0} />
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Row 1 */}
          <DashboardCard
            title="Saldo geral"
            value="R$ 0,00"
            buttonText="Gerenciar contas"
          >
            <p className="text-gray-700 font-semibold mb-1">Minhas contas</p>
          </DashboardCard>

          <DashboardCard
            title="Todas as faturas"
            value="R$ 0,00"
            buttonText="Gerenciar cartões"
          >
            <p className="text-gray-700 font-semibold mb-1">Meus cartões</p>
          </DashboardCard>

          {/* Row 2 */}
          <DashboardCard title="Contas para pagar" showValue={false}>
            <p className="text-gray-400">Nenhum movimento</p>
          </DashboardCard>

          <DashboardCard title="Maiores gastos do mês atual" showValue={false}>
            <p className="text-gray-400">Nenhum movimento</p>
          </DashboardCard>

          {/* Row 3 */}
          <DashboardCard title="Contas a receber" showValue={false}>
            <p className="text-gray-400">Nenhum movimento</p>
          </DashboardCard>

          <DashboardCard title="Limites de gastos do mês atual" showValue={false}>
            <p className="text-gray-400">Nenhum movimento</p>
          </DashboardCard>
        </div>
      </main>
    </div>
  )
}
