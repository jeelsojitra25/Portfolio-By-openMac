import { useState, useCallback } from 'react';
import { useDebounce } from './useDebounce';
import { apiUrl } from '../utils/api';

export function useSearch() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchResults = useCallback(async (q) => {
    if (!q.trim()) { setResults([]); return; }
    setLoading(true);
    try {
      const res = await fetch(apiUrl(`/api/search?q=${encodeURIComponent(q)}`));
      const data = await res.json();
      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedFetch = useDebounce(fetchResults, 300);

  return { results, loading, search: debouncedFetch };
}
