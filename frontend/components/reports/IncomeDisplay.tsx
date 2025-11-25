import { useState } from "react";

interface IncomeDisplayProps {
  monthlyIncome: string;
  isLoading: boolean;
  onSaveIncome: (value: string) => void;
  formatCurrency: (value: string) => string;
  parseCurrencyValue: (value: string) => number;
}

export function IncomeDisplay({
  monthlyIncome,
  isLoading,
  onSaveIncome,
  formatCurrency,
  parseCurrencyValue,
}: IncomeDisplayProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempIncome, setTempIncome] = useState("R$ 0,00");

  const handleSave = () => {
    const amount = parseCurrencyValue(tempIncome);
    if (amount > 0) {
      onSaveIncome(tempIncome);
    }
    setIsEditing(false);
  };

  const handleStartEdit = () => {
    setIsEditing(true);
    setTempIncome("R$ 0,00");
  };

  return (
    <div className="bg-white rounded-2xl shadow-md px-6 py-4">
      <p className="text-xs text-gray-600 mb-1">renda mensal</p>
      {isEditing ? (
        <input
          type="text"
          value={tempIncome}
          onChange={(e) => setTempIncome(formatCurrency(e.target.value))}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSave();
            }
          }}
          className="text-2xl font-bold text-gray-900 outline-none border-b-2 border-primary w-full"
          autoFocus
        />
      ) : (
        <p
          onClick={handleStartEdit}
          className="text-2xl font-bold text-gray-900 cursor-pointer hover:text-primary transition-colors"
        >
          {isLoading ? "Carregando..." : monthlyIncome}
        </p>
      )}
    </div>
  );
}
