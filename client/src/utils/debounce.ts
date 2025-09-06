/**
 * Creates a debounced version of a function that delays invoking until after
 * `wait` milliseconds have elapsed since the last time it was invoked.
 *
 * @param fn - The function to debounce
 * @param wait - The number of milliseconds to delay
 * @returns A debounced version of the function
 */
export const debounce = <T extends (...args: unknown[]) => void>(
  fn: T,
  wait = SEARCH_DEBOUNCE_DELAY,
) => {
  let timer: ReturnType<typeof setTimeout> | null = null
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), wait)
  }
}

// ? Standard debounce delay for search inputs
export const SEARCH_DEBOUNCE_DELAY = 400
