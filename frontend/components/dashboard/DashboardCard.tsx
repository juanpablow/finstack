"use client"

import { Eye, EyeOff } from "lucide-react"
import { ReactNode, useState } from "react"

interface DashboardCardProps {
  title: string
  value?: string
  showValue?: boolean
  children?: ReactNode
  buttonText?: string
  onButtonClick?: () => void
}

export function DashboardCard({
  title,
  value,
  showValue = true,
  children,
  buttonText,
  onButtonClick,
}: DashboardCardProps) {
  const [isVisible, setIsVisible] = useState(true)

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 h-full flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-base font-bold text-gray-900">{title}</h3>
        {showValue && value && (
          <button
            onClick={() => setIsVisible(!isVisible)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            {isVisible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          </button>
        )}
      </div>

      {value && (
        <p className="text-2xl font-bold text-gray-900 mb-6">
          {isVisible ? value : "••••••"}
        </p>
      )}

      <div className="flex-1 flex items-center justify-center text-gray-400 text-sm mb-6">
        {children || "Nenhum movimento"}
      </div>

      {buttonText && (
        <button
          onClick={onButtonClick}
          className="w-full py-3 px-4 border-2 border-gray-300 rounded-lg text-gray-600 font-semibold hover:bg-gray-50 transition-colors"
        >
          {buttonText}
        </button>
      )}
    </div>
  )
}
