import dayjs from 'dayjs'
import { DATE_DISPLAY_FORMAT, MONTH_YEAR_FORMAT } from '../constants'

/**
 * Format currency amount
 */
export function formatCurrency(amount: number, currency: string = 'LKR'): string {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Format number with commas
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`
}

/**
 * Format date for display
 */
export function formatDate(date: string | Date, format: string = DATE_DISPLAY_FORMAT): string {
  return dayjs(date).format(format)
}

/**
 * Format month and year
 */
export function formatMonthYear(month: number, year: number): string {
  return dayjs()
    .month(month - 1)
    .year(year)
    .format(MONTH_YEAR_FORMAT)
}

/**
 * Get month name from number
 */
export function getMonthName(month: number): string {
  if (month < 1 || month > 12) {
    return ''
  }

  return dayjs()
    .month(month - 1)
    .format('MMMM')
}

/**
 * Parse date string to dayjs object
 */
export function parseDate(date: string): dayjs.Dayjs {
  return dayjs(date)
}

/**
 * Get current month (1-12)
 */
export function getCurrentMonth(): number {
  return dayjs().month() + 1
}

/**
 * Get current year
 */
export function getCurrentYear(): number {
  return dayjs().year()
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number = 50): string {
  if (text.length <= maxLength) return text
  return `${text.substring(0, maxLength)}...`
}

/**
 * Capitalize first letter
 */
export function capitalize(text: string): string {
  if (!text) return ''
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

/**
 * Format transaction type for display
 */
export function formatTransactionType(type: string): string {
  return capitalize(type)
}

/**
 * Get color based on transaction type
 */
export function getTypeColor(type: string): 'success' | 'error' {
  return type === 'INCOME' ? 'success' : 'error'
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0
  return (value / total) * 100
}
