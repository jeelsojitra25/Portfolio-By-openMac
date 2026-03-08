// In dev, Vite proxies /api → localhost:3001
// In production, requests go to the separate Render API service
const BASE = import.meta.env.VITE_API_URL || '';

export function apiUrl(path) {
  return `${BASE}${path}`;
}
