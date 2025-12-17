export const debounce = <T extends (...args: string[]) => any>(
  func: T,
  wait: number
)?: (e: any) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);

    timeout = setTimeout(() => func(...args), wait);};
};

export const throttle = <T extends (...args: string[]) => any>(
  func: T,
  limit: number
)?: (e: any) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);

      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);

    } ;
};

export const memoize = <T extends (...args: string[]) => any>(func: T) => {
  const cache = new Map();

  return (...args: Parameters<T>) => {
    const key = JSON.stringify(args);

    if (cache.has(key)) return cache.get(key);

    const result = func(...args);

    cache.set(key, result);

    return result;};
};
