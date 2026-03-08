import DOMPurify from 'dompurify';

/** Sanitize any user-facing string before rendering as HTML */
export function sanitize(dirty) {
  return DOMPurify.sanitize(dirty, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
}
