import { useEffect, useRef, useCallback } from 'react';

/** Custom debounce — 300ms default, no lodash */
export function useDebounce(fn, delay = 300) {
  const timer = useRef(null);
  return useCallback((...args) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => fn(...args), delay);
  }, [fn, delay]);
}
