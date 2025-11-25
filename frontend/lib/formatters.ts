/**
 * Formata um valor numérico como moeda brasileira (R$)
 */
export function formatCurrencyBRL(value: number): string {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Formata um valor de porcentagem com 2 casas decimais
 */
export function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`;
}

/**
 * Formata um valor de porcentagem inteira sem casas decimais
 */
export function formatPercentageInt(value: number): string {
  return `${Math.round(value)}%`;
}
