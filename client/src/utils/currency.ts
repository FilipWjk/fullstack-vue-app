/**
 * Formats a number as currency in EUR with locale formatting
 * @param value - The numeric value to format
 * @returns Formatted currency string (e.g., "1.234,56 €")
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value)
}
