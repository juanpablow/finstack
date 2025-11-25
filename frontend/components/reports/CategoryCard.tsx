"use client";

import { useCurrencyFormat } from "@/hooks/useCurrencyFormat";
import { formatCurrencyBRL } from "@/lib/formatters";
import { Expense } from "@/types/expense";
import { useState } from "react";
import { AddExpenseForm } from "./AddExpenseForm";
import { ExpenseItem } from "./ExpenseItem";

interface CategoryCardProps {
  categoryName: string;
  expenses: Expense[];
  onAddExpense: (name: string, value: number) => void;
  onEditExpense: (id: string, name: string, value: number) => void;
  onDeleteExpense: (id: string) => void;
}

export function CategoryCard({
  categoryName,
  expenses,
  onAddExpense,
  onEditExpense,
  onDeleteExpense,
}: CategoryCardProps) {
  const [newExpenseName, setNewExpenseName] = useState("");
  const [newExpenseValue, setNewExpenseValue] = useState("R$ 0,00");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editValue, setEditValue] = useState("R$ 0,00");

  const { formatCurrency, parseCurrencyValue } = useCurrencyFormat();

  const handleAdd = () => {
    if (newExpenseName.trim() && newExpenseValue) {
      const value = parseCurrencyValue(newExpenseValue);
      if (!isNaN(value) && value > 0) {
        onAddExpense(newExpenseName.trim(), value);
        setNewExpenseName("");
        setNewExpenseValue("R$ 0,00");
      }
    }
  };

  const handleEdit = (id: string) => {
    if (editName.trim() && editValue) {
      const value = parseCurrencyValue(editValue);
      if (!isNaN(value) && value > 0) {
        onEditExpense(id, editName.trim(), value);
        setEditingId(null);
        setEditName("");
        setEditValue("R$ 0,00");
      }
    }
  };

  const startEdit = (expense: Expense) => {
    setEditingId(expense.id);
    setEditName(expense.name);
    setEditValue("R$ " + formatCurrencyBRL(expense.value));
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-8">
      <h2 className="text-2xl font-bold mb-6 text-primary">{categoryName}</h2>

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-gray-600">Custo</p>
        <p className="text-sm font-semibold text-gray-600">Valor Gasto</p>
      </div>

      {/* Expenses List */}
      <div className="mb-6 -space-y-px">
        {expenses.length === 0 ? (
          <p className="text-gray-400 text-center py-8">
            Nenhum custo adicionado
          </p>
        ) : (
          <>
            {expenses.map((expense) => (
              <ExpenseItem
                key={expense.id}
                expense={expense}
                isEditing={editingId === expense.id}
                editName={editName}
                editValue={editValue}
                onEditNameChange={setEditName}
                onEditValueChange={(value) =>
                  setEditValue(formatCurrency(value))
                }
                onSaveEdit={() => handleEdit(expense.id)}
                onStartEdit={() => startEdit(expense)}
                onDelete={() => onDeleteExpense(expense.id)}
              />
            ))}
          </>
        )}
      </div>

      {/* Add New Expense */}
      <AddExpenseForm
        expenseName={newExpenseName}
        expenseValue={newExpenseValue}
        onNameChange={setNewExpenseName}
        onValueChange={(value) => setNewExpenseValue(formatCurrency(value))}
        onSubmit={handleAdd}
      />
    </div>
  );
}
