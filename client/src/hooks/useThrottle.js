import { useRef, useCallback } from 'react';

/** Custom throttle — 100ms default, no lodash */
export function useThrottle(fn, limit = 100) {
  const lastRun = useRef(0);
  return useCallback((...args) => {
    const now = Date.now();
    if (now - lastRun.current >= limit) {
      lastRun.current = now;
      fn(...args);
    }
  }, [fn, limit]);
}
