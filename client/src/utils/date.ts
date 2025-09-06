/**
 * Formats a date to DD.MM.YYYY format
 * @param date - Date string, Date object, or timestamp
 * @returns Formatted date string (e.g., "02.09.2025")
 */
export function formatDate(date: string | Date | number): string {
  const dateObj = new Date(date)

  // * Check if date is valid
  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date'
  }

  const day = dateObj.getDate().toString().padStart(2, '0')
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0')
  const year = dateObj.getFullYear()

  return `${day}.${month}.${year}`
}

/**
 * Formats a date to DD.MM.YYYY HH:MM format
 * @param date - Date string, Date object, or timestamp
 * @returns Formatted date and time string (e.g., "02.09.2025 14:30")
 */
export function formatDateTime(date: string | Date | number): string {
  const dateObj = new Date(date)

  // * Check if date is valid
  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date'
  }

  const day = dateObj.getDate().toString().padStart(2, '0')
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0')
  const year = dateObj.getFullYear()
  const hours = dateObj.getHours().toString().padStart(2, '0')
  const minutes = dateObj.getMinutes().toString().padStart(2, '0')

  return `${day}.${month}.${year} ${hours}:${minutes}`
}
