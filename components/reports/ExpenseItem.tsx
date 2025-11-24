"use client"

import { Pencil, Trash2 } from "lucide-react"

interface Expense {
  id: string
  name: string
  value: number
}

interface ExpenseItemProps {
  expense: Expense
  isEditing: boolean
  editName: string
  editValue: string
  onEditNameChange: (value: string) => void
  onEditValueChange: (value: string) => void
  onSaveEdit: () => void
  onStartEdit: () => void
  onDelete: () => void
}

export function ExpenseItem({
  expense,
  isEditing,
  editName,
  editValue,
  onEditNameChange,
  onEditValueChange,
  onSaveEdit,
  onStartEdit,
  onDelete,
}: ExpenseItemProps) {
  return (
    <div className="flex items-center justify-between border-b border-dotted border-gray-300 py-4">
      {isEditing ? (
        <>
          <input
            type="text"
            value={editName}
            onChange={(e) => onEditNameChange(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-900 mr-2"
            placeholder="Nome do gasto"
          />
          <input
            type="text"
            value={editValue}
            onChange={(e) => onEditValueChange(e.target.value)}
            className="w-32 px-3 py-2 border border-gray-300 rounded-lg text-gray-900 mr-2"
            placeholder="R$ 0,00"
          />
          <button
            onClick={onSaveEdit}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Salvar
          </button>
        </>
      ) : (
        <>
          <p className="flex-1 text-gray-900">{expense.name}</p>
          <div className="flex items-center gap-4">
            <p className="text-gray-900 font-semibold">
              R$ {expense.value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <div className="flex gap-2">
              <button
                onClick={onStartEdit}
                className="p-2 bg-primary hover:bg-blue-500 text-white rounded-full transition-colors cursor-pointer"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={onDelete}
                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
