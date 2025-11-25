interface MonthSelectorProps {
  selectedMonth: number;
  selectedYear: number;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

export function MonthSelector({
  selectedMonth,
  selectedYear,
  onPreviousMonth,
  onNextMonth,
}: MonthSelectorProps) {
  const getMonthName = (month: number): string => {
    const months = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];
    return months[month - 1];
  };

  return (
    <div className="bg-white rounded-2xl shadow-md px-6 py-4 flex items-center justify-between gap-4">
      <button
        onClick={onPreviousMonth}
        className="text-gray-600 hover:text-primary transition-colors p-2 shrink-0 self-center"
        aria-label="Mês anterior"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
      <div className="text-center flex-1 flex flex-col">
        <p className="text-xs text-gray-600 leading-tight">período</p>
        <p className="text-2xl font-bold text-gray-900 leading-tight">
          {getMonthName(selectedMonth)} {selectedYear}
        </p>
      </div>
      <button
        onClick={onNextMonth}
        className="text-gray-600 hover:text-primary transition-colors p-2 shrink-0 self-center"
        aria-label="Próximo mês"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>
  );
}
