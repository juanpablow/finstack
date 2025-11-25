export function useCurrencyFormat() {
  const formatCurrency = (value: string): string => {
    // Remove tudo exceto números
    const numbers = value.replace(/\D/g, "");

    if (numbers === "") return "R$ 0,00";

    // Converte para número e divide por 100 para obter centavos
    const amount = parseInt(numbers) / 100;

    // Formata como moeda brasileira
    return (
      "R$ " +
      amount.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  };

  const parseCurrencyValue = (formattedValue: string): number => {
    const numbers = formattedValue.replace(/\D/g, "");
    return parseInt(numbers) / 100;
  };

  return { formatCurrency, parseCurrencyValue };
}
