"use client";

interface AddExpenseFormProps {
  expenseName: string;
  expenseValue: string;
  onNameChange: (value: string) => void;
  onValueChange: (value: string) => void;
  onSubmit: () => void;
}

export function AddExpenseForm({
  expenseName,
  expenseValue,
  onNameChange,
  onValueChange,
  onSubmit,
}: AddExpenseFormProps) {
  return (
    <div className="border-gray-200 pt-6">
      <h3 className="text-lg font-bold text-black mb-4">Adicionar custo</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Nome
          </label>
          <input
            type="text"
            value={expenseName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Nome do gasto"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary bg-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Valor
          </label>
          <input
            type="text"
            value={expenseValue}
            onChange={(e) => onValueChange(e.target.value)}
            placeholder="R$ 0,00"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary bg-transparent"
          />
        </div>
      </div>
      <button
        onClick={onSubmit}
        className="w-full md:w-auto md:ml-auto md:flex py-3 px-6 bg-gray-200 text-gray-900 font-semibold rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
      >
        <span className="text-xl">+</span>
        Adicionar
      </button>
    </div>
  );
}
